const client = require('../../whatsapp');
const {
  Item,
  Invoice,
  DamagedItems,
  Party,
  Customer,
  Sequelize: {
    Op,
    where,
    fn,
    col
  }
} = require('../../models');
const {
  isEmpty,
  dateRegex
} = require('../../utilities/common');
const Debug = require('../../utilities/debugger');

const debug = new Debug('FeedProduction:Bot');

class Bot {
  constructor(controllers) {
    this._controllers = controllers;

    this._user = {
      id: 'WhatsApp Bot',
      displayName: 'WhatsApp Bot - Group Message'
    };

    this.farmLocation = '84a519f5-09c1-4c57-83c8-f0e2cc773c3c';
    this.defaultCustomer = 17;
  }

  listen() {
    client.on('message', async (payload) => {
      if (await this.filterPayload(payload)) {
        debug.info('Record received from whatsapp', payload);
        await this.addInvoiceRecord(payload);
      }
    });

    client.on('message_revoke_everyone', async (payload, previousPayload) => {
      if (await this.filterPayload(payload)) {
        debug.info('Record deleted from whatsapp', previousPayload);
        await this.deleteRecord(previousPayload);
      }
    });
  }

  async filterPayload(msg) {
    const chat = await msg.getChat();
    return chat.isGroup && (chat.name === 'BHAMMY FARMS - SALES' || (chat.name.includes('Sales')
      && chat.name.includes('Bhammy')));
  }

  async addInvoiceRecord(payload) {
    try {
      let { body } = payload;

      if (this.isValidPayload(body)) {
        const record = await this.parsePayload(payload);
        debug.info('record', record);
        this._controllers.addInvoices(this._user, record.sales, record.damagedItems)
          .then(() => {
            payload.reply('*RECORD ADDED* 👍');
            debug.info('addInvoices::', 'record added successfully.');
          })
          .catch(e => {
            throw e;
          });
      }
    } catch (e) {
      debug.error('Bot Error::', e);
      let message = 'Error, please revalidate record!';

      if (e.msg) message += `\n*REASON:* ${e.msg}`;
      payload.reply(message);
    }
  }

  /**
   * Generates a stamp
   * @param payload
   * @returns {string}
   */
  generateStamp(payload) {
    return `${payload.from.split('@')[0]}::${payload.timestamp}::${payload.body}`;
  }

  /**
   * parsePayload
   * @param payload
   * @returns {Promise<{sales: *[]}>}
   */
  async parsePayload(payload) {
    const sections = payload.body.replace(dateRegex, '$&\n')
      .split(/\n\n/)
      .filter(Boolean);

    const record = {
      date: null,
      sales: [],
      damagedItems: []
    };

    const stamp = this.generateStamp(payload);

    const items = await Item.findAll({
      attributes: ['item_name', 'item_id', 'unit', 'packaging_metric', 'packaging_size', 'price'],
      where: {
        category: where(fn('LOWER', col('category')), '=', 'EGG')
      }
    });

    for (const section of sections) {
      if (dateRegex.test(section)) {
        record.date = this.processDate(section);
      } else if (/Stock=/i.test(section)) {
        record.stock = this.processEggRecord(section, items);
      } else if (/production/i.test(section)) {
        record.production = this.processEggRecord(section, items);
      } else if (/^(\ntotal|total)/i.test(section)) {
        record.total = this.processEggRecord(section, items);
      } else if (/sold/i.test(section)) {
        record.sold = this.processEggRecord(section, items);
      } else if (/crack/i.test(section)) {
        if (!/crate|piece/i.test(section)) {
          throw { msg: 'Please specify either *crate* or *pieces* for items in the Crack section' };
        }
        record.crack = this.processEggRecord(section, items);
        record.damagedItems.push(...this.processDamagedItems('crack', record.crack, record.date, stamp));
      } else if (/wastage/i.test(section)) {
        if (!/crate|piece/i.test(section)) {
          throw { msg: 'Please specify either *crate* or *pieces* for items in the wastage section' };
        }
        record.wastage = this.processEggRecord(section, items);
        record.damagedItems.push(...this.processDamagedItems('wastage', record.wastage, record.date, stamp));
      } else if (/balanc/i.test(section)) {
        record.balance = this.processEggRecord(section, items);
      } else {
        record.sales.push(await this.processSales(record.date, section, items, stamp));
      }
    }

    return record;
  }

  /**
   * processDate
   * @param date
   * @returns {string}
   */
  processDate(date) {
    const dateArray = date.split('/');
    return new Date(`${dateArray[1]}-${dateArray[0]}-${dateArray[2]}`).toISOString();
  }

  /**
   * processDamagedItems
   * @param type
   * @param items
   * @param date
   * @param stamp
   * @returns {*}
   */
  processDamagedItems(type, items, date, stamp) {
    return items.map((item) => ({
      ...item,
      itemId: item.id,
      date,
      damageType: type,
      location: this.farmLocation,
      stamp
    }));
  }

