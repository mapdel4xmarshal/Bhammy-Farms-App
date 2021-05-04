const request = require('request');
const Notification = require('../../notification/notification');

const {
  Production, Vaccination, Batch, Sequelize: { Op }, sequelize, Location, House, ProductionItem, Mortality, Medication,
  Item, Breed
} = require('../../models');

const ProductionSummary = require('./productionSummary');

class Controller {
  async getProductions({
    batchId, before, after, date, isActive, productionId
  }) {
    const where = [];
    if (isActive !== null && isActive !== undefined) where.push(`batches.is_active = '${isActive}'`);
    if (batchId) where.push(`batches.batch_id = '${batchId}'`);
    if (before) where.push(`productions.date <= '${before}'`);
    if (after) where.push(`productions.date >= '${after}'`);
    if (date) where.push(`productions.date = '${date}'`);
    if (productionId) where.push(`productions.production_id = '${productionId}'`);

    return sequelize.query(`
    SELECT productions.production_id AS id, productions.water, mortality.id AS mortalityId, mortality.count AS mortalityCount, productions.date,
      production_items.quantity AS itemQuantity, production_items.price AS itemPrice, batches.initial_stock_count AS initialFlockCount,
      batches.name AS batch, batches.initial_stock_count AS flockCount, batches.is_active AS isActive, breeds.type AS batchType,
      items.item_id AS itemId, items.item_name AS itemName, items.category AS itemCategory, items.packaging_size AS packagingSize, items.unit AS itemUnit,
      production_items.id AS productionItemsId, productions.humidity AS humidity, productions.temperature AS temperature,
      vaccinations.administered_by AS vaccineAdministrator, vaccinations.notes AS vaccinationNotes,
      vaccinations.vaccination_id AS vaccinationId, vaccinations.vaccine_batch_no AS vaccineBatchNo,
      vaccinations.method AS vaccinationMethod, vaccinations.vaccine_id AS vaccineId,
      vaccinations.dosage AS vaccineDosage, vaccinations.dosage_unit AS vaccineDosageUnit,
      vaccinations.total_dosage AS vaccineTotalDosage, vaccinations.no_of_birds AS vaccinatedBirds,

      medication.administered_by AS medicamentAdministrator, medication.notes AS medicationNotes,
      medication.medication_id AS medicationId, medication.medicament_batch_no AS medicamentBatchNo,
      medication.method AS medicationMethod, medication.medicament_id AS medicamentId, medication.dosage AS medicamentDosage,
      medication.dosage_unit AS medicamentDosageUnit, medication.total_dosage AS medicamentTotalDosage, medication.no_of_birds AS medicatedBirds,

      DATEDIFF(productions.date, batches.move_in_date) + batches.move_in_age AS batchAge
    FROM productions
    JOIN batches ON productions.batch_id = batches.batch_id
    JOIN breeds ON batches.breed_id = breeds.breed_id
    LEFT JOIN mortality ON productions.production_id = mortality.production_id
    LEFT JOIN production_items ON productions.production_id = production_items.production_id
    LEFT JOIN items ON production_items.item_id = items.item_id
    LEFT JOIN vaccinations ON productions.production_id = vaccinations.production_id
    LEFT JOIN medication ON productions.production_id = medication.production_id
    ${where.length > 0 ? ` WHERE ${where.join(' AND ')}` : ''}
    ORDER BY productions.date ASC;
`)
      .then(async ([productions]) => {
        productions = await this.processProduction(productions);
        const totalMortality = {};
        return productions.map((production) => {
          const productionSummary = new ProductionSummary(production);
          if (!totalMortality[production.batch]) totalMortality[production.batch] = 0;
          totalMortality[production.batch] += productionSummary.mortality;
          productionSummary.flockCount -= totalMortality[production.batch];
          return productionSummary;
        }).reverse();
      });
  }

