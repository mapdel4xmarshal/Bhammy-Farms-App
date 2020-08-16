
const { Model, DataTypes } = require('sequelize');

class Mortality extends Model {
  static get tblName() {
    return 'mortality';
  }

  static get modelName() {
    return 'Mortality';
  }

  static get schema() {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      time: {
        type: DataTypes.TIME,
        allowNull: true
      },
      count: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reason: {
        type: DataTypes
          .ENUM('Crushed', 'Disease', 'Pecking', 'Predator',
            'Prolapse', 'Sick', 'Suffocation', 'Unknown', 'Other'),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    };
  }

  static associate({ Production }) {
    Mortality.production = Mortality.belongsTo(Production, { foreignKey: 'production_id' });
  }
}

module.exports = (sequelize) => {
  Mortality.init(Mortality.schema, {
    sequelize,
    modelName: Mortality.modelName,
    tableName: Mortality.tblName
  });

  return Mortality;
};
