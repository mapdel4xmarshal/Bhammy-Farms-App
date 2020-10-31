
const { Model, DataTypes, Sequelize } = require('sequelize');

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
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    };
  }

  static associate({
    Batch, Mortality, Vaccination, Medication, ProductionItem, Item
  }) {
    Productions.batch = Productions.belongsTo(Batch, { foreignKey: 'batch_id' });
    Productions.items = Productions.belongsToMany(Item, { through: ProductionItem, foreignKey: 'production_id' });
    Productions.mortality = Productions.hasMany(Mortality, { foreignKey: 'production_id' });
    Productions.vaccinations = Productions.hasMany(Vaccination, { foreignKey: 'production_id' });
    Productions.medication = Productions.hasMany(Medication, { foreignKey: 'production_id' });
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
