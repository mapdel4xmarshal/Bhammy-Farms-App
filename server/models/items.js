
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
        unique: true
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
    InvoiceItem, Invoice, ProductionItem, Production, FeedProduction, FeedProductionItem
  }) {
    Items.invoices = Items.belongsToMany(Invoice, { through: InvoiceItem, foreignKey: 'item_id' });
    Items.production = Items.belongsToMany(Production, { through: ProductionItem, foreignKey: 'item_id' });
    Items.feedProduction = Items.belongsToMany(FeedProduction, { through: FeedProductionItem, foreignKey: 'item_id' });
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
