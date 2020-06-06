
const { Supplier } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(Supplier.tblName, [
    {
      supplier_id: 1,
      remark: 'Good source',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]),

  down: (queryInterface) => queryInterface.bulkDelete(Supplier.tblName, null, {})
};
