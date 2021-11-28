const { Model, DataTypes, Sequelize } = require('sequelize');

class ItemConsumption extends Model {
  static get tblName() {
    return 'item_consumption';
  }

  static get modelName() {
    return 'ItemConsumption';
  }

  static get schema() {
    return {
      consumption_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        default: 0,
        allowNull: true
      },
      consumer: {
        type: DataTypes.STRING,
        allowNull: false
      },
      consumer_id: {
        type: DataTypes.STRING
      }
    };
  }

  static insertHandler(Item) {
    return async (consumptions, options) => {
      const items = Array.isArray(consumptions) ? consumptions : [consumptions];

      // eslint-disable-next-line no-restricted-syntax
      for (const item of items) {
        // Update store items
        // eslint-disable-next-line no-await-in-loop
        await Item.update({
          quantity: Sequelize.literal(`quantity - ${Number(item.quantity)}`),
          price: item.price
        },
        {
          where: { item_id: item.item_id },
          transaction: options.transaction,
          user: options.user,
          resourceId: 'item_id'
        });
      }
    };
  }

  static hooks({ Item }) {
    ItemConsumption.addHook('beforeCreate', 'updateItem', ItemConsumption.insertHandler(Item));

    ItemConsumption.addHook('beforeBulkCreate', 'updateItem', ItemConsumption.insertHandler(Item));
  }
}

module.exports = (sequelize) => {
  ItemConsumption.init(ItemConsumption.schema, {
    sequelize,
    modelName: ItemConsumption.modelName,
    tableName: ItemConsumption.tblName
  });

  return ItemConsumption;
};
