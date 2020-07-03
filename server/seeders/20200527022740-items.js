
const { Item } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(Item.tblName, [
    {
      item_id: 1,
      item_name: "Large Egg",
      category: "Egg",
      size: "large",
      price: 900,
      unit: "Crate",
      description: "Large sized egg",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 2,
      item_name: "Medium Egg",
      category: "Egg",
      price: 820,
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
      price: 670,
      size: "small",
      unit: "Crate",
      description: "Pullet sized egg",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 4,
      item_name: "Cracked Egg",
      category: "Egg",
      price: 570,
      size: "ungraded",
      unit: "Crate",
      description: "Unsorted craked/damaged eggs",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 5,
      item_name: "Ungraded Egg",
      category: "Egg",
      size: "ungraded",
      price: 750,
      unit: "Crate",
      description: "All sizes. i.e unsorted eggs",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 6,
      item_name: "Small Cockerel",
      category: "Cockerel",
      price: 900,
      size: "1-2kg",
      unit: "Bird",
      description: "Small sized Cockerel",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 7,
      item_name: "Medium Cockerel",
      category: "Cockerel",
      price: 1200,
      size: "2-3kg",
      unit: "Bird",
      description: "Medium sized Cockerel",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 8,
      item_name: "Large Cockerel",
      category: "Cockerel",
      size: "3-4kg",
      price: 2000,
      unit: "Bird",
      description: "Large sized Cockerel",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 9,
      item_name: "Manure",
      category: "Manure",
      price: 500,
      size: "100kg",
      unit: "Bag",
      description: "Chicken litters.",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 10,
      item_name: "Old layer",
      category: "Old layer",
      price: 1400,
      size: "All sizes",
      unit: "Bird",
      description: "Spent layers.",
      created_at: new Date(),
      updated_at: new Date()
    }
  ]),

  down: (queryInterface) => queryInterface.bulkDelete(Item.tblName, null, {})
};
