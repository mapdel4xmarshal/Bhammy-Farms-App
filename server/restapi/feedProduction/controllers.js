const {
  FeedProduction, Sequelize: { Op }, sequelize, FeedProductionItem, Item
} = require('../../models');
const ProductionRecord = require('./productionRecord');
const ProductionSummary = require('./productionSummary');
const Bot = require('./bot');

class Controller {
  constructor() {
    new Bot(this).listen();
  }

  async getProductions({
    before, after, date, id
  }) {
    const where = {};
    if (id) where.id = id;
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

          records.push(new ProductionRecord(feed));
        }

        return {
          records,
          summary: new ProductionSummary(records)
        };
      });
  }

  async addProduction(user, production) {
    const transaction = await sequelize.transaction();

    try {
      const newProduction = await FeedProduction.create({
        date: production.date,
        type: production.type.id,
        energy_level: production.energyLevel,
        note: production.comment,
        stamp: production.stamp || null
      }, {
        transaction,
        user,
        resourceId: 'id'
      });

      const productionId = newProduction.id;

      const itemPriceMap = await Item.findAll({
        attributes: ['item_id', 'price'],
        where: {
          item_id: {
            [Op.in]: production.ingredients.map((item) => item.id)
          }
        },
        transaction
      })
        .then((items) => new Map(items.map((item) => [item.item_id, item.price])));

      await FeedProductionItem.bulkCreate(production.ingredients.map((item) => ({
        quantity: item.quantity,
        item_id: item.id,
        price: itemPriceMap.get(item.id),
        feed_production_id: productionId
      })), {
        transaction,
        user,
        resourceId: 'id'
      });

      const productionAmount = production.ingredients
        .reduce((totalQuantity, ingredient) => totalQuantity + +ingredient.quantity, 0);

      await Item.increment('quantity', {
        by: Number(productionAmount),
        where: { item_id: production.type.id },
        transaction,
        user,
        resourceId: 'item_id'
      });

      const { ingredients } = production;

      for (const ingredient of ingredients) {
        await Item.decrement('quantity', {
          by: Number(ingredient.quantity),
          where: { item_id: ingredient.id },
          transaction,
          user,
          resourceId: 'item_id'
        });
      }

      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      await transaction.commit();

      return newProduction;
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      return {
        error: 'Unable to process request. Please try again later!',
        status: 500
      };
    }
  }

  async deleteProduction(id, user) {
    const productions = await this.getProductions({ id });
    const production = productions.records[0] || null;

    if (!production) {
      return {
        error: `No feed production found with id ${id}`,
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

    // Delete production
    await FeedProduction.destroy({
      where: {
        id
      }
    });

    await transaction.commit();
  }
}

module.exports = new Controller();
