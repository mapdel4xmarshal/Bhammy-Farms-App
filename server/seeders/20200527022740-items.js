
const { Item } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(Item.tblName, [
    {
      item_id: 1,
      item_name: "Large Egg",
      category: "Egg",
      size: "large",
      unit: "Crate",
      description: "Large sized egg",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 2,
      item_name: "Medium Egg",
      category: "Egg",
      size: "medium",
      unit: "Crate",
      description: "Medium sized egg",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 3,
      item_name: "Small Egg",
      category: "Egg",
      size: "small",
      unit: "Crate",
      description: "Pullet sized egg",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 4,
      item_name: "Small Cockerel",
      category: "Cockerel",
      size: "1-2kg",
      unit: "Bird",
      description: "Small sized Cockerel",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 5,
      item_name: "Medium Cockerel",
      category: "Cockerel",
      size: "2-3kg",
      unit: "Bag",
      description: "Medium sized Cockerel",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 6,
      item_name: "Large Cockerel",
      category: "Cockerel",
      size: "3-4kg",
      unit: "Bird",
      description: "Large sized Cockerel",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 7,
      item_name: "Manure",
      category: "Manure",
      size: "100kg",
      unit: "Bag",
      description: "Chicken litters.",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 8,
      item_name: "Old layer",
      category: "Old layer",
      size: "100kg",
      unit: "Bird",
      description: "Spent layersW.",
      created_at: new Date(),
      updated_at: new Date()
    }
  ]),

  down: (queryInterface) => queryInterface.bulkDelete(Item.tblName, null, {})
};
