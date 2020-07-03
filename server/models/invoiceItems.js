'strict';

const { Model } = require('sequelize');

class InvoiceItems extends Model {
  static get tblName() {
    return 'InvoiceItems';
  }

  static get modelName() {
    return 'InvoiceItem';
  }

  static get schema() {
    return {};
  }

  static associate({ Invoice, Item }) {
    InvoiceItems.invoice = InvoiceItems.belongsTo(Invoice, { foreignKey: 'invoice_id' });
    InvoiceItems.item = InvoiceItems.belongsTo(Item, { foreignKey: 'item_id' });
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
