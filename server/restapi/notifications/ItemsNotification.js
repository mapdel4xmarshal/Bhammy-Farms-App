const { Item } = require('../../models');
const client = require('../../whatsapp');
const Debug = require('../../utilities/debugger');

const debug = new Debug('Notifications::Item');

class ItemsNotification {
  constructor(transaction) {
    this.GROUP_NAME = 'Bhammy Farms - Oloko';
    this._items = [];
    this._transaction = transaction;
  }

  _getItems(arrayFormat = false) {
    return Item.findAll({
      attributes: [
        ['item_id', 'id'], ['item_name', 'name'], 'quantity', ['packaging_size', 'packagingSize'],
        'unit', ['packaging_metric', 'packagingMetric'],
        ['notification', 'enableNotification'], ['min_stock_level', 'minimumStock'],
        ['reorder_level', 'restockLevel']
      ],
      where: {
        notification: true
      },
      raw: true,
      ...(this._transaction && { transaction: this._transaction })
    }).then((items) => (arrayFormat ? items : new Map(items.map((item) => [item.id, item]))));
  }

  async snapshot() {
    this._items = await this._getItems();
  }

  _getGroupByName(groupName) {
    return client.getChats()
      .then((chats) => {
        return chats.find((chat) => chat.isGroup && (chat.name === groupName));
      });
  }

  _minStockMessage(item) {
    return `‼️ *${item.name}* is ridiculously low! The quantity remaining is ${item.quantity}${item.unit
    }. Please restock immediately!`;
  }

  _restockMessage(item) {
    return `⚠️Restock *${item.name}*. The quantity remaining is *${item.quantity}${item.unit}*.`;
  }

  async _sendNotification(message) {
    const groupId = await this._getGroupByName(this.GROUP_NAME);
    return client.sendMessage(groupId.groupMetadata.id._serialized, message);
  }

  async notify() {
    const newItems = await this._getItems(true);

    newItems.forEach((item) => {
      if (this._items.has(item.id)) {
        const nItem = this._items.has(item.id);
        if (+nItem.quantity !== +item.quantity) {
          if (+item.quantity <= +item.restockLevel) {
            debug.info('RESTOCK ITEM', nItem);
            this._sendNotification(this._restockMessage(item));
          }
          if (+item.quantity <= +item.minimumStock) {
            debug.info('MIN STOCK ITEM', nItem);
            this._sendNotification(this._minStockMessage(item));
          }
        }
      }
    });
  }
}

module.exports = ItemsNotification;
