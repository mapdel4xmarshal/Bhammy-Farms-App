
const { Source } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.createTable(Source.tblName, Source.schema),
  down: (queryInterface) => queryInterface.dropTable(Source.tblName)
};
