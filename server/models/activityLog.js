
const { Model, DataTypes } = require('sequelize');

class ActivityLogs extends Model {
  static get tblName() {
    return 'activity_log';
  }

  static get modelName() {
    return 'ActivityLog';
  }

  static get schema() {
    return {
      activity_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      initiator_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      initiator_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      operation: {
        type: DataTypes.STRING,
        allowNull: false
      },
      resource: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resource_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      payload: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    };
  }
}

module.exports = (sequelize) => {
  ActivityLogs.init(ActivityLogs.schema, {
    sequelize,
    modelName: ActivityLogs.modelName,
    tableName: ActivityLogs.tblName,
    underscored: true
  });

  return ActivityLogs;
};
