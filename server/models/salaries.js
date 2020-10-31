const { Model, DataTypes } = require('sequelize');

class Salaries extends Model {
  static get tblName() {
    return 'salaries';
  }

  static get modelName() {
    return 'Salary';
  }

  static get schema() {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      period_start: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      period_end: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      payment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      loan_payment: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      reference_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      comment: {
        type: DataTypes.TEXT
      }
    };
  }
}

module.exports = (sequelize) => {
  Salaries.init(Salaries.schema, {
    sequelize,
    modelName: Salaries.modelName,
    tableName: Salaries.tblName,
    underscored: true
  });

  return Salaries;
};
