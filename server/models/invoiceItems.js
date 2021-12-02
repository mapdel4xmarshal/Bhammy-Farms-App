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

  static insertHandler(ItemConsumption) {
    const consumedItem = (item) => ({
      quantity: item.quantity,
      consumer: 'InvoiceItem',
      consumer_id: item.invoice_id,
      price: item.item_price,
      item_id: item.item_id
    });

    return (items, options) => {
      let action = 'create';
      let payload;

      if (Array.isArray(items)) {
        action = 'bulkCreate';
        payload = items.map(consumedItem);
      } else payload = consumedItem(items);

      return ItemConsumption[action](payload, {
        transaction: options.transaction,
        user: options.user,
        resourceId: 'consumption_id'
      });
    };
  }

  static hooks({ ItemConsumption }) {
    InvoiceItems.addHook('afterCreate', 'updateConsumption',
      InvoiceItems.insertHandler(ItemConsumption));

    InvoiceItems.addHook('afterBulkCreate', 'updateConsumption',
      InvoiceItems.insertHandler(ItemConsumption));
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
