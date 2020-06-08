const { Supplier, Party, Sequelize } = require('../../models');

class Controller {
  async getSuppliers() {
    return Supplier.findAll({
      include: [{
        model: Party,
        attributes: []
      }],
      raw: true,
      attributes: [
        ['supplier_id', 'id'],
        [Sequelize.literal('party.name'), 'name'], [Sequelize.literal('party.email'), 'email'],
        [Sequelize.literal('party.address'), 'address'], [Sequelize.literal('party.phone'), 'phone'],
        [Sequelize.literal('party.alt_phone'), 'altPhone'], [Sequelize.literal('party.state'), 'state'],
      ]
    })
      .then((suppliers) => suppliers);
  }

  async getSupplierById(locationId) {
    return Location.findOne({
      where: { id: locationId },
      attributes: [['location_id', 'id'], 'address', 'state', 'name', 'phone', ['alt_phone', 'altPhone']],
      include: [{
        model: House,
        as: 'houses',
        attributes: [['house_id', 'id'], 'name', 'type', 'capacity']
      }]
    })
      .then((location) => location);
  }

  async addSupplier() {

  }
}

module.exports = new Controller();

