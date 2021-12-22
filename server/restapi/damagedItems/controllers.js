const {
  DamagedItems,
  Item,
  Location,
  sequelize,
  Sequelize: { Op }, ItemConsumption, ItemInventory
} = require('../../models');
const Debug = require('../../utilities/debugger');

const debug = new Debug('DamagedItems:Controller');

class Controller {
  constructor() {
    this.allowedDamageTypes = ['crack', 'expired', 'wastage', 'other'];
  }

  async getDamagedItems(queryParams) {
    const { damageType, before, date, after } = queryParams;
    let where = {};

    if (damageType) where.damage_type = damageType;
    if (before || after) where.date = {};
    if (date) where.date = date;
    if (before) where.date[Op.lte] = before;
    if (after) where.date[Op.gte] = after;

    return DamagedItems.findAll({
      where,
      include: {
        model: Item,
        attributes: ['brand', 'category', 'description', ['image', 'thumbnail'], ['item_id', 'id'],
          ['item_name', 'name'], ['packaging_metric', 'packagingMetric'], ['packaging_size', 'packagingSize'], 'unit']
      },
      order: [['date', 'desc']]
    })
      .then((damagedItems) => damagedItems.map((item) => {
        return {
          id: item.id,
          date: item.date,
          item: item.Item,
          quantity: item.quantity,
          amount: item.price,
          damageType: item.damage_type[0].toUpperCase() + item.damage_type.slice(1),
          description: item.description,
          locationId: item.location_id
        };
      }));
  }

  async addDamagedItem(user, payload, trnx) {
    try {
      const transaction = trnx || await sequelize.transaction();
      const where = payload.location ? {location_id: payload.location} : {};

      if (!this.allowedDamageTypes.includes(payload?.damageType.toLowerCase())) {
        return {
          error: `Unsupported damaged type. Possible options are ${this.allowedDamageTypes.join(',')}`,
          status: 400
        };
      }

      const farm = await Location.findOne({
        where,
        attributes: ['name', 'location_id'],
        transaction
      });

      if (!farm) {
        return {
          error: 'No matching farm/location found',
          status: 400
        };
      }

      const item = await Item.findOne({
        where: {item_id: payload.itemId},
        transaction
      });

      if (!item) {
        return {
          error: 'No matching item found',
          status: 400
        };
      }

      if (payload.quantity < 1) {
        return {
          error: 'Quantity should be greater than 0',
          status: 400
        };
      }

      const damagedRecord = await DamagedItems.create({
        date: payload.date,
        location_id: farm.location_id,
        item_id: payload.itemId,
        quantity: payload.quantity,
        price: item.price,
        damage_type: payload.damageType,
        stamp: payload.stamp
      }, {
        transaction,
        user,
        resourceId: 'id'
      }).then(async (item) => {
        return item.id;
      });

      // Add consumption
      await ItemConsumption.create({
          quantity: payload.quantity,
          consumer: 'DamagedItem',
          consumer_id: damagedRecord,
          item_id: item.item_id
        },
        {
          transaction,
          user,
          resourceId: 'consumption_id'
        });

      if (item.category.toLowerCase() === 'egg' && payload?.damageType.toLowerCase() === 'crack') {
        const crackEgg = await Item.findOne({
          where: {item_id: 4},
          transaction
        });

        await ItemInventory.create({
          quantity: payload.quantity,
          price: crackEgg.price,
          item_id: crackEgg.item_id,
          producer: 'DamagedItem',
          producer_id: damagedRecord
        }, {
          transaction,
          user,
          resourceId: 'id'
        });
      }

      if (!trnx) await transaction.commit();

      return damagedRecord;
    } catch (error) {
      debug.error('Add damaged item', error);
      await transaction.rollback();
      return {
        error: 'Unable to process request. Please try again later!',
        status: 500
      };
    }
  }

  async deleteDamagedItemById(user, id, trnx) {
    const transaction = trnx || await sequelize.transaction();

    const damagedItem = await DamagedItems.findOne({
      where: { id },
      transaction
    });

    if (!damagedItem) {
      return {
        error: `No damaged item found with id ${id}`,
        status: 400
      };
    }

    const item = await Item.findOne({
      where: { item_id: damagedItem.item_id },
      transaction
    });

    // Reverse crack eggs
    if (item.category.toLowerCase() === 'egg' && damagedItem.damage_type.toLowerCase() === 'crack') {
      const crackEgg = await Item.findOne({
        where: { item_id: 4 },
        transaction
      });

      // remove from crack eggs
      await crackEgg.decrement('quantity', {
        by: Number(damagedItem.quantity),
        where: { item_id: crackEgg.item_id },
        transaction,
        user,
        resourceId: 'item_id'
      });

      // remove inventory
      await ItemInventory.destroy({
        where: {
          producer: 'DamagedItem',
          producer_id: id
        }
      }, {
        transaction,
        user,
        resourceId: 'id'
      });
    }

    // Reverse item
    await Item.increment('quantity', {
      by: Number(damagedItem.quantity),
      where: { item_id: damagedItem.item_id },
      transaction,
      user,
      resourceId: 'item_id'
    });

    // remove inventory
    await ItemConsumption.destroy({
      where: {
        consumer: 'DamagedItem',
        consumer_id: id
      }
    }, {
      transaction,
      user,
      resourceId: 'consumption_id'
    });

    // Delete record
    return DamagedItems.destroy({
      where: {
        id
      },
      transaction
    })
      .then(async () => {
         if (!trnx) await transaction.commit();
         return { message: 'Item deleted' };
      });
  }
}

module.exports = new Controller();
