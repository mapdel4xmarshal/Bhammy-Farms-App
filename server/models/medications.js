
const { Model, DataTypes } = require('sequelize');

class Medications extends Model {
  static get tblName() {
    return 'medication';
  }

  static get modelName() {
    return 'Medication';
  }

  static get schema() {
    return {
      medication_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      medicament_batch_no: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dosage: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      dosage_unit: {
        type: DataTypes.STRING,
        allowNull: false
      },
      total_dosage: {
        type: DataTypes.DECIMAL,
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
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    };
  }

  static associate({ Item }) {
    Medications.medicaments = Medications.belongsTo(Item, { foreignKey: 'medicament_id' });
  }
}

module.exports = (sequelize) => {
  Medications.init(Medications.schema, {
    sequelize,
    modelName: Medications.modelName,
    tableName: Medications.tblName
  });

  return Medications;
};
