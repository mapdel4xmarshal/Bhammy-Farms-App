
const { Model, DataTypes } = require('sequelize');

class Parties extends Model {
  static get tblName() {
    return 'parties';
  }

  static get modelName() {
    return 'Party';
  }

  static get schema() {
    return {
      party_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
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
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      alt_phone: {
        type: DataTypes.STRING,
        allowNull: true
      }
    };
  }
}

module.exports = (sequelize) => {
  Parties.init(Parties.schema, {
    sequelize,
    modelName: Parties.modelName,
    tableName: Parties.tblName,
    underscored: true
  });

  return Parties;
};
