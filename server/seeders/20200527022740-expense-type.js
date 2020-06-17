
const { ExpenseType } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(ExpenseType.tblName, [
    {
      expense_type_id: 1,
      name: 'Transport',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      expense_type_id: 2,
      name: 'Medication',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      expense_type_id: 3,
      name: 'Salary',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      expense_type_id: 4,
      name: 'Feed',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      expense_type_id: 5,
      name: 'Construction',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      expense_type_id: 6,
      name: 'Repair',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      expense_type_id: 7,
      name: 'Fuel',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      expense_type_id: 8,
      name: 'Other',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]),
  down: (queryInterface) => queryInterface.bulkDelete(ExpenseType.tblName, null, {})
};
