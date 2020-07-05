'strict';

const { Model, DataTypes } = require('sequelize');

class InvoiceItems extends Model {
  static get tblName() {
    return 'InvoiceItems';
  }

  static get modelName() {
    return 'InvoiceItem';
  }

  static get schema() {
    return {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      item_price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      discount: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    };
  }
}

module.exports = (sequelize) => {
  InvoiceItems.init(InvoiceItems.schema, {
    sequelize,
    modelName: InvoiceItems.modelName,
    tableName: InvoiceItems.tblName
  });

  return InvoiceItems;
};
