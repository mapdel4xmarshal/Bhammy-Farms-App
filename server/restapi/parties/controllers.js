'strict';

const uuid = require('uuid');
const {
  Supplier, Party, Source, Customer, Sequelize, Invoice, sequelize
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
        name: customer.name || `${customer.firstName} ${customer.lastName}`,
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
      .then((customer) => customer.customer_id)
      .catch((error) => {
        console.log(error); // todo: add proper logger
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async updateCustomer(customer) {
    const transaction = await sequelize.transaction();

    try {
      await Customer.update({
        title: customer.title,
        gender: customer.gender,
        rating: customer.rating,
        comment: customer.comment
      }, { include: [Party], where: { customer_id: customer.id }, transaction });

      const updatedCustomer = await Customer.findByPk(customer.id, { transaction });

      await Party.update({
          name: customer.name || `${customer.firstName} ${customer.lastName}`,
          address: customer.address,
          state: customer.state,
          email: customer.email,
          phone: customer.phone,
          alt_phone: customer.altPhone
      }, { where: { party_id: updatedCustomer.party_id}, transaction });
      await transaction.commit();

      return await this.getCustomers(updatedCustomer.customer_id);
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      return {
        error: 'Unable to process request. Please try again later!',
        status: 500
      };
    }
  }

  async getCustomers(id) {
    const where = {};
    if (id) where.customer_id = id;

    return Customer[id ? 'findOne' : 'findAll']({
      include: [
        {
          model: Party,
          attributes: []
        },
        {
          model: Invoice,
          as: 'invoices',
          attributes: [
            ['invoice_id', 'id'],
            ['invoice_date', 'invoiceDate'],
            ['payment_status', 'paymentStatus'], 'amount'
          ]
        }],
      raw: false,
      attributes: [
        ['customer_id', 'id'],
        ...this._commonFields,
        'title',
        'gender',
        'rating',
        'comment'
      ],
      where
    })
      .then((customers) => customers)
      .catch((error) => {
        console.log(error);
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }
}

module.exports = new Controller();
