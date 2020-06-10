'use strict';

const { Supplier, Party, Source, Sequelize } = require('../../models');

class Controller {
  constructor() {
    this._commonFields = [[Sequelize.literal('party.name'), 'name'],
      [Sequelize.literal('party.email'), 'email'],
      [Sequelize.literal('party.address'), 'address'],
      [Sequelize.literal('party.phone'), 'phone'],
      [Sequelize.literal('party.alt_phone'), 'altPhone'],
      [Sequelize.literal('party.state'), 'state']];
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

  async addSupplier() {

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
}

module.exports = new Controller();
