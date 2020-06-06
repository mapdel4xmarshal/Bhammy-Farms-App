
const { Party } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(Party.tblName, [
    {
      party_id: '316756f5-ae9d-4068-b16d-ed6982bb0c3b',
      name: 'ZARTECH LTD',
      address: 'Plot 8, Block L Oluyole Industrial Estate, South West Ring Road, Ibadan, Oyo State, Nigeria',
      state: 'Oyo',
      phone: '08075610000',
      email: 'info@zartechltd.com',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]),
  down: (queryInterface) => queryInterface.bulkDelete(Party.tblName, null, {})
};