  async addProduction(user, production) {
    const activeBatch = await Batch.findOne({
      where: {
        batch_id: production.batchId,
        move_out_date: {
          [Op.gt]: new Date()
        }
      },
      include: [{
        model: House,
        include: [{
          model: Location,
          as: 'location'
        }]
      }]
    });

    if (!activeBatch) {
      return {
        error: 'The specified batch doesn\'t exist or is inactive.',
        status: 400
      };
    }

    const productionCount = await Production.count({
      where: {
        batch_id: production.batchId,
        date: production.date
      }
    });

    if (productionCount > 0) {
      return {
        error: 'A production already exist for the specified batch and date.',
        status: 400
      };
    }

    const { longitude, latitude } = activeBatch.House.location;
    const weather = await this.getWeatherInfo(`${longitude},${latitude}`, production.date);

    if (!weather.error) {
      production.humidity = weather.forecast.forecastday[0].day.avghumidity;
      production.temperature = weather.forecast.forecastday[0].day.avgtemp_c;
      production.weather_condition = weather.forecast.forecastday[0].day.condition.text;
    }

    const transaction = await sequelize.transaction();

    try {
      const newProduction = await Production.create({
        date: production.date,
        humidity: production.humidity,
        temperature: production.temperature,
        weather_condition: production.weather_condition,
        water: production.water,
        note: production.note,
        batch_id: production.batchId
      }, {
        transaction,
        user,
        resourceId: 'production_id'
      });

      const productionId = newProduction.production_id;
      const productItems = [...production.eggs, ...production.feeds];

      const itemPriceMap = await Item.findAll({
        attributes: ['item_id', 'price'],
        where: {
          item_id: {
            [Op.in]: productItems.map((item) => item.id)
          }
        }
      })
        .then((items) => new Map(items.map((item) => [item.item_id, item.price])));

      await ProductionItem.bulkCreate(productItems.map((item) => ({
        quantity: item.quantity,
        item_id: item.id,
        price: itemPriceMap.get(item.id),
        production_id: productionId
      })), {
        transaction,
        user,
        resourceId: 'id'
      });

      for (const egg of production.eggs) {
        await Item.increment('quantity', {
          by: Number(egg.quantity),
          where: { item_id: egg.id },
          transaction,
          user,
          resourceId: 'item_id'
        });
      }

      for (const feed of production.feeds) {
        await Item.decrement('quantity', {
          by: Number(feed.quantity),
          where: { item_id: feed.id },
          transaction,
          user,
          resourceId: 'item_id'
        });
      }

      await Mortality.bulkCreate(production.mortality.map((mortality) => ({
        time: mortality.time,
        reason: mortality.reason,
        count: mortality.count,
        description: mortality.comment,
        production_id: productionId
      })), {
        transaction,
        user,
        resourceId: 'id'
      });


      await this.processTreatment('vaccination', production.vaccinations, productionId, transaction, user, activeBatch);
      await this.processTreatment('medication', production.medications, productionId, transaction, user, activeBatch);

      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      await transaction.commit();

      // Push notify
      new Notification().send('Production',
        `A new production record was added by ${user.displayName}`, `batches/${newProduction.batch_id}`);

      return newProduction;
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      return {
        error: 'Unable to process request. Please try again later!',
        status: 500
      };
    }
  }

  async processTreatment(type, treatments, productionId, transaction, user, activeBatch) {
    const medType = type === 'vaccination' ? 'vaccine' : 'medicament';
    const modelType = type === 'vaccination' ? 'Vaccination' : 'Medication';

    treatments = treatments.map((treatment) => ({
      production_id: productionId,
      [`${medType}_id`]: treatment[medType].id,
      [`${medType}_batch_no`]: treatment[`${medType}BatchNo`],
      dosage: treatment.dosage || 0,
      dosage_unit: treatment.dosageUnit || 'N/A',
      total_dosage: treatment.totalDosage,
      no_of_birds: treatment.noOfBirds || activeBatch.initial_stock_count,
      method: treatment[`${type}Method`],
      administered_by: treatment.administeredBy,
      notes: treatment.reason
    }));

    for (const item of treatments) {
      await Item.decrement('quantity',
        {
          by: Number(item.total_dosage),
          where: { item_id: item[`${medType}_id`] },
          user,
          resourceId: 'item_id',
          transaction
        });
    }

    return eval(modelType)
      .bulkCreate(treatments, {
        transaction,
        user,
        resourceId: `${type}_id`
      });
  }

