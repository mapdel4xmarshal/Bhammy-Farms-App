const path = require('path');
const formidable = require('formidable');
const { Item, Sequelize } = require('../../models');
const { fileUploadPath } = require('../../configs');

class Controller {
  // eslint-disable-next-line class-methods-use-this
  async getItems({ groupBy, category }) {
    const where = {};
    if (category) where.category = category;

    return Item.findAll({
      where,
      attributes: [
        ['item_id', 'id'], ['item_name', 'name'], 'category', 'quantity', 'size', 'unit', 'price', 'brand', 'image',
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
        }
        return items;
      });
  }

  async addItem(req) {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir: `${fileUploadPath}${path.sep}uploads`
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, expense, files) => {
        if (err) reject(err);

        const attachment = files.thumbnail ? files.attachment.path.replace(`${fileUploadPath}${path.sep}`, '') : null;

        Item.create({
          item_name: item.name,
          category: item.category,
          brand: item.brand,
          size: item.size,
          quantity: item.quantity,
          unit: item.unit,
          price: item.price,
          image: attachment,
          description: item.description
        })
          .then(resolve)
          .catch(reject);
      });
    }).catch((e) => {
      console.log(e); // todo: add proper logger
      return {
        error: 'Unable to process request. Please try again later!',
        status: 500
      };
    });
  }

  async getItemBrands() {
    return Item.findAll({
      attributes: [ 'brand' ],
      order: [
        ['brand', 'ASC']
      ],
      group: ['brand'],
      where: {
        brand: {
          [Sequelize.Op.ne]: null
        }
      }
    })
      .then((brands) => brands);
  }
}

module.exports = new Controller();
