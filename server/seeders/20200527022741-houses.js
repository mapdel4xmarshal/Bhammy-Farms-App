
const { House } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(House.tblName, [
    {
      location_id: '90925220-6d4c-4668-9137-70c3e58ff878',
      house_id: '027f0965-e6d0-45ea-9d98-200cfdfaf52f',
      name: 'AJG-P001',
      capacity: 4000,
      type: 'Pen',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      location_id: '84a519f5-09c1-4c57-83c8-f0e2cc773c3c',
      house_id: '070f187f-09af-42d1-8ef4-3441cc66624d',
      name: 'OLO-P001',
      capacity: 4000,
      type: 'Pen',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      location_id: '84a519f5-09c1-4c57-83c8-f0e2cc773c3c',
      house_id: 'ad8472e7-bc60-465a-986e-f43eb870f3fb',
      name: 'OLO-P002',
      capacity: 4000,
      type: 'Pen',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      location_id: '84a519f5-09c1-4c57-83c8-f0e2cc773c3c',
      house_id: 'fac2a79c-f9ba-43ce-8c14-5c5e386f5c48',
      name: 'OLO-BP001',
      capacity: 4500,
      type: 'Brooding',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]),
  down: (queryInterface) => queryInterface.bulkDelete(House.tblName, null, {})
};