  async getWeatherInfo(coordinate, date) {
    return new Promise((resolve) => {
      request.get(`http://api.weatherapi.com/v1/history.json?key=aa5f3c747bb140be95f230031202507&q=${
        coordinate}&dt=${date}`, (error, resp, data) => {
        if (error) {
          console.log(error);
          resolve({ error });
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  async getProductionById(productionId) {
    return Production.findAll({
      where,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [{
        model: Batch,
        include: Breed
      }, {
        model: Vaccination,
        include: Item
      }, Medication, Mortality, {
        model: Item,
        through: ProductionItem
      }]
    })
      .then((productions) => productions.map((production) => new ProductionSummary(production)));
  }

  async updateProduction(BatchId) {
    return Batch.findOne({
      where: { id: BatchId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
      .then((Batch) => Batch);
  }

  async processProduction(productions) {
    const productionMap = new Map();

    productions.forEach((production) => {
      if (!productionMap.has(production.id)) {
        productionMap.set(production.id, {
          id: production.id,
          date: production.date,
          batch: production.batch,
          batchType: production.batchType,
          isActive: production.isActive,
          flockCount: production.flockCount,
          initialFlockCount: production.initialFlockCount,
          water: production.water,
          mortality: new Map(),
          items: new Map(),
          batchAge: production.batchAge,
          temperature: production.temperature,
          humidity: production.humidity,
          vaccinations: new Map(),
          medications: new Map()
        });
      }

      const productionGroup = productionMap.get(production.id);

      productionGroup.mortality.set(production.mortalityId, { count: production.mortalityCount });

      if (production.vaccinationId) {
        productionGroup.vaccinations.set(production.vaccinationId, {
          batchNo: production.vaccineBatchNo,
          dosage: production.vaccineDosage,
          dosageUnit: production.vaccineDosageUnit,
          totalDosage: production.vaccineTotalDosage,
          vaccineId: production.vaccineId,
          vaccinationId: production.vaccinationId,
          vaccinationMethod: production.vaccinationMethod,
          administrator: production.vaccineAdministrator,
          note: production.vaccinationNotes,
          noOfBirds: production.vaccinatedBirds
        });
      }

      if (production.medicationId) {
        productionGroup.medications.set(production.medicationId, {
          batchNo: production.medicamentBatchNo,
          dosage: production.medicamentDosage,
          dosageUnit: production.medicamentDosageUnit,
          totalDosage: production.medicamentTotalDosage,
          medicamentId: production.medicamentId,
          medicationId: production.medicationId,
          medicationMethod: production.medicationMethod,
          administrator: production.medicamentAdministrator,
          note: production.medicationNotes,
          noOfBirds: production.medicatedBirds
        });
      }

      productionGroup.items.set(production.productionItemsId, {
        id: production.itemId,
        name: production.itemName,
        quantity: production.itemQuantity,
        price: production.itemPrice,
        category: production.itemCategory,
        packagingSize: production.packagingSize,
        unit: production.itemUnit
      });
    });

    return Array.from(productionMap.values());
  }

  async deleteProduction(productionId, user) {
    const productions = await this.getProductions({ productionId });
    const production = productions[0] || null;

    if (!production) {
      return {
        error: `No production found with id ${productionId}`,
        status: 400
      };
    }

    const transaction = await sequelize.transaction();

    // Reverse eggs
    for (const egg of production.eggTypes) {
      await Item.decrement('quantity', {
        by: Number(egg.quantity),
        where: { item_id: egg.id },
        transaction,
        user,
        resourceId: 'item_id'
      });
    }

    // Reverse feeds
    for (const feed of production.feedTypes) {
      await Item.increment('quantity', {
        by: Number(feed.quantity),
        where: { item_id: feed.id },
        transaction,
        user,
        resourceId: 'item_id'
      });
    }

    // Reverse medications
    for (const medication of production.medications) {
      await Item.increment('quantity', {
        by: Number(medication.totalDosage),
        where: { item_id: medication.medicamentId },
        transaction,
        user,
        resourceId: 'item_id'
      });
    }

    // Reverse vaccination
    for (const vaccination of production.vaccinations) {
      await Item.increment('quantity', {
        by: Number(vaccination.totalDosage),
        where: { item_id: vaccination.vaccineId },
        transaction,
        user,
        resourceId: 'item_id'
      });
    }

    // Reverse mortality
    await Mortality.destroy({
      where: {
        production_id: production.id
      }
    });

    // Delete production
    await Production.destroy({
      where: {
        production_id: production.id
      }
    });

    await transaction.commit();
  }
}

module.exports = new Controller();
