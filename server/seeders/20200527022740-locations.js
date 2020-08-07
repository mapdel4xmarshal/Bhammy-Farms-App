
const { Location } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(Location.tblName, [
    {
      location_id: '90925220-6d4c-4668-9137-70c3e58ff878',
      name: 'Ajegunle',
      address: 'Bhammy Farms, Off Asa-dam',
      state: 'Kwara',
      phone: '08073290177',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      location_id: '84a519f5-09c1-4c57-83c8-f0e2cc773c3c',
      name: 'Oloko',
      address: 'Km 10 Eyenkorin - Afon road behind Oloko village, Afon',
      state: 'Kwara',
      phone: '08073290177',
      longitude: '4.53',
      latitude: '8.32',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]),
  down: (queryInterface) => queryInterface.bulkDelete(Location.tblName, null, {})
};
