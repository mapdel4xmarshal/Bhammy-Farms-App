const client = require('../../whatsapp');
const {
  Item,
  FeedProduction,
  Sequelize: { Op }
} = require('../../models');
const { isEmpty } = require('../../utilities/common');
const Debug = require('../../utilities/debugger');

const debug = new Debug('FeedProduction:Bot');

class Bot {
  constructor(controllers) {
    this._controllers = controllers;

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

    this._user = {
      id: 'WhatsApp Bot',
      displayName: 'WhatsApp Bot - Group Message'
    };

    this.requiredIngredients = ['Maize', 'Toxin Binder', 'WheatOffal', 'Layer Concentrate 30% - Vita'];

    this.feedTypes = {
      layer: 'Layer mash (Compounded)',
      grower: 'Grower mash (Compounded)'
    };
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
        await this.deleteFeedRecord(previousPayload);
      }
    });

    this.addInvoiceRecord();
  }

  async filterPayload(msg) {
    const chat = await msg.getChat();
    return chat.isGroup && (chat.name === 'BHAMMY FARMS - SALES' || (chat.name.includes('Sales')
      && chat.name.includes('Bhammy')));
  }

  async addInvoiceRecord(payload) {
    payload = {
      body: '19/07/21\n' +
        'Stock=64\n' +
        'L=4\n' +
        'M=54.5\n' +
        'P=6\n' +
        'C=\n' +
        '\n' +
        'Production=256\n' +
        'L=25\n' +
        'M=176\n' +
        'P=53\n' +
        'C=1.5\n' +
        '\n' +
        '\n' +
        'Total=320.5\n' +
        'L=29\n' +
        'M=231\n' +
        'P=59\n' +
        'C=1.5\n' +
        '\n' +
        'Sold=320\n' +
        'L=29\n' +
        'M=230\n' +
        'P=59\n' +
        'C=2\n' +
        '\n' +
        '\n' +
        'Crack=\n' +
        'M=15pieces\n' +
        '\n' +
        '\n' +
        '\n' +
        'Wastage\n' +
        'M=15 pieces\n' +
        '\n' +
        '\n' +
        '\n' +
        'Balanc=\n' +
        'L=\n' +
        'M=\n' +
        'P=\n' +
        'C=\n' +
        '\n' +
        '\n' +
        'Iya mercy\n' +
        'L=20x1400=28,000\n' +
        'M=80x1300=104,000\n' +
        'P=30x1100=33,000\n' +
        'Total=165,000\n' +
        '\n' +
        '\n' +
        '\n' +
        'Alhaja Afon\n' +
        'M=60x1300=78,000\n' +
        'Total=78,000\n' +
        '\n' +
        '\n' +
        'Foga\n' +
        'M=15x1300=19,500\n' +
        'P=6x1100=6,600\n' +
        'Total=26,100\n' +
        '\n' +
        '\n' +
        'Alasinrin\n' +
        'M=44x1300=57,200\n' +
        'P=6x1100=6,600\n' +
        'Total=63,800\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        'M=15x1300=19,500\n' +
        'Total=19,500\n' +
        '\n' +
        '\n' +
        'Utility\n' +
        'L=4x1400=5,600\n' +
        'M=1x1300=1,300\n' +
        'P=6x1100=6,600\n' +
        'Total=12,200\n' +
        '\n' +
        '\n' +
        'Esther\n' +
        'L=1x1400=1,400\n' +
        'M=14x1300=18,200\n' +
        'Total=19,600\n' +
        '\n' +
        '\n' +
        '\n' +
        'Mama staff\n' +
        'M=1x1300=1,300\n' +
        'P=5x1100=5,500\n' +
        'C=2x950=1,900\n' +
        'Total=8,700\n' +
        '\n' +
        '\n' +
        'P=1x1100=1100\n' +
        'C=1x950=950\n' +
        'Total=2,050\n' +
        '\n' +
        '\n' +
        'P=5x1100=5,500\n' +
        'L=1x1400=1,400\n' +
        'Total=6,900'
    };
    try {
      let { body } = payload;

      const bodyArray = body.split('\n');

      if (this.isValidPayload(bodyArray[0])) {
        const record = this.parsePayload(bodyArray);
        const matchingItems = await this.getMatchingItems(record.type, record.ingredients);

        record.ingredients = this.processIngredients(record.ingredients, matchingItems);

        this.requiredIngredients.forEach((ingredient) => {
          if (record.ingredients.filter((ingrdnt) => ingrdnt.name === ingredient).length === 0) {
            throw { msg: `'${ingredient}' is required!` };
          }
        });

        this.createFeedRecord(matchingItems.get(record.type).item_id, record, this.generateStamp(payload))
          .then((res) => {
            debug.info('Add FeedProduction - success', res);
            payload.reply('*RECORD ADDED* 👍');
          })
          .catch(debug.error);
      }
    } catch (e) {
      debug.error('Bot', e);
      let message = 'Error, please revalidate record!';

      if (e.msg) message += `\n*REASON:* ${e.msg}`;
      payload.reply(message);
    }
  }

  generateStamp(payload) {
    return `${payload.from.split('@')[0]}::${payload.timestamp}::${payload.body}`;
  }

  parsePayload(payloadArray) {
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

        if (date) {
          const type = item.match(/layer|grower/g);
          const dateArray = date[0].split('/');

          record.date = new Date(`${dateArray[1]}-${dateArray[0]}-${dateArray[2]}`).toISOString();
          record.type = this.feedTypes[type[0]];
        }
      }
    });

    return record;
  }

  processIngredients(ingredients, matchingItems) {
    return ingredients.map((ingredient) => {
      const item = matchingItems.get(ingredient.name);
      const regex = new RegExp(`\\b(?:${item.packaging_metric})\\b`, 'gi');

      if (regex.test(ingredient.quantity)) {
        ingredient.quantity = +(ingredient.quantity.split(item.packaging_metric)[0]) * item.packaging_size;
        ingredient.id = item.item_id;
      } else if (new RegExp(`\\b(?:${item.unit})\\b`, 'gi').test(ingredient.quantity)) {
        ingredient.quantity = +(ingredient.quantity.split(item.unit)[0]);
        ingredient.id = item.item_id;
      } else {
        debug.info('No match', item.unit, regex, ingredient.quantity);
      }

      return ingredient;
    });
  }

  isValidPayload(string) {
    string = string.toLowerCase();
    return /(\d{1,2})([\/-])(\d{1,2})\2(\d{2,4})/.test(string)
      && ['production', 'total', 'balanc'].every((term) => string.includes(term))
      && /sold|L=|M=|P=/.test(string);
  }

  createFeedRecord(id, record, stamp) {
    const maize = record.ingredients.filter((ingredient) => ingredient.name.indexOf(/maize|corn/g) !== -1)[0] || {};

    const normalizedRecord = {
      date: record.date,
      type: {
        name: record.type,
        id
      },
      energyLevel: this.energyLevel(maize.quantity),
      comment: 'WhatsAppBot',
      stamp,
      ingredients: record.ingredients
    };

    debug.info('createFeedRecord - normalizedRecord', normalizedRecord);

    return this._controllers.addProduction(this._user, normalizedRecord);
  }

  energyLevel(quantity) {
    if (quantity >= 500) {
      return 'high';
    } if (quantity >= 450) {
      return 'medium';
    }
    return 'low';
  }

  async getMatchingItems(feedType, ingredients) {
    const itemPriceMap = await Item.findAll({
      attributes: ['item_id', 'item_name', 'category', 'packaging_metric', 'unit', 'packaging_size'],
      where: {
        item_name: {
          [Op.in]: [...ingredients.map((item) => item.name), feedType]
        }
      }
    })
      .then((items) => new Map(items.map((item) => [item.item_name, item])));

    return itemPriceMap;
  }

  async deleteFeedRecord(prevPayload) {
    const stamp = this.generateStamp(prevPayload);
    const bodyArray = prevPayload.body.split('\n');

    if (this.isValidPayload(bodyArray[0])) {
      const records = await FeedProduction.findAll({
        attributes: ['id', 'stamp'],
        where: {
          stamp
        }
      });

      records.forEach((record) => {
        this._controllers.deleteProduction(record.id, this._user)
          .then(() => {
            prevPayload.reply('*RECORD DELETED!*👍');
          });
      });
    }
  }
}

module.exports = Bot;
