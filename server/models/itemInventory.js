const { Model, DataTypes, Sequelize } = require('sequelize');

class ItemInventory extends Model {
  static get tblName() {
    return 'item_inventory';
  }

  static get modelName() {
    return 'ItemInventory';
  }

  static get schema() {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        default: 0,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      producer: {
        type: DataTypes.STRING,
        allowNull: false
      },
      producer_id: {
        type: DataTypes.STRING
      }
    };
  }

  static insertHandler(Items) {
    return async (productions, options) => {
      const items = Array.isArray(productions) ? productions : [productions];
      // eslint-disable-next-line no-restricted-syntax
      for (const item of items) {
        // Update store items
        // eslint-disable-next-line no-await-in-loop
        await Items.update({
          quantity: Sequelize.literal(`quantity + ${Number(item.quantity)}`),
          ...(item.price && { price: item.price })
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
    ItemInventory.addHook('afterCreate', 'updateItem', ItemInventory.insertHandler(Item));
    ItemInventory.addHook('afterBulkCreate', 'updateItem', ItemInventory.insertHandler(Item));
  }
}

module.exports = (sequelize) => {
  ItemInventory.init(ItemInventory.schema, {
    sequelize,
    modelName: ItemInventory.modelName,
    tableName: ItemInventory.tblName
  });

  return ItemInventory;
};
