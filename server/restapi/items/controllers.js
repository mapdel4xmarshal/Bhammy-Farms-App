const path = require('path');
const formidable = require('formidable');
const { Item, Sequelize } = require('../../models');
const { fileUploadPath } = require('../../configs');

class Controller {
  // eslint-disable-next-line class-methods-use-this
  async getItems({ groupBy, category, isProduced }) {
    const where = {};
    if (category) {
      if (Array.isArray(category)) where.category = { [Sequelize.Op.in]: category };
      else where.category = category;
    }
    if (isProduced !== undefined) where.is_produced = +Boolean(isProduced);

    return Item.findAll({
      where,
      attributes: [
        ['item_id', 'id'], ['item_name', 'name'], 'category', 'quantity', ['packaging_size', 'packagingSize'],
        'unit', 'price', 'brand', 'image', ['packaging_metric', 'packagingMetric'], ['is_produced', 'isProduced'],
        'description'
      ],
      order: [
        ['category', 'ASC']
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
    const { user } = req;

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, item, files) => {
        if (err) reject(err);

        const attachment = files.thumbnail ? files.thumbnail.path.replace(`${fileUploadPath}${path.sep}`, '') : null;

        const conflict = await Item.count({
          where: {
            item_name: item.name
          }
        });

        if (conflict) {
          return resolve({
            error: 'Item name already exists',
            status: 409
          });
        }

        Item.create({
          item_name: item.name,
          category: item.category.toLowerCase(),
          brand: item.brand,
          packaging_size: item.packagingSize,
          packaging_metric: item.packagingMetric.toLowerCase(),
          quantity: 0,
          unit: item.unit.toLowerCase(),
          price: item.price,
          image: attachment,
          is_produced: item.isProduced == 'undefined' ? false : item.isProduced,
          description: item.description == 'undefined' ? '' : item.description
        }, { user, resourceId: 'item_id' })
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

  async updateItem(id, req) {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir: `${fileUploadPath}${path.sep}uploads`
    });
    const { user } = req;

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, item) => {
        if (err) reject(err);

        Item.update({
          item_name: item.name,
          category: item.category.toLowerCase(),
          brand: item.brand,
          packaging_size: item.packagingSize,
          packaging_metric: item.packagingMetric.toLowerCase(),
          unit: item.unit.toLowerCase(),
          price: item.price,
          is_produced: item.isProduced,
          description: item.description
        }, { user, resourceId: 'item_id', where: { item_id: id } })
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
      attributes: ['brand'],
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

  async getPackagingMetrics() {
    return Item.findAll({
      attributes: [['packaging_metric', 'packagingMetric']],
      order: [
        ['packaging_metric', 'ASC']
      ],
      group: ['packaging_metric'],
      where: {
        packaging_metric: {
          [Sequelize.Op.ne]: null
        }
      }
    })
      .then((items) => items.map((item) => item.toJSON().packagingMetric.replace(/\b[a-z]/g, (match) => match.toUpperCase())));
  }

  async getItemCategories() {
    return Item.findAll({
      attributes: ['category'],
      order: [
        ['category', 'ASC']
      ],
      group: ['category'],
      where: {
        category: {
          [Sequelize.Op.ne]: null
        }
      }
    })
      .then((items) => items.map((item) => item.category.replace(/\b[a-z]/g, (match) => match.toUpperCase())));
  }

  async getItemUnits() {
    return Item.findAll({
      attributes: ['unit'],
      order: [
        ['unit', 'ASC']
      ],
      group: ['unit'],
      where: {
        unit: {
          [Sequelize.Op.ne]: null
        }
      }
    })
      .then((items) => items.map((item) => item.unit.replace(/\b[a-z]/g, (match) => match.toUpperCase())));
  }
}

module.exports = new Controller();
