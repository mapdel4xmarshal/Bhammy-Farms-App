const { Model, DataTypes } = require('sequelize');

class Vaccinations extends Model {
  static get tblName() {
    return 'vaccinations';
  }

  static get modelName() {
    return 'Vaccination';
  }

  static get schema() {
    return {
      vaccination_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      vaccine_batch_no: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dosage: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      dosage_unit: {
        type: DataTypes.STRING,
        allowNull: false
      },
      total_dosage: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      no_of_birds: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      method: {
        type: DataTypes.ENUM(
          'Beak Dipping',
          'Dosing Pump',
          'Drinking Water',
          'Feed',
          'Intramuscular Injection',
          'Intraocular (Eye Drop)',
          'Subcutaneous Injection',
          'Spray',
          'Wing Web Prick'
        ),
        allowNull: false
      },
      administered_by: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      item_price: {
        type: DataTypes.VIRTUAL
      }
    };
  }

  static associate({ Item }) {
    Vaccinations.vaccines = Vaccinations.belongsTo(Item, { foreignKey: 'vaccine_id' });
  }
}

module.exports = (sequelize) => {
  Vaccinations.init(Vaccinations.schema, {
    sequelize,
    modelName: Vaccinations.modelName,
    tableName: Vaccinations.tblName
  });

  return Vaccinations;
};
