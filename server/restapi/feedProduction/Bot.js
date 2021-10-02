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
      'Layer Mash (Vital)': ['Vital layer', 'Vita layer', 'Vital-layer', 'vita-layer'],
      'Grower Mash (Vital)': ['Vital Grower', 'Vita grower', 'Vital-grower', 'vita-grower'],
      bag: ['bags', 'Bag']
    };

    this._concentrates = {
      'vital-layer': 'Layer Concentrate 30% - Vital',
      'vital-grower': 'Grower Concentrate 30% - Vital',
      'chikun-grower': 'Chikun Grower Concentrate',
      'chikun-layer': 'Chikun Layer Concentrate'
    };

    this._user = {
      id: 'WhatsApp Bot',
      displayName: 'WhatsApp Bot - Group Message'
    };

    this.requiredIngredients = ['Maize', 'Toxin Binder', 'WheatOffal', 'Concentrate'];

    this.feedTypes = {
      layer: 'Layer mash (Compounded)',
      grower: 'Grower mash (Compounded)'
    };
  }

  listen() {
    client.on('message', async (payload) => {
      if (await this.filterPayload(payload)) {
        debug.info('Record received from whatsapp', payload);
        await this.addFeedRecord(payload);
      }
    });

    client.on('message_revoke_everyone', async (payload, previousPayload) => {
      if (await this.filterPayload(payload)) {
        debug.info('Record deleted from whatsapp', previousPayload);
        await this.deleteFeedRecord(previousPayload);
      }
    });
  }

  async filterPayload(msg) {
    const chat = await msg.getChat();
    return chat.isGroup && (chat.name === 'Bhammy Farms - Feed Mill' || (chat.name.includes('Feed')
      && chat.name.includes('Bhammy')));
  }

  async addFeedRecord(payload) {
    try {
      let { body } = payload;

      body = this.autoCorrect(body);

      const bodyArray = body.split('\n');

      if (this.isValidPayload(bodyArray[0])) {
        const record = this.parsePayload(bodyArray);
        const matchingItems = await this.getMatchingItems(record.type, record.ingredients);

        this.requiredIngredients.forEach((ingredient) => {
          if (record.ingredients.filter((ingrdnt) => ingrdnt.name === ingredient).length === 0) {
            throw { msg: `'${ingredient}' is required!` };
          }
        });

        record.ingredients = this.processIngredients(record.concentrateBrand, record.ingredients, matchingItems);

        debug.info('Record', record);

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
          const type = item.match(/layer|grower/ig);
          const concentrateBrand = item.match(/chikun|vital/ig) || ['vital'];
          const dateArray = date[0].split('/');

          debug.info('parse payload', { type, concentrateBrand });

          record.date = new Date(`${dateArray[1]}-${dateArray[0]}-${dateArray[2]}`).toISOString();
          const feedType = type[0].toLowerCase();
          record.type = this.feedTypes[feedType];
          record.concentrateBrand = this._concentrates[`${concentrateBrand[0].toLowerCase()}-${feedType}`];
        }
      }
    });

    return record;
  }

  processIngredients(concentrateBrand, ingredients, matchingItems) {
    return ingredients.map((ingredient) => {
      if (/concentrate/ig.test(ingredient.name)) {
        ingredient.name = concentrateBrand;
        debug.info('ingredient name ', concentrateBrand);
        debug.info('ingredient', ingredient);
        debug.info('matchingItems', matchingItems);
      }

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
      && ['feed'].every((term) => string.includes(term))
      && /layer|grower/i.test(string);
  }

  autoCorrect(payload) {
    for (const correction in this._corrections) {
      const subRegex = this._corrections[correction].join('|');
      const regex = new RegExp(`\\b(?:${subRegex})\\b`, 'gi');
      payload = payload.replace(regex, correction);

      // add space between letter, digit and '('
      payload = payload.replace(/[a-z](?=\d)|\d(?=[a-z])|[a-z](?=\()|\d(?=\()/gi, '$& ');
    }

    debug.info('autoCorrect', payload);

    return payload;
  }

  createFeedRecord(id, record, stamp) {
    const maize = record.ingredients.find((ingredient) => ingredient.name.match(/Maize|corn/ig));
    const tonne = record.ingredients.reduce((total, ingredient) => total + ingredient.quantity, 0);

    const normalizedRecord = {
      date: record.date,
      type: {
        name: record.type,
        id
      },
      energyLevel: this.energyLevel(Math.round(maize.quantity / (tonne / 1000))),
      comment: 'WhatsAppBot',
      stamp,
      ingredients: record.ingredients
    };

    debug.info('createFeedRecord - normalizedRecord', normalizedRecord);

    return this._controllers.addProduction(this._user, normalizedRecord);
  }

  energyLevel(quantity) {
    if (+quantity >= 500) {
      return 'high';
    } if (+quantity >= 450) {
      return 'medium';
    }
    return 'low';
  }

  async getMatchingItems(feedType, ingredients) {
    return await Item.findAll({
      attributes: ['item_id', 'item_name', 'category', 'packaging_metric', 'unit', 'packaging_size'],
      where: {
        item_name: {
          [Op.in]: [...ingredients.map((item) => item.name), feedType, ...Object.values(this._concentrates)]
        }
      }
    })
      .then((items) => new Map(items.map((item) => [item.item_name, item])));
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
