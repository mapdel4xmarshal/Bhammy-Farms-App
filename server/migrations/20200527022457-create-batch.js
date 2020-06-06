
const { Batch } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.createTable(Batch.tblName, Batch.schema),
  down: (queryInterface) => queryInterface.dropTable(Batch.tblName)
};
