'use strict';

const { Model, DataTypes } = require('sequelize');

class Houses extends Model {
  static get tblName() {
    return 'houses';
  }

  static get modelName() {
    return 'House';
  }

  static get schema() {
    return {
      house_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      capacity: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM(['Brooding', 'Pen']),
        allowNull: false
      }
    };
  }

  static associate({ Location }) {
    Houses.location = Houses.belongsTo(Location, { as: 'location', foreignKey: 'location_id' });
  }
}

module.exports = (sequelize) => {
  Houses.init(Houses.schema, {
    sequelize,
    modelName: Houses.modelName,
    tableName: Houses.tblName,
    underscored: true
  });

  return Houses;
};
