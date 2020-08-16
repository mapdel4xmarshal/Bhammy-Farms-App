
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
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: true
      },
      size: {
        type: DataTypes.STRING,
        allowNull: true
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    };
  }

  static associate({
    InvoiceItem, Invoice, ProductionItem, Production
  }) {
    Items.invoices = Items.belongsToMany(Invoice, { through: InvoiceItem, foreignKey: 'item_id' });
    Items.production = Items.belongsToMany(Production, { through: ProductionItem, foreignKey: 'item_id' });
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
