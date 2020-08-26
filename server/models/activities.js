
const { Model, DataTypes } = require('sequelize');

class Activities extends Model {
  static get tblName() {
    return 'activities';
  }

  static get modelName() {
    return 'Activity';
  }

  static get schema() {
    return {
      activity_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      activity_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    };
  }

  static associate({ House, Location, Batch }) {
    Activities.house = Activities.belongsTo(House, { as: 'house', foreignKey: 'house_id' });
    Activities.location = Activities.belongsTo(Location, { as: 'location', foreignKey: 'location_id' });
    Activities.batch = Activities.belongsTo(Batch, { as: 'batch', foreignKey: 'batch_id' });
  }
}

module.exports = (sequelize) => {
  Activities.init(Activities.schema, {
    sequelize,
    modelName: Activities.modelName,
    tableName: Activities.tblName,
    underscored: true
  });

  return Activities;
};
