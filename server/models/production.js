
const { Model, DataTypes } = require('sequelize');

class Productions extends Model {
  static get tblName() {
    return 'productions';
  }

  static get modelName() {
    return 'Production';
  }

  static get schema() {
    return {
      production_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      currentStock: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      humidity: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      temperature: {
        type: DataTypes.INTEGER, // http://api.weatherapi.com/v1/history.json?key=aa5f3c747bb140be95f230031202507&q=afon, kwara state&dt=2020-07-25
        allowNull: true
      },
      weatherCondition: {
        type: DataTypes.STRING,
        allowNull: true
      },
      water: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    };
  }

  static associate({
    Batch, Mortality, Vaccination, Medication, Item
  }) {
    Productions.batch = Productions.belongsTo(Batch, { foreignKey: 'batch_id' });
    Productions.items = Productions.hasMany(Item, { through: 'productionItem', foreignKey: 'item_id' });
    Productions.mortality = Productions.hasMany(Mortality, { foreignKey: 'mortality_id' });
    Productions.vaccinations = Productions.hasMany(Vaccination, { foreignKey: 'vaccination_id' });
    Productions.medication = Productions.hasMany(Medication, { foreignKey: 'medication_id' });
  }
}

module.exports = (sequelize) => {
  Productions.init(Productions.schema, {
    sequelize,
    modelName: Productions.modelName,
    tableName: Productions.tblName
  });

  return Productions;
};
