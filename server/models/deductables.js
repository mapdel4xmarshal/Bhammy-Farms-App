const { Model, DataTypes } = require('sequelize');

class Deductibles extends Model {
  static get tblName() {
    return 'deductibles';
  }

  static get modelName() {
    return 'Deductible';
  }

  static get schema() {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      type: {
        type: DataTypes.ENUM('loan')
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      comment: {
        type: DataTypes.TEXT
      }
    };
  }

  static associate({ Employee }) {
    Deductibles.employee = Deductibles.belongsTo(Employee, { foreignKey: 'employee_id' });
  }
}

module.exports = (sequelize) => {
  Deductibles.init(Deductibles.schema, {
    sequelize,
    modelName: Deductibles.modelName,
    tableName: Deductibles.tblName,
    underscored: true
  });

  return Deductibles;
};
