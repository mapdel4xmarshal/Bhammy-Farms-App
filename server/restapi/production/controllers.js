const request = require("request");

const {
  Production, Vaccination, Batch, Sequelize: { Op }, sequelize, Location, House, ProductionItem, Mortality
} = require('../../models');

class Controller {
  async getProductions({ batchId, before, after, date }) {
    let where = {};
    if (batchId) where.batch_id = batchId;
    if (before) where.date[Op.lt] = new Date(before);
    if (after) where.date[Op.gt] = new Date(after);

    if (date) where.date = new Date(date);

    return Production.findAll({
      where,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [Vaccination]
    })
      .then((productions) => productions.map((production) => production));
  }

  async addProduction(production) {  console.log(production)
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
    let weather = await this.getWeatherInfo(`${longitude},${latitude}`, production.date);     console.log("weather",weather);

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
      }, { transaction });                  console.log(production.feeds[0].id)

      await ProductionItem.bulkCreate([...production.eggs, ...production.feeds].map(item => ({
        quantity: item.quantity,
        item_id: item.id,
        production_id: newProduction.production_id
      })), { transaction });

      console.log(production.mortality.map(mortality => ({
        time: mortality.time,
        count: mortality.count,
        cause_of_death: mortality.reason,
        description: mortality.comment,
        production_id: newProduction.production_id
      })));

      await Mortality.bulkCreate(production.mortality.map(mortality => ({
        time: mortality.time,
        count: mortality.count,
        cause_of_death: mortality.reason,
        description: mortality.comment || mortality.reason,
        production_id: newProduction.production_id
      })), { transaction });

      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      await transaction.commit();

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

  async getWeatherInfo(coordinate, date) {
     return new Promise((resolve, reject) => {   console.log(`http://api.weatherapi.com/v1/history.json?
        key=aa5f3c747bb140be95f230031202507&q=${coordinate}&dt=${date}`);
       request.get(`http://api.weatherapi.com/v1/history.json?key=aa5f3c747bb140be95f230031202507&q=${
         coordinate}&dt=${date}`, (error, resp, data) => {
         if (error) reject(error);
         else resolve(JSON.parse(data));
       });
     });
  }

  async getProductionById(BatchId) {
    return Batch.findOne({
      where: { id: BatchId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
      .then((Batch) => Batch);
  }

  async updateProduction(BatchId) {
    return Batch.findOne({
      where: { id: BatchId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
      .then((Batch) => Batch);
  }

  _apiJSON(batch) {
    return {
      id: batch.batch_id,
      name: batch.name,
      moveInDate: this._normalizeDateString(batch.move_in_date),
      moveOutDate: this._normalizeDateString(batch.move_out_date),
      moveInAge: batch.move_in_age,
      currentAge: batch.move_in_age + this._weekDiff(batch.move_in_date, Date.now()),
      category: batch.Breed.type,
      breed: batch.Breed.name,
      initialStock: batch.initial_stock_count,
      currentStock: batch.initial_stock_count - batch.mortality_count,
      mortality: batch.mortality_count,
      supplier: batch.supplier_id,
      source: batch.source_id,
      costPerUnit: batch.cost_per_unit,
      totalCost: batch.total_cost,
      batchNote: batch.description,
      state: batch.is_active ? 'Active' : 'Retired'

    };
  }

  _weekDiff(date1, date2) {
    return Math.round((date2 - date1) / (7 * 24 * 60 * 60 * 1000));
  }

  _normalizeDateString(date) {
    return date.toISOString()
      .split('T')[0];
  }
}

module.exports = new Controller();
