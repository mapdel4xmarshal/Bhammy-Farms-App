'use strict';

const { Model, DataTypes } = require('sequelize');

class Invoices extends Model {
  static get tblName() {
    return 'Invoices';
  }

  static get modelName() {
    return 'Invoice';
  }

  static get schema() {
    return {
      invoice_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      customer_id: {
        type: DataTypes.SMALLINT,
        allowNull: true
      },
      payment_status: {
        type: DataTypes.ENUM(['paid', 'unpaid', 'partial']),
        allowNull: false
      },
      fulfilment_status: {
        type: DataTypes.ENUM(['supplied', 'pending', 'partial']),
        allowNull: false
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      discount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      }
    };
  }
}

module.exports = (sequelize) => {
  Invoices.init(Invoices.schema, {
    sequelize,
    modelName: Invoices.modelName,
    tableName: Invoices.tblName,
    underscored: true
  });

  return Invoices;
};
