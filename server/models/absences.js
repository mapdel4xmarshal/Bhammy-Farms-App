const { Model, DataTypes } = require('sequelize');

class Absences extends Model {
  static get tblName() {
    return 'absences';
  }

  static get modelName() {
    return 'Absence';
  }

  static get schema() {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM(['vacation', 'dayoff', 'unapproved']),
        allowNull: false
      },
      approved_by: {
        type: DataTypes.STRING,
        allowNull: false
      },
      comment: {
        type: DataTypes.TEXT
      }
    };
  }

  static associate({ Employee }) {
    Absences.employee = Absences.belongsTo(Employee, { foreignKey: 'employee_id' });
  }
}

module.exports = (sequelize) => {
  Absences.init(Absences.schema, {
    sequelize,
    modelName: Absences.modelName,
    tableName: Absences.tblName,
    underscored: true
  });

  return Absences;
};
