const {
  FeedProduction, Sequelize: { Op }, sequelize, FeedProductionItem, Item, ItemInventory, ItemConsumption
} = require('../../models');
const ProductionRecord = require('./productionRecord');
const ProductionSummary = require('./productionSummary');
const itemsController = require('../items/controllers');
const Debug = require('../../utilities/debugger');

const debug = new Debug('FeedProduction:Controller');
const MILLING_COST_PER_KG = 2;

class Controller {
  async getProductions({
    before, after, date, id, stamp
  }) {
    const where = {};
    if (id) where.id = id;
    if (stamp) where.stamp = stamp;
    if (before || after) where.date = {};
    if (date) where.date = date;
    if (before) where.date[Op.lte] = before;
    if (after) where.date[Op.gte] = after;

    return FeedProduction.findAll({
      where,
      attributes: ['id', 'date', ['energy_level', 'energyLevel'], 'note', 'type'],
      include: [
        {
          model: Item,
          attributes: [
            ['item_id', 'id'], ['item_name', 'name'], 'category', ['packaging_size', 'packagingSize'],
            'unit', 'brand', 'image', ['packaging_metric', 'packagingMetric'], ['is_produced', 'isProduced'],
            'description'
          ]
        }
      ],
      order: [
        ['date', 'DESC']
      ]
    })
      .then(async (feeds) => {
        const itemsById = new Map();

        const records = [];
        for (const _feed of feeds) {
          const feed = _feed.toJSON();

          if (!itemsById.has(feed.type)) {
            await Item.findByPk(feed.type)
              .then((item) => {
                const itemData = item.toJSON();
                itemsById.set(feed.type, itemData);
                return itemData;
              });
          }

          const item = itemsById.get(feed.type);
          feed.type = {
            id: item.item_id,
            name: item.item_name,
            thumbnail: item.image
          };

          records.push(new ProductionRecord(feed, MILLING_COST_PER_KG));
        }

        return {
          records,
          summary: new ProductionSummary(records, MILLING_COST_PER_KG)
        };
      });
  }

  async deleteProduction(identifier = {}, user) {
    const productions = await this.getProductions(identifier);
    const production = productions.records[0] || null;
    const prop = identifier.stamp ? 'stamp' : 'id';
    const id = identifier.stamp ? identifier.stamp : identifier.id;

    if (!production) {
      return {
        error: `No feed production found with ${prop} ${id}`,
        status: 400
      };
    }

    const transaction = await sequelize.transaction();

    // Reverse feeds produced
    await Item.decrement('quantity', {
      by: Number(production.summary.quantity),
      where: { item_id: production.type.id },
      transaction,
      user,
      resourceId: 'item_id'
    });

    // Reverse ingredients
    for (const ingredient of production.ingredients) {
      await Item.increment('quantity', {
        by: Number(ingredient.quantity),
        where: { item_id: ingredient.id },
        transaction,
        user,
        resourceId: 'item_id'
      });
    }

    // get feed item ids
    const feedProductionItemIds = await FeedProductionItem.findAll({
      attributes: ['id'],
      where: {
        feed_production_id: production.id
      }
    },
    {
      transaction,
      user,
      resourceId: 'id'
    }).then((productionItems) => productionItems.map((productionItem) => productionItem.id));

    // delete consumption
    await ItemConsumption.destroy({
      where: {
        consumer_id: {
          [Op.in]: feedProductionItemIds
        },
        consumer: 'FeedProductionItem'
      }
    }, {
      transaction,
      user,
      resourceId: 'id'
    });

    // Delete production
    await FeedProduction.destroy({
      where: {
        [prop]: id
      }
    },
    {
      transaction,
      user,
      resourceId: 'id'
    });

    await ItemInventory.destroy({
      where: {
        producer_id: production.id,
        producer: 'FeedProduction'
      }
    }, {
      transaction,
      user,
      resourceId: 'id'
    });

    await transaction.commit();
  }

  validateIngredients(production, itemNameMap) {
    production.ingredients.forEach((ingredient) => {
      const item = itemNameMap.get(ingredient.id);

      debug.info('itemNameMap', itemNameMap);

      if (!item) {
        debug.error('Validation', `Unknown ingredient ${ingredient.name || ingredient.id}, id: ${ingredient.id}.`);

        throw {
          error: `Unknown ingredient ${ingredient.name || ingredient.id}.`,
          status: 400
        };
      } else if (+item.quantity < +ingredient.quantity) {
        debug.error('Validation', `Not enough *${item.name}* (${item.quantity}${item.unit}) in the store.`);
        throw {
          error: `Not enough *${item.name}* (${item.quantity}${item.unit}) in the store. Please restock and try again.`,
          status: 400
        };
      }
    });
  }

  async addProduction(user, production, trnx) {
    const transaction = trnx || await sequelize.transaction();

    try {
      const itemNameMap = await Item.findAll({
        attributes: [['item_id', 'id'], ['item_name', 'name'], 'quantity', 'unit', ['packaging_size', 'packagingSize']],
        where: {
          item_id: {
            [Op.in]: [...production.ingredients.map((item) => item.id), production.type.id]
          },
        },
        raw: true,
        nest: true,
        transaction
      })
        .then((items) => new Map(items.map((item) => [item.id, item])));

      // Validate ingredients
      this.validateIngredients(production, itemNameMap);

      const promises = production.ingredients.map((item) => itemsController.getItemsPrices(item.id, item.quantity));

      const itemPriceMap = await Promise.all(promises).then((items) => {
        items = [].concat(...items);

        const itemMap = new Map();
        items.forEach((item) => {
          itemMap.set(item.itemId, {
            price: item.price,
            name: item.itemName,
            packagingSize: item.packagingSize
          });
        });
        return itemMap;
      });

      const productionQuantity = production.ingredients
        .reduce((totalQuantity, ingredient) => totalQuantity + +ingredient.quantity, 0);

      const productionCost = production.ingredients
        .reduce((totalCost, ingredient) => {
          const item = itemPriceMap.get(ingredient.id);
          return totalCost + ((+ingredient.quantity / +item.packagingSize) * +item.price);
        }, 0);

      const bags = productionQuantity / itemNameMap.get(production.type.id).packagingSize;

      // Insert production record
      const newProduction = await FeedProduction.create({
        date: production.date,
        type: production.type.id,
        energy_level: production.energyLevel,
        note: production.comment,
        stamp: production.stamp || null,
        quantity: productionQuantity,
        price: Math.ceil((productionCost + (MILLING_COST_PER_KG * productionQuantity)) / bags)
      }, {
        transaction,
        user,
        resourceId: 'id'
      });

      await this.insertIngredients(newProduction.id, production, itemPriceMap, transaction, user);

      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      if (!trnx) await transaction.commit();

      return newProduction;
    } catch (e) {
      debug.error('NewProduction', e);
      await transaction.rollback();
      throw {
        error: e.error || e.message || 'Unable to process request. Please try again later!',
        message: e.message || e || null,
        status: e.status || 500
      };
    }
  }

  async insertIngredients(productionId, production, itemPriceMap, transaction, user) {
    return FeedProductionItem.bulkCreate(production.ingredients.map((item) => ({
      quantity: item.quantity,
      item_id: item.id,
      price: itemPriceMap.get(item.id).price,
      feed_production_id: productionId
    })), {
      transaction,
      user,
      resourceId: 'id'
    });
  }
}

module.exports = new Controller();
