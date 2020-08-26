'strict';

const uuid = require('uuid');
const {
  Supplier, Party, Source, Customer, Sequelize
} = require('../../models');

class Controller {
  constructor() {
    this._commonFields = [[Sequelize.literal('Party.name'), 'name'],
      [Sequelize.literal('Party.email'), 'email'],
      [Sequelize.literal('Party.address'), 'address'],
      [Sequelize.literal('Party.phone'), 'phone'],
      [Sequelize.literal('Party.alt_phone'), 'altPhone'],
      [Sequelize.literal('Party.state'), 'state']];
  }

  async getSuppliers() {
    return Supplier.findAll({
      include: [{
        model: Party,
        attributes: []
      }],
      raw: true,
      attributes: [
        ['supplier_id', 'id'],
        ...this._commonFields,
        'remark'
      ]
    })
      .then((suppliers) => suppliers);
  }

  async getSupplierById(supplierId) {
    return Supplier.findOne({
      where: { supplier_id: supplierId },
      raw: true,
      attributes: [['supplier_id', 'id'],
        ...this._commonFields,
        'remark'],
      include: [{
        model: Party,
        attributes: []
      }]
    })
      .then((supplier) => supplier);
  }

  async getSources() {
    return Source.findAll({
      include: [{
        model: Party,
        attributes: []
      }],
      raw: true,
      attributes: [
        ['source_id', 'id'],
        ...this._commonFields,
        'remark'
      ]
    })
      .then((suppliers) => suppliers);
  }

  async getSourceById(sourceId) {
    return Source.findOne({
      where: { source_id: sourceId },
      raw: true,
      attributes: [['source_id', 'id'],
        ...this._commonFields,
        'remark'],
      include: [{
        model: Party,
        attributes: []
      }]
    })
      .then((supplier) => supplier);
  }

  async addCustomer(customer) {
    return Customer.create({
      Party: {
        party_id: uuid.v4(),
        name: customer.fullName || `${customer.firstName} ${customer.lastName}`,
        address: customer.address,
        state: customer.state,
        email: customer.email,
        phone: customer.phone,
        alt_phone: customer.altPhone
      },
      title: customer.title,
      gender: customer.gender,
      rating: customer.rating,
      comment: customer.remark
    }, { include: [Party] })
      .then((newBatch) => newBatch.batch_id)
      .catch((error) => {
        console.log(error); // todo: add proper logger
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async getCustomers() {
    return Customer.findAll({
      include: [{
        model: Party,
        attributes: []
      }],
      raw: true,
      attributes: [
        ['customer_id', 'id'],
        ...this._commonFields,
        'title',
        'gender',
        'rating',
        'comment'
      ]
    })
      .then((customers) => customers);
  }
}

module.exports = new Controller();
