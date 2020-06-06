
const { location } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.createTable(location.tblName, location.schema),
  down: (queryInterface) => queryInterface.dropTable(location.tblName)
};
