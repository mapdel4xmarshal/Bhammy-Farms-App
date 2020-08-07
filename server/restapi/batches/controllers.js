const {
  Batch, Breed, House, Production, Mortality, Location, Sequelize: { Op, literal, fn, col }
} = require('../../models');

class Controller {
  async getBatches({ house }) {
    let where = {};
    if (house) where = { house_id: house };

    return Batch.findAll({
      where,
      attributes: [
        'name', ['batch_id', 'batchId'], 'name', ['house_id', 'houseId'], [literal('House.name'), 'house'],
        [col('`House->Location`.name'), 'farm'],
        [fn('date_format', col('move_in_date'), '%Y-%m-%d'), 'moveInDate'],
        [fn('date_format', col('move_out_date'), '%Y-%m-%d'), 'moveOutDate'],
        ['move_in_age', 'moveInAge'], [literal('DATEDIFF(NOW(), move_in_date) + move_in_age'), 'currentAge'],
        [literal('breed.name'), 'breed'], [literal('breed.type'), 'category'], ['initial_stock_count', 'initialStock'],
        [literal('initial_stock_count - "Productions->Mortalities.count"'), 'currentStock'], ['supplier_id', 'supplier'],
        ['source_id', 'source'], ['cost_per_unit', 'costPerUnit'], ['total_cost', 'totalCost'], ['description', 'batchNote'],
        [fn('sum', fn('COALESCE',col('Productions->Mortalities.count'), 0)), 'totalMortality'],
        [literal('CASE WHEN is_active = 1 THEN "Active" ELSE "Retired" END'), 'status']],
      include: [
        {
          model: Breed,
          attributes: []
        },
        {
          model: House,
          attributes: [],
          include: [
            {
              model: Location,
              as: 'location',
              attributes: []
            }
          ]
        },
        {
          model: Production,
          attributes: [],
          include: [
            {
              model: Mortality,
              attributes: []
            }
          ]
        },
      ],
      group: ['batch.batch_id'],
      raw: true
    })
      .then((batches) => batches.map((batch) => {
        batch.currentStock = batch.initialStock - batch.totalMortality;
        return batch;
      } ));
  }

  async getBreeds() {
    return Breed.findAll({
      attributes: [['breed_id', 'id'], 'name', 'type', 'category'],
      order: [['name', 'ASC']]
    })
      .then((breeds) => breeds);
  }

  async addBatch(batch) {
    const farm = await House.findOne({
      where: { house_id: batch.houseId },
      attributes: ['name']
    });

    const moveOutDate = new Date(batch.moveOutDate);
    const activeBatchCount = await Batch.count({
      where: {
        house_id: batch.houseId,
        move_out_date: {
          [Op.gt]: new Date()
        }
      }
    });

    const batchCount = await Batch.count({ where: { house_id: batch.houseId } });

    if (activeBatchCount > 0) {
      return {
        error: 'A batch already exist for the specified house. '
          + 'Please end the current batch or select a different house.',
        status: 409
      };
    }

    return Batch.create({
      name: `${farm.name}-${(batchCount + 1).toString()
        .padStart(3, '0')}`,
      move_in_date: new Date(batch.moveInDate),
      move_out_date: moveOutDate,
      move_in_age: batch.initialAge,
      animal_category_id: 1,
      breed_id: batch.breedId,
      initial_stock_count: batch.initialStock,
      mortality_count: batch.initialStock - batch.currentStock,
      supplier_id: batch.supplierId,
      source_id: batch.sourceId,
      cost_per_unit: batch.costPerBird,
      total_cost: batch.amount,
      description: batch.note,
      is_active: moveOutDate > new Date(),
      house_id: batch.houseId
    })
      .then((newBatch) => newBatch.batch_id)
      .catch((error) => {
        console.log(error); // todo: add proper logger
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async getBatchById(BatchId) {
    return Batch.findOne({
      where: { id: BatchId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
      .then((Batch) => Batch);
  }

  async updateBatch(BatchId) {
    return Batch.findOne({
      where: { id: BatchId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
      .then((Batch) => Batch);
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
