'strict';

const { Model, DataTypes } = require('sequelize');

class InvoiceItems extends Model {
  static get tblName() {
    return 'invoice_items';
  }

  static get modelName() {
    return 'InvoiceItem';
  }

  static get schema() {
    return {
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      item_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
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
