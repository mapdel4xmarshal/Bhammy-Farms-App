const { Item } = require('../../models');

class Controller {
  // eslint-disable-next-line class-methods-use-this
  async getItems({ groupBy, category }) {
    const where = {};
    if (category) where.category = category;

    return Item.findAll({
      where,
      attributes: [
        ['item_id', 'id'], ['item_name', 'name'], 'category', 'quantity', 'size', 'unit', 'price', 'brand',
        'description'
      ],
      order: [
        ['category', 'ASC'],
        ['size', 'ASC'],
      ]
    })
      .then((items) => {
        if (groupBy) {
          const itemGroups = {};
          items.forEach((item) => {
            if (!itemGroups.hasOwnProperty(item[groupBy])) {
              itemGroups[item[groupBy]] = [];
            }
            itemGroups[item[groupBy]].push(item);
          });
          return itemGroups;
        } return items;
      });
  }

  async addItem(item) {
    Item.create({
      item_name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      description: item.description
    })
      .then((newItem) => newItem.item_id)
      .catch((error) => {
        console.log(error);
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }
}

module.exports = new Controller();
