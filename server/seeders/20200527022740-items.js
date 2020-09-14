
const { Item } = require('../models');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(Item.tblName, [
    {
      item_id: 1,
      item_name: 'Large Egg',
      category: 'egg',
      packaging_size: 30,
      packaging_metric: 'crate',
      unit: 'piece',
      price: 900,
      image: 'uploads/egg.jpg',
      description: 'Large sized egg',
      quantity: 1,
      brand: 'Bhammy farms',
      is_produced: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 2,
      item_name: 'Medium Egg',
      category: 'egg',
      packaging_size: 30,
      price: 800,
      packaging_metric: 'crate',
      unit: 'piece',
      quantity: 1,
      image: 'uploads/egg.jpg',
      description: 'Medium sized egg',
      brand: 'Bhammy farms',
      is_produced: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 3,
      item_name: 'Small/Pullet Egg',
      category: 'egg',
      price: 670,
      packaging_size: 30,
      packaging_metric: 'crate',
      unit: 'piece',
      quantity: 1,
      image: 'uploads/egg.jpg',
      description: 'Pullet sized egg',
      brand: 'Bhammy farms',
      is_produced: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 4,
      item_name: 'Cracked Egg',
      category: 'egg',
      price: 570,
      quantity: 1,
      image: 'uploads/damaged.jpg',
      packaging_size: 30,
      packaging_metric: 'crate',
      unit: 'piece',
      description: 'Unsorted craked/damaged eggs',
      brand: 'Bhammy farms',
      is_produced: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 5,
      item_name: 'Ungraded Egg',
      category: 'egg',
      packaging_size: 30,
      packaging_metric: 'crate',
      unit: 'piece',
      quantity: 1,
      image: 'uploads/ungraded.jpg',
      price: 750,
      description: 'All sizes. i.e unsorted eggs',
      brand: 'Bhammy farms',
      is_produced: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      item_id: 9,
      item_name: 'Manure',
      category: 'manure',
      price: 500,
      packaging_size: 50,
      packaging_metric: 'bag',
      unit: 'kg',
      quantity: 1,
      image: 'uploads/manure.jpg',
      description: 'Chicken litters.',
      brand: 'Bhammy farms',
      is_produced: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]),

  down: (queryInterface) => queryInterface.bulkDelete(Item.tblName, null, {})
};
