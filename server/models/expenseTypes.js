'use strict';

const { Model, DataTypes } = require('sequelize');

class ExpenseTypes extends Model {
  static get tblName() {
    return 'ExpenseTypes';
  }

  static get modelName() {
    return 'ExpenseType';
  }

  static get schema() {
    return {
      expense_type_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        uniqueItems: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      }
    };
  }
}

module.exports = (sequelize) => {
  ExpenseTypes.init(ExpenseTypes.schema, {
    sequelize,
    modelName: ExpenseTypes.modelName,
    tableName: ExpenseTypes.tblName
  });

  return ExpenseTypes;
};
