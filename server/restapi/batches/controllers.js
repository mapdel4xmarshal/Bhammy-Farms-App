
const {
  Batch, Breed, House, Sequelize: { Op }
} = require('../../models');

class Controller {
  async getBatches({ house }) {
    let where = {};
    if (house) where = { house_id: house };

    return Batch.findAll({ where, attributes: { exclude: ['createdAt', 'updatedAt'] }, include: [Breed] })
      .then((batches) => batches.map((batch) => this._apiJSON(batch.dataValues)));
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

  _snakeToCamel(str) {
    return str.replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
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
