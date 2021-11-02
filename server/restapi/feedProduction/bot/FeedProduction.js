const Debug = require('debug');
const { isEmpty } = require('../../../utilities/common');
const { Item } = require('../../models');
const debug = new Debug('FeedProduction:BotV2:FeedProduction');

class FeedProduction {
  constructor(context, message) {
    this._context = context;
    this._user = {
      id: 'WhatsApp Bot v2',
      displayName: 'WhatsApp Bot - Group Message'
    };
    this._excludedKeywords = [];
    this._rawRecords = message.split('\n\n');
    this._requiredIngredients = ['Maize', 'Toxin Binder', 'WheatOffal', 'Concentrate'];

    console.log('kkkk', this._rawRecords);
    debug('Received payload ::', message);
  }

  get _rawRecords() {
    return this._raw;
  }

  set _rawRecords(messages) {
    this._raw = messages.map((message) => {
      const record = {
        ingredients: [],
        energyLevel: '',
        comment: this._user.displayName
      };

      message.split('\n')
        .forEach((item) => {
          // Parse date
          if (item.match(/(\d{1,2})([\/-])(\d{1,2})\2(\d{2,4})/g)) {
            const keyValue = item.split('=');
            const dateArray = (keyValue[1] || keyValue[0]).trim()
              .split('/');
            record.date = new Date(`${dateArray[1]}-${dateArray[0]}-${dateArray[2]}`).toISOString();
          } else if (item.match(/type/ig)) {
            record.type = item.split(/type|=/ig)
              .filter(Boolean)[0].trim();
          } else if (item.match(/quantity/ig)) {
            record.quantity = item.split(/quantity|=/ig)
              .filter(Boolean)[0].trim();
          } else if (item.includes('=')) {
            const [name, quantity] = item.split('=');
            if (!isEmpty(quantity) && !this._excludedKeywords.includes(name)) {
              record.ingredients.push({
                name,
                quantity
              });
            }
          }
        });

      debug('_rawRecord ', record);
      return record;
    });
  }

  parseMessage() {
    for (const rawRecord of this._rawRecords) {

    }
  }

  async getMatchingItems(feedType, ingredients) {
    return await Item.findAll({
      attributes: ['item_id', 'item_name', 'category', 'packaging_metric', 'unit', 'packaging_size'],
      where: {
        category: {
          [Op.in]: [...ingredients.map((item) => item.name), feedType, ...Object.values(this._concentrates)]
        }
      }
    })
      .then((items) => new Map(items.map((item) => [item.item_name.toLowerCase(), item])));
  }

  insert() {

    this._requiredIngredients.forEach((ingredient) => {
      if (record.ingredients.filter((ingrdnt) => ingrdnt.name.toLowerCase() === ingredient.toLowerCase()).length === 0) {
        throw { msg: `'${ingredient}' is required!` };
      }
    });
  }

}

module.exports = FeedProduction;
