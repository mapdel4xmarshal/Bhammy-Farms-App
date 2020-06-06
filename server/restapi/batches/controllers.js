const { batch, house } = require('../../models');

setTimeout(() => {
  house.findAll({
    attributes: ['id'],
    where: {
      name: 'OLO-P001'
    }
  }).then((house) => {
    console.log('house', house[0].id);
    batch.create({
      batch_id: 'AJG-P001-B01',
      move_in_date: new Date('2020-02-02'),
      move_out_date: new Date('2021-06-02'),
      move_in_age: 16,
      animal_category_id: 1,
      animal_breed_id: 2,
      initial_stock_count: 4100,
      mortality_count: 392,
      supplier_id: 121,
      source_id: 10,
      cost_per_unit: 1500,
      total_cost: 5600000,
      description: 'This birds were gotten from an unknown brooder in Ilorin.',
      is_active: 1,
      houseId: house[0].id
    },
    { include: [batch.house] })
      .then((newBatch) => newBatch.id);
  });
}, 2000000);

class Controller {
  async getBatches() {
    return batch.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
      .then((batches) => batches.map((batch) => this._apiJSON(batch.dataValues)));
  }

  async addBatch(batchInfo) {
    return batch.create({
      batch_id: 'AJG-P001-B01',
      move_in_date: new Date('2020-02-02'),
      move_out_date: new Date('2021-06-02'),
      move_in_age: 16,
      animal_category_id: 1,
      animal_breed_id: 2,
      initial_stock_count: 4100,
      mortality_count: 392,
      supplier_id: 121,
      source_id: 10,
      cost_per_unit: 1500,
      total_cost: 5600000,
      description: 'This birds were gotten from an unknown brooder in Ilorin.',
      is_active: 1,
      house_id: '5e4ad559-db3e-4f43-b806-52601671289e'
    })
      .then((newBatch) => newBatch.id);
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
      moveInDate: this._normalizeDateString(batch.move_in_date),
      moveOutDate: this._normalizeDateString(batch.move_out_date),
      moveInAge: batch.move_in_age,
      currentAge: batch.move_in_age + this._weekDiff(batch.move_in_date, Date.now()),
      category: batch.animal_category_id,
      breed: batch.animal_breed_id,
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
    console.log('(date2 - date1)', (date2 - date1));
    return Math.round((date2 - date1) / (7 * 24 * 60 * 60 * 1000));
  }

  _normalizeDateString(date) {
    return date.toISOString()
      .split('T')[0];
  }
}

module.exports = new Controller();
