
const { ExpenseType } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.createTable(ExpenseType.tblName, ExpenseType.schema),
  down: (queryInterface) => queryInterface.dropTable(ExpenseType.tblName)
};
