
const { house } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.createTable(house.tblName, house.schema),
  down: (queryInterface) => queryInterface.dropTable(house.tblName)
};
