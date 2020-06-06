
const { Source } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(Source.tblName, [
    {
      source_id: 1,
      remark: 'Good source',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]),

  down: (queryInterface) => queryInterface.bulkDelete(Source.tblName, null, {})
};
