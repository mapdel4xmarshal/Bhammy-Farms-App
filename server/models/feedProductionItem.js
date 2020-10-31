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
}

module.exports = (sequelize) => {
  FeedProductionItem.init(FeedProductionItem.schema, {
    sequelize,
    modelName: FeedProductionItem.modelName,
    tableName: FeedProductionItem.tblName
  });

  return FeedProductionItem;
};
