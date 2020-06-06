
const { Location } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.createTable(Location.tblName, Location.schema),
  down: (queryInterface) => queryInterface.dropTable(Location.tblName)
};
