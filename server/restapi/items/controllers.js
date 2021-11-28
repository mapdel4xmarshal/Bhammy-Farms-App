const path = require('path');
const formidable = require('formidable');
const { Item, Sequelize, sequelize } = require('../../models');
const { fileUploadPath } = require('../../configs');
const { isEmpty } = require('../../utilities/common');
const Debug = require('../../utilities/debugger');

const debug = new Debug('Items:Controller');

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
        'description', ['notification', 'enableNotification'], ['min_stock_level', 'minimumStock'],
        ['reorder_level', 'restockLevel']
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
          is_produced:  isEmpty(item.isProduced) ? false : item.isProduced,
          description: isEmpty(item.description) ? '' : item.description,
          min_stock_level: item.minimumStock,
          reorder_level: item.restockLevel,
          notification: item.enableNotification
        }, { user, resourceId: 'item_id' })
          .then(resolve)
          .catch(reject);
      });
    }).catch((e) => {
      debug.error('AddItem', e);
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
          is_produced: isEmpty(item.isProduced) ? false : item.isProduced,
          min_stock_level: item.minimumStock,
          reorder_level: item.restockLevel,
          notification: item.enableNotification,
          ...(!isEmpty(item.description) && { description: item.description })
        }, { user, resourceId: 'item_id', where: { item_id: id } })
          .then(resolve)
          .catch(reject);
      });
    }).catch((e) => {
      debug.error('UpdateItem', e);
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
      .then((items) => items.map((item) => item.toJSON()
        .packagingMetric.replace(/\b[a-z]/g, (match) => match.toUpperCase())));
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

  async getItemsPrices(itemId, quantity = 1, maxPrice = true) {
    const whereClause = itemId ? `WHERE I.item_id IN (${!Array.isArray(itemId) ? itemId : itemId.join(',')})` : '';
    const price = maxPrice
      ? 'MAX(IV.inventoryPrice) over (PARTITION BY IV.item_id) as price' : 'IV.inventoryPrice as price';

    const query = `
        SELECT IV.inventoryId, IV.inventoryQuantity, ${price}, IV.item_name as itemName, IV.unit,
        IV.packaging_size as packagingSize, IV.packaging_metric as packagingMetric, IV.is_produced as isProduced,
        IV.min_stock_level as minStockLevel, IV.reorder_level as reOrderLevel, IV.item_quantity as remainingItem,
        IV.item_id as itemId, IV.stock as inventoryCumulativeStock, IV.consumed_quantity as consumedQuantity,
        IV.totalSupplied as totalSuppliedTillDate, IV.totalRemaining
          FROM (
          SELECT I.id as inventoryId, I.quantity as inventoryQuantity, I.price as inventoryPrice, IT.item_name,
          IT.unit, IT.packaging_size, IT.packaging_metric, IT.is_produced, IT.min_stock_level, IT.notification,
          IT.reorder_level, IT.quantity as item_quantity, I.item_id,
          sum(I.quantity)
          over(PARTITION BY I.item_id order by I.item_id, I.id rows between unbounded preceding and current row) stock,
          SUM(coalesce(C.quantity, 0)) AS consumed_quantity,
          SUM(I.quantity) OVER (PARTITION BY I.item_id order by I.item_id) AS 'totalSupplied',
          SUM(I.quantity) OVER (PARTITION BY I.item_id order by I.item_id) - SUM(coalesce(C.quantity, 0))
          AS 'totalRemaining',
          SUM(I.quantity) OVER (PARTITION BY I.item_id order by I.item_id, I.id) - (I.quantity) as balance
          from item_inventory I
          JOIN items IT
          ON IT.item_id = I.item_id
          LEFT JOIN item_consumption C
          ON C.item_id = I.item_id
          ${whereClause}
          GROUP BY I.id
          order by I.item_id, I.id
          ) as IV
        WHERE (balance - coalesce(consumed_quantity, 0)) < ${quantity}
         && (stock - coalesce(consumed_quantity, 0)) > 0;`;

    debug.info('getItemsPrices::query', query);
    return sequelize.query(query).then(([items]) => {
      debug.info('getItemsPrices result', items);
      return items;
    });
  }
}

module.exports = new Controller();
