'strict';

const { Model, DataTypes } = require('sequelize');

class FeedProductionItem extends Model {
  static get tblName() {
    return 'feed_production_item';
  }

  static get modelName() {
    return 'FeedProductionItem';
  }

  static get schema() {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      }
    };
  }

  static insertHandler(ItemConsumption) {
    const consumedItem = (item) => ({
      quantity: item.quantity,
      consumer: 'FeedProductionItem',
      consumer_id: item.id,
      price: item.price,
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
    FeedProductionItem.addHook('afterCreate', 'updateConsumption',
      FeedProductionItem.insertHandler(ItemConsumption));

    FeedProductionItem.addHook('afterBulkCreate', 'updateConsumption',
      FeedProductionItem.insertHandler(ItemConsumption));
  }
}

module.exports = (sequelize) => {
  FeedProductionItem.init(FeedProductionItem.schema, {
    sequelize,
    modelName: FeedProductionItem.modelName,
    tableName: FeedProductionItem.tblName
  });

  return FeedProductionItem;
};
