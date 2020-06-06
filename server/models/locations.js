
const { Model, DataTypes } = require('sequelize');

class Locations extends Model {
  static get tblName() {
    return 'locations';
  }

  static get modelName() {
    return 'Location';
  }

  static get schema() {
    return {
      location_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        uniqueItems: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      alt_phone: {
        type: DataTypes.STRING,
        allowNull: true
      }
    };
  }

  static associate({ House }) {
    Locations.house = Locations.hasMany(House);
  }
}

module.exports = (sequelize) => {
  Locations.init(Locations.schema, {
    sequelize,
    modelName: Locations.modelName,
    tableName: Locations.tblName
  });

  return Locations;
};