  /**
   * processSales
   * @param date
   * @param sale
   * @param items
   * @param stamp
   * @returns {{fulfilmentStatus: string, notes: string, customerId, farmLocation: string, invoiceDate, paymentDate, items: *[], paymentStatus: string}}
   */
  async processSales(date, sale, items, stamp) {
    const sections = sale.split('\n')
      .filter(Boolean);
    if (/L=|M=|C=|P=|X=/i.test(sections[0])) sections.unshift('Unknown');

    return {
      customerId: await this.getCustomerIdByName(sections[0]),
      invoiceDate: date,
      paymentDate: date,
      paymentStatus: 'paid',
      fulfilmentStatus: 'fulfilled',
      farmLocation: this.farmLocation,
      items: this.processEggRecord(sections.join('\n'), items),
      notes: sections[0],
      stamp
    };
  }

  /**
   * processEggRecord
   * @param record
   * @param items
   * @returns {*[]}
   */
  processEggRecord(record, items) {
    const recordArray = record.split('\n');
    recordArray.shift();

    const eggs = [];

    recordArray.forEach(egg => {
      const sanitizedEgg = egg.replace(/ /g, '');

      if (/^(l=|m=|p=|c=|x=)/ig.test(sanitizedEgg)) {
        const match = sanitizedEgg.split('=');
        const item = this.findMatchedItem(match[0], items);

        if (isEmpty(item)) {
          throw `Unknown item ${match[0]} found in ${record}`;
        }

        if (!isEmpty(match[1])) {
          const quantity = this.processQuantity(match[1], item);
          const amount = this.processAmount(match[1]);
          const packageQuantity = quantity / item.packaging_size;

          eggs.push({
            id: item.item_id,
            name: item.item_name,
            price: item.price,
            ...(quantity && { quantity }),
            ...(amount && { amount: amount * packageQuantity }),
            ...((/x|\*/i.test(match[1])) && { discount: this.processDiscount(match[1].replace(',', ''), amount, item, packageQuantity) })
          });
        }
      }
    });
    return eggs;
  }

  async getCustomerIdByName(name) {
    const customer = await Customer.findOne({
      include: [{
        required: true,
        model: Party,
        where: {
          name: where(fn('LOWER', col('name')), 'LIKE', `${name.toLowerCase()}%`)
        }
      }]
    });

    return customer?.customer_id || this.defaultCustomer;
  }

  /**
   * findMatchedItem
   * @param searchWord
   * @param items
   * @returns {*}
   */
  findMatchedItem(searchWord, items) {
    return items.filter(item => new RegExp(`${searchWord}`, 'ig').test(item.item_name))[0];
  }

  /**
   * processDiscount
   * @param info
   * @param amount
   * @param matchingItem
   * @param quantity
   * @returns {number}
   */
  processDiscount(info, amount, matchingItem, quantity) {
    const discount = (+matchingItem.price - amount) * quantity;

    if (amount > +matchingItem.price) {
      throw { msg: `The price of '${matchingItem.item_name}' is ${matchingItem.price}, but ${amount} was specified.` };
    }

    return discount;
  }

  processAmount(info) {
    return +info.replace(',', '').split('=')[0].split(/x|\*/i)[1];
  }

  /**
   * processQuantity
   * @param quantity
   * @param matchingItem
   * @returns {number}
   */
  processQuantity(quantity, matchingItem) {
    quantity = quantity.replace('pieces', 'piece')
      .replace('crates', 'crate');
    const regex = new RegExp(`${matchingItem.packaging_metric}`, 'gi');

    if (regex.test(quantity)) {
      quantity = +(quantity.split(matchingItem.packaging_metric)[0]) * matchingItem.packaging_size;
    } else if (new RegExp(`${matchingItem.unit}`, 'gi').test(quantity)) {
      const qty = quantity.split(matchingItem.unit)[0];
      const qtySplit = qty.split('.');

      if (qtySplit.length > 1) {
        quantity = (+(qtySplit[0]) * matchingItem.packaging_size) + Number(qtySplit[1]);
      } else {
        quantity = +qty;
      }
    } else if (/x|\*/i.test(quantity)) {
      const qty = quantity.split(/x|\*/i);
      if (isEmpty(qty[0])) throw { msg: `Validation error at *${quantity}*. Please provide the quantity sold.` };
      quantity = +qty[0] * matchingItem.packaging_size;
    } else {
      quantity = +(quantity) * matchingItem.packaging_size;
    }

    return quantity;
  }

  /**
   * isValidPayload
   * @param string
   * @returns {boolean}
   */
  isValidPayload(string) {
    string = string.toLowerCase();
    return /(\d{1,2})([\/-])(\d{1,2})\2(\d{2,4})/.test(string)
      && ['production', 'total', 'balanc'].every((term) => string.includes(term))
      && /sold|L=|M=|P=|C=|X=/i.test(string);
  }

  async deleteRecord(prevPayload) {
    const stamp = this.generateStamp(prevPayload);

    if (this.isValidPayload(prevPayload.body)) {
      let invoices = await Invoice.findAll({
        attributes: ['invoice_id'],
        where: {
          stamp
        }
      });

      if (invoices.length > 0) {
        let damagedItems = await DamagedItems.findAll({
          attributes: ['id'],
          where: {
            stamp
          }
        });

        invoices = invoices.map((invoice) => invoice.invoice_id);
        damagedItems = damagedItems.map((damagedItem) => damagedItem.id);

        this._controllers.deleteInvoicesById(this._user, invoices, damagedItems)
          .then(() => {
            prevPayload.reply('*RECORD DELETED!*👍');
          });
      }
    }
  }
}

module.exports = Bot;
