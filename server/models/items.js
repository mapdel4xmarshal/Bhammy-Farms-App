const { Model, DataTypes } = require('sequelize');

class Items extends Model {
  static get tblName() {
    return 'items';
  }

  static get modelName() {
    return 'Item';
  }

  static get schema() {
    return {
      item_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      item_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'item_name'
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: true
      },
      packaging_size: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        default: 1
      },
      packaging_metric: {
        type: DataTypes.STRING,
        allowNull: false
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        default: 0,
        allowNull: true
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      min_stock_level: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        default: 0
      },
      reorder_level: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        default: 0
      },
      notification: {
        type: DataTypes.BOOLEAN,
        default: 1
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      is_produced: {
        type: DataTypes.BOOLEAN
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    };
  }

  static associate({
    InvoiceItem, Invoice, ProductionItem, Production, FeedProduction, FeedProductionItem, ItemInventory, ItemConsumption
  }) {
    Items.invoices = Items.belongsToMany(Invoice, { through: InvoiceItem, foreignKey: 'item_id' });
    Items.production = Items.belongsToMany(Production, { through: ProductionItem, foreignKey: 'item_id' });
    Items.feedProduction = Items.belongsToMany(FeedProduction, { through: FeedProductionItem, foreignKey: 'item_id' });
    Items.inventory = Items.hasMany(ItemInventory, { foreignKey: 'item_id' });
    Items.consumption = Items.hasMany(ItemConsumption, { foreignKey: 'item_id' });
  }
}

module.exports = (sequelize) => {
  Items.init(Items.schema, {
    sequelize,
    modelName: Items.modelName,
    tableName: Items.tblName
  });

  return Items;
};
