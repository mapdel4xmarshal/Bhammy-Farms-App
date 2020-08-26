'strict';

const { Model, DataTypes } = require('sequelize');

class ProductionItems extends Model {
  static get tblName() {
    return 'production_items';
  }

  static get modelName() {
    return 'ProductionItem';
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
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: true
      }
    };
  }
}

module.exports = (sequelize) => {
  ProductionItems.init(ProductionItems.schema, {
    sequelize,
    modelName: ProductionItems.modelName,
    tableName: ProductionItems.tblName
  });

  return ProductionItems;
};
