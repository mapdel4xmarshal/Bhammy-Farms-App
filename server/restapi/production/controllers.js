const request = require('request');
const Notification = require('../../notification/notification');
const Bot = require('./Bot');

const {
  Production, Vaccination, Batch, Sequelize: { Op }, sequelize, Location, House, ProductionItem, Mortality, Medication,
  Item, ItemInventory, ItemConsumption
} = require('../../models');

const ProductionSummary = require('./productionSummary');
const Debug = require('../../utilities/debugger');
const itemsController = require('../items/controllers');

const debug = new Debug('Production:Controller');

class Controller {
  constructor() {
    new Bot(this).listen();
  }

  async getProductions({
    batchId, before, after, date, isActive, productionId
  }) {
    const where = [];
    const subQueryWhere = [];
    if (isActive !== null && isActive !== undefined) {
      where.push(`batches.is_active = '${isActive}'`);
      subQueryWhere.push(`batches.is_active = '${isActive}'`);
    }
    if (batchId) {
      where.push(`batches.batch_id = '${batchId}'`);
      subQueryWhere.push(`batches.batch_id = '${batchId}'`);
    }
    if (before) {
      where.push(`productions.date <= '${before}'`);
      subQueryWhere.push(`productions.date <= '${before}'`);
    }
    if (after) where.push(`productions.date >= '${after}'`);
    if (date) {
      where.push(`productions.date = '${date}'`);
      subQueryWhere.push(`productions.date <= '${date}'`);
    }
    if (productionId) where.push(`productions.production_id = '${productionId}'`);

    return sequelize.query(`
    SELECT productions.production_id AS id, productions.water, productions.date,
      production_items.quantity AS itemQuantity, production_items.price AS itemPrice,
      batches.initial_stock_count AS initialFlockCount,
      batches.name AS batch, mrt.mortality, mrt.flockCount, mrt.cumulativeMortality, batches.is_active AS isActive,
      breeds.type AS batchType, items.item_id AS itemId, items.item_name AS itemName, items.category AS itemCategory,
      items.packaging_size AS packagingSize, items.unit AS itemUnit,
      production_items.id AS productionItemsId, productions.humidity AS humidity,
      productions.temperature AS temperature, vaccinations.administered_by AS vaccineAdministrator,
      vaccinations.notes AS vaccinationNotes, vaccinations.vaccination_id AS vaccinationId,
      vaccinations.vaccine_batch_no AS vaccineBatchNo,
      vaccinations.method AS vaccinationMethod, vaccinations.vaccine_id AS vaccineId,
      vaccinations.dosage AS vaccineDosage, vaccinations.dosage_unit AS vaccineDosageUnit,
      vaccinations.total_dosage AS vaccineTotalDosage, vaccinations.no_of_birds AS vaccinatedBirds,
      vaccinations.cost AS vaccineCost,

      medication.administered_by AS medicamentAdministrator, medication.notes AS medicationNotes,
      medication.medication_id AS medicationId, medication.medicament_batch_no AS medicamentBatchNo,
      medication.method AS medicationMethod, medication.medicament_id AS medicamentId,
      medication.dosage AS medicamentDosage, medication.dosage_unit AS medicamentDosageUnit,
      medication.total_dosage AS medicamentTotalDosage, medication.no_of_birds AS medicatedBirds,
      medication.cost AS medicamentCost,

      DATEDIFF(productions.date, batches.move_in_date) + batches.move_in_age AS batchAge
    FROM productions
    JOIN batches ON productions.batch_id = batches.batch_id
    JOIN breeds ON batches.breed_id = breeds.breed_id
    LEFT JOIN (
      SELECT mort.batch_id, mort.initial_stock_count, mort.production_id,
        SUM(mort.count) OVER(PARTITION BY mort.production_id ORDER BY mort.date) AS mortality,
        SUM(mort.count) OVER (PARTITION BY mort.batch_id ORDER BY mort.date) AS cumulativeMortality,
        mort.initial_stock_count - SUM(mort.count) OVER (PARTITION BY mort.batch_id ORDER BY mort.date) AS flockCount
      FROM (
        SELECT productions.date, productions.batch_id, batches.initial_stock_count,
            COALESCE(mortality.count, 0) AS count, mortality.id AS mortalityId, productions.production_id
        FROM productions
        JOIN batches on productions.batch_id = batches.batch_id
        LEFT JOIN mortality ON mortality.production_id = productions.production_id
        ${subQueryWhere.length > 0 ? ` WHERE ${subQueryWhere.join(' AND ')}` : ''}
      ) AS mort
    ) as mrt ON mrt.production_id = productions.production_id
    LEFT JOIN production_items ON productions.production_id = production_items.production_id
    LEFT JOIN items ON production_items.item_id = items.item_id
    LEFT JOIN vaccinations ON productions.production_id = vaccinations.production_id
    LEFT JOIN medication ON productions.production_id = medication.production_id
    ${where.length > 0 ? ` WHERE ${where.join(' AND ')}` : ''}
    ORDER BY productions.date DESC;
`)
      .then(async ([productions]) => {
        productions = await this.processProduction(productions);
        return productions.map((production) => new ProductionSummary(production));
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

    if (production.feeds.length === 0) {
      throw 'Feed is required.';
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
        stamp: production.stamp,
        batch_id: production.batchId
      }, {
        transaction,
        user,
        resourceId: 'production_id'
      });

      const productionId = newProduction.production_id;
      const productItems = [...production.feeds, ...production.eggs];

      const itemPriceMap = await Item.findAll({
        attributes: ['item_id', 'price', 'packaging_size', 'item_name', 'quantity'],
        where: {
          item_id: {
            [Op.in]: [
              ...productItems.map((item) => item.id),
              ...production.vaccinations.map((item) => item.vaccine.id),
              ...production.medications.map((item) => item.medicament.id)
            ]
          }
        }
      })
        .then((items) => new Map(items.map((item) => [item.item_id, item])));

      const itemPrices = await this.getLatestPrices(production);

      debug.info('itemPriceMap', itemPriceMap, itemPrices);

      for (const feed of production.feeds) {
        if (itemPriceMap.get(feed.id).quantity < feed.quantity) {
          throw `Not enough *${itemPriceMap.get(feed.id).item_name}* in the store. Please restock and try again.`;
        }
      }

      await this.addEggs(production, itemPriceMap, productionId, transaction, user);
      await this.addFeeds(production, itemPrices, productionId, transaction, user);

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

      await this.processTreatment('vaccination', production.vaccinations, {
        productionId, transaction, user, activeBatch, itemPriceMap, itemPrices
      });
      await this.processTreatment('medication', production.medications, {
        productionId, transaction, user, activeBatch, itemPriceMap, itemPrices
      });

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
        message: error,
        status: 500
      };
    }
  }

  getLatestPrices(production) {
    const ingredients = [
      ...[...production.feeds, ...production.eggs].map((item) => ({ id: item.id, quantity: item.quantity })),
      ...production.vaccinations.map((item) => ({ id: item.vaccine.id, quantity: +item.totalDosage })),
      ...production.medications.map((item) => ({ id: item.medicament.id, quantity: +item.totalDosage }))
    ];
    const promises = ingredients.map((item) => itemsController.getItemsPrices(item.id, item.quantity));
    console.log('ingredients', ingredients);
    return Promise.all(promises).then((items) => {
      items = [].concat(...items);

      const itemMap = new Map();
      items.forEach((item) => {
        itemMap.set(item.itemId, {
          price: item.price,
          name: item.itemName,
          packagingSize: item.packagingSize
        });
      });
      return itemMap;
    });
  }

  addFeeds({ feeds }, itemPrices, productionId, transaction, user) {
    // Add feed items
    return ProductionItem.bulkCreate(feeds.map((feed) => ({
      quantity: feed.quantity,
      item_id: feed.id,
      price: itemPrices.get(feed.id).price,
      production_id: productionId
    })), {
      transaction,
      user,
      resourceId: 'id'
    }).then((productionItems) =>
      // Persist feed items
      // eslint-disable-next-line implicit-arrow-linebreak
      ItemConsumption.bulkCreate(productionItems.map((item) => ({
        quantity: item.quantity,
        consumer: 'ProductionItem',
        consumer_id: item.id,
        price: item.price,
        item_id: item.item_id
      })),
      {
        transaction,
        user,
        resourceId: 'consumption_id'
      }));
  }

  async addEggs(production, itemPriceMap, productionId, transaction, user) {
    // Add egg items
    await ProductionItem.bulkCreate(production.eggs.map((egg) => ({
      quantity: egg.quantity,
      item_id: egg.id,
      price: itemPriceMap.get(egg.id).price,
      production_id: productionId
    })), {
      transaction,
      user,
      resourceId: 'id'
    });

    // Persist egg items
    return ItemInventory.bulkCreate(production.eggs.map((egg) => ({
      quantity: egg.quantity,
      price: itemPriceMap.get(egg.id).price,
      item_id: egg.id,
      producer: 'Production',
      producer_id: productionId
    })), {
      transaction,
      user,
      resourceId: 'id'
    });
  }

  async processTreatment(type, treatments, {
    productionId, transaction, user, activeBatch, itemPriceMap, itemPrices
  }) {
    const medType = type === 'vaccination' ? 'vaccine' : 'medicament';
    const modelType = type === 'vaccination' ? 'Vaccination' : 'Medication';

    treatments = treatments.map((treatment) => {
      const { id } = treatment[medType];
      const item = itemPriceMap.get(id);

      return {
        production_id: productionId,
        [`${medType}_id`]: id,
        [`${medType}_batch_no`]: treatment[`${medType}BatchNo`],
        dosage: treatment.dosage || 0,
        dosage_unit: treatment.dosageUnit || 'N/A',
        total_dosage: treatment.totalDosage,
        no_of_birds: treatment.noOfBirds || activeBatch.initial_stock_count,
        method: treatment[`${type}Method`],
        administered_by: treatment.administeredBy,
        notes: treatment.reason,
        cost: (+treatment.totalDosage / +item.packaging_size) * +itemPrices.get(id).price,
        item_price: +itemPrices.get(id).price
      };
    });

    for (const item of treatments) {
      if (+itemPriceMap.get(item[`${medType}_id`]).quantity < +item.total_dosage) {
        throw `Not enough *${itemPriceMap
          .get(item[`${medType}_id`]).item_name}* in the store. Please restock and try again.`;
      }
    }

    return eval(modelType)
      .bulkCreate(treatments, {
        transaction,
        user,
        resourceId: `${type}_id`
      }).then((items) => ItemConsumption.bulkCreate(items.map((item) => ({
        quantity: item.total_dosage,
        consumer: modelType,
        consumer_id: item[`${modelType.toLowerCase()}_id`],
        price: +item.item_price,
        item_id: item[`${medType}_id`]
      })),
      {
        transaction,
        user,
        resourceId: 'consumption_id'
      }));
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
          mortality: production.mortality,
          cumulativeMortality: production.cumulativeMortality,
          items: new Map(),
          batchAge: production.batchAge,
          temperature: production.temperature,
          humidity: production.humidity,
          vaccinations: new Map(),
          medications: new Map()
        });
      }

      const productionGroup = productionMap.get(production.id);

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
          noOfBirds: production.vaccinatedBirds,
          cost: production.vaccineCost
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
          noOfBirds: production.medicatedBirds,
          cost: production.medicamentCost
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
