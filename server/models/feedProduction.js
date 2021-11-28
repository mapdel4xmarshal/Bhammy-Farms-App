const { Model, DataTypes, Op } = require('sequelize');

class FeedProduction extends Model {
  static get tblName() {
    return 'feed_production';
  }

  static get modelName() {
    return 'FeedProduction';
  }

  static get schema() {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      energy_level: {
        type: DataTypes.ENUM(['High', 'Medium', 'Low']),
        allowNull: false
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      stamp: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      price: {
        type: DataTypes.VIRTUAL,
        allowNull: false
      },
      quantity: {
        type: DataTypes.VIRTUAL,
        allowNull: false
      }
    };
  }

  static associate({ FeedProductionItem, Item }) {
    FeedProduction.items = FeedProduction
      .belongsToMany(Item, { through: FeedProductionItem, foreignKey: 'feed_production_id' });
  }

  static insertHandler(ItemInventory) {
    const inventoryItem = (item) => ({
      quantity: item.quantity,
      price: item.price,
      item_id: item.type,
      producer: 'FeedProduction',
      producer_id: item.id
    });

    return (items, options) => {
      let action = 'create';
      let payload;

      if (Array.isArray(items)) {
        action = 'bulkCreate';
        payload = items.map(inventoryItem);
      } else payload = inventoryItem(items);

      return ItemInventory[action](payload, {
        transaction: options.transaction,
        user: options.user,
        resourceId: 'id'
      });
    };
  }

  static hooks({ ItemInventory }) {
    FeedProduction.addHook('afterCreate', 'createInventory',
      FeedProduction.insertHandler(ItemInventory));

    FeedProduction.addHook('afterBulkCreate', 'createInventory',
      FeedProduction.insertHandler(ItemInventory));
  }
}

module.exports = (sequelize) => {
  FeedProduction.init(FeedProduction.schema, {
    sequelize,
    modelName: FeedProduction.modelName,
    tableName: FeedProduction.tblName
  });

  return FeedProduction;
};
