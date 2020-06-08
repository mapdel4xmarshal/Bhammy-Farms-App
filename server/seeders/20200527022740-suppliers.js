
const { Supplier } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(Supplier.tblName, [
    {
      supplier_id: 1,
      party_party_id: '316756f5-ae9d-4068-b16d-ed6982bb0c3b',
      remark: 'Good source',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]),

  down: (queryInterface) => queryInterface.bulkDelete(Supplier.tblName, null, {})
};
