
const { Model, DataTypes, Sequelize } = require('sequelize');

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
      }
    };
  }

  static associate({ FeedProductionItem, Item }) {
    FeedProduction.items = FeedProduction.belongsToMany(Item, { through: FeedProductionItem, foreignKey: 'feed_production_id' });
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
