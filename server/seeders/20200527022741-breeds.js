
const { Breed } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(Breed.tblName, [
    {
      breed_id: 1,
      name: 'Isa Brown',
      category: 'bird',
      type: 'Layer',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      breed_id: 2,
      name: 'Rhode Island Red',
      category: 'bird',
      type: 'Layer',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      breed_id: 3,
      name: 'Leghorn',
      category: 'bird',
      type: 'Layer',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      breed_id: 4,
      name: 'Cornish crosses',
      category: 'bird',
      type: 'Broiler',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      breed_id: 5,
      name: 'Kuroiler',
      category: 'bird',
      type: 'Broiler',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]),
  down: (queryInterface) => queryInterface.bulkDelete(Breed.tblName, null, {})
};
