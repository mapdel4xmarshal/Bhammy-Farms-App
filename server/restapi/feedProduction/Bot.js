const client = require('../../whatsapp');
const {
  Item,
  Sequelize: { Op }
} = require('../../models');
const { isEmpty } = require('../../utilities/common');
const Debug = require('../../utilities/debugger');
const debug = new Debug('FeedProduction:Bot');

class Bot {
  constructor(controllers) {
    this._controllers = controllers;
    client.on('feedProduction', (payload) => {
      debug.info('Record received from whatapp app', payload);
      this.handleEvent(payload);
    });

    this._excludedKeywords = ['Tonne'];
    this._corrections = {
      Lavaside: ['Lavacide'],
      Maize: ['Corn'],
      'Toxin Binder': ['Toxin-binder', 'Toxin-binda'],
      WheatOffal: ['Wheat offer', 'Wheat offal', 'WheatOffal', 'weat offer', 'wheat'],
      'Choline Chloride': ['Chlorine chloride', 'Chlorine-chloride', 'Choline-Chloride'],
      'Layer Concentrate 30% - Vita': ['Concentrate'],
      bag: ['bags', 'Bag']
    };
  }

  handleEvent(payload) {
    this.parsePayload(payload.body);
  }

  async parsePayload(payload) {
    payload = this.autoCorrect(payload);

    console.log(payload);

    const payloadArray = payload.split('\n');

    if (this.isValidPayload(payloadArray[0])) {
      const record = { ingredients: [] };

      payloadArray.forEach((item) => {
        if (item.includes('=')) {
          const itemArr = item.split('=');
          const name = itemArr[0].trim();
          const quantity = itemArr[1].trim();

          if (!this._excludedKeywords.includes(name) && !isEmpty(quantity)) {
            record.ingredients.push({
              name,
              quantity
            });
          }
        } else {
          const date = item.match(/(\d{1,2})([\/-])(\d{1,2})\2(\d{2,4})/g);
          const type = item.match(/layer|grower/g);

          record.date = date[0];
          record.type = type[0];
        }
      });

      const matchingItems = await this.getMatchingItems(record.ingredients);

      record.ingredients.map((ingredient) => {
        const item = matchingItems.get(ingredient.name);
        const regex = new RegExp(`\\b(?:${item.packaging_metric})\\b`, 'gi');

        if (regex.test(ingredient.quantity)) {
           ingredient.quantity = +(ingredient.quantity.split(item.packaging_metric)[0]) * item.packaging_size;
        } else if (new RegExp(`\\b(?:${item.unit})\\b`, 'gi').test(ingredient.quantity)) {
           ingredient.quantity = +(ingredient.quantity.split(item.unit)[0]);
        } else {
          debug.info('No match', item.unit, regex, ingredient.quantity)
        }
      });

      console.log('record', record);
    }
  }

  isValidPayload(string) {
    return /(\d{1,2})([\/-])(\d{1,2})\2(\d{2,4})/.test(string)
      && ['pen', 'feed'].every(term => string.includes(term))
      && /layer|grower/.test(string);
  }

  autoCorrect(payload) {
    for (const correction in this._corrections) {
      const subRegex = this._corrections[correction].join('|');
      const regex = new RegExp(`\\b(?:${subRegex})\\b`, 'gi'); console.log('regex', regex);
      payload = payload.replace(regex, correction);

      // add space between letter, digit and '('
      payload = payload.replace(/[a-z](?=\d)|\d(?=[a-z])|[a-z](?=\()|\d(?=\()/gi, '$& ');
    }

    return payload;
  }

  createFeedRecord(record) {
    console.log(items);

    const maize = record.items.filter((item) => item.name.include(/maize|corn/g))[0] || {};

    const normalizedRecord = {
      date: record.date,
      type: record.type,
      energy_level: this.energyLevel(maize.quantity),
      note: 'Whatsapp Bot',
      ingredients: record.items
    };

    this._controllers.addProduction({
      id: 'WhatsApp Bot',
      displayName: 'WhatsApp Bot - Group Message'
    }, normalizedRecord);
  }

  energyLevel(quantity) {
    if (quantity >= 500) {
      return 'high';
    } else if (quantity >= 450) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  async getMatchingItems(ingredients) {
    const itemPriceMap = await Item.findAll({
      attributes: ['item_id', 'item_name', 'category', 'packaging_metric', 'unit', 'packaging_size'],
      where: {
        item_name: {
          [Op.in]: ingredients.map((item) => item.name)
        }
      }
    })
      .then((items) => new Map(items.map((item) => [item.item_name, item])));

    // console.log('ingre---', itemPriceMap);
    return itemPriceMap;
  }

  deleteFeedRecord() {

  }
}

module.exports = Bot;
