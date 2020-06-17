
const { House } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.createTable(House.tblName, House.schema),
  down: (queryInterface) => queryInterface.dropTable(House.tblName)
};
