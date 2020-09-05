const request = require('request');
const Notification = require('../../notification/notification');

const {
  Production, Vaccination, Batch, Sequelize: { Op }, sequelize, Location, House, ProductionItem, Mortality, Medication,
  Item, Breed
} = require('../../models');

const ProductionSummary = require('./productionSummary');

class Controller {
  async getProductions({
                         batchId, before, after, date
                       }) {
    const where = [];
    if (batchId) where.push(`batches.batch_id = '${batchId}'`);
    if (before) where.push(`productions.date <= '${before}'`);
    if (after) where.push(`productions.date >= '${after}'`);
    if (date) where.push(`productions.date = '${date}'`);

    return sequelize.query(`
    SELECT productions.production_id AS id, productions.water, mortality.id AS mortalityId, mortality.count AS mortalityCount, productions.date,
      production_items.quantity AS itemQuantity, production_items.price AS itemPrice, batches.initial_stock_count AS initialFlockCount,
      batches.name AS batch, batches.initial_stock_count AS flockCount, batches.is_active AS isActive, breeds.type AS batchType,
      items.item_id AS itemId, items.item_name AS itemName, items.category AS itemCategory, items.size AS itemSize, items.unit AS itemUnit,
      production_items.id AS productionItemsId,
      vaccinations.*
    FROM productions 
    JOIN batches ON productions.batch_id = batches.batch_id
    JOIN breeds ON batches.breed_id = breeds.breed_id
    LEFT JOIN mortality ON productions.production_id = mortality.production_id
    LEFT JOIN production_items ON productions.production_id = production_items.production_id
    LEFT JOIN items ON production_items.item_id = items.item_id
    LEFT JOIN vaccinations ON productions.production_id = vaccinations.production_id
    ${where.length > 0 ? ` WHERE ${where.join(' AND ')}` : ''}
    ORDER BY productions.date DESC;

`)
      .then(async ([productions,]) => {
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

      await ProductionItem.bulkCreate([...production.eggs, ...production.feeds].map((item) => ({
        quantity: item.quantity,
        item_id: item.id,
        production_id: productionId
      })), {
        transaction,
        user,
        resourceId: 'id'
      });

      production.eggs.forEach(async (egg) => {
        await Item.increment('quantity', {
          by: Number(egg.quantity),
          where: { item_id: egg.id },
          transaction ,
          user,
          resourceId: 'item_id'
        });
      });

      production.feeds.forEach(async (feed) => {
        await Item.decrement('quantity', {
          by: Number(feed.quantity),
          where: { item_id: feed.id },
          transaction,
          user,
          resourceId: 'item_id'
        });
      });

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


      await this.processTreatment('vaccination', production.vaccinations, productionId, transaction, user);
      await this.processTreatment('medication', production.medications, productionId, transaction, user);

      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      await transaction.commit();

      // Push notify
      new Notification().send('Production',
        `A new production record was added by ${user.displayName}`, `productions/${newProduction.id}`);

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

  async processTreatment(type, treatments, productionId, transaction, user) {
    const medType = type === 'vaccination' ? 'vaccine' : 'medicament';
    const modelType = type === 'vaccination' ? 'Vaccination' : 'Medication';

    treatments = treatments.map((treatment) => ({
      production_id: productionId,
      [`${medType}_id`]: treatment[medType].id,
      [`${medType}_batch_no`]: treatment[`${medType}BatchNo`],
      dosage: treatment.dosage,
      dosage_unit: treatment.dosageUnit,
      total_dosage: treatment.totalDosage,
      no_of_birds: treatment.noOfBirds,
      method: treatment[`${type}Method`],
      administered_by: treatment.administeredBy,
      notes: treatment.reason
    }));

    for (const item of treatments) {
      await Item.increment('quantity',
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
    return new Promise((resolve, reject) => {
      request.get(`http://api.weatherapi.com/v1/history.json?key=aa5f3c747bb140be95f230031202507&q=${
        coordinate}&dt=${date}`, (error, resp, data) => {
        if (error) {
          reject(error);
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
          vaccinations: [],
          medications: []
        });
      }

      const productionGroup = productionMap.get(production.id);
      productionGroup.mortality.set(production.mortalityId, { count: production.mortalityCount });
      productionGroup.items.set(production.productionItemsId, {
        id: production.itemId,
        name: production.itemName,
        quantity: production.itemQuantity,
        price: production.price,
        category: production.itemCategory,
        size: production.itemSize,
        unit: production.itemUnit
      });
    });

    return Array.from(productionMap.values());
  }
}

module.exports = new Controller();
