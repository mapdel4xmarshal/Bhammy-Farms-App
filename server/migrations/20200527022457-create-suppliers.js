
const { Supplier } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.createTable(Supplier.tblName, Supplier.schema),
  down: (queryInterface) => queryInterface.dropTable(Supplier.tblName)
};
