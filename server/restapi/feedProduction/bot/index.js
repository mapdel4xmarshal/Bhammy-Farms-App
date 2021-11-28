const client = require('../../../whatsapp');
const FeedProduction = require('./FeedProduction');
const controller = require('../controllers');
const {
  Item,
  Sequelize: { Op }
} = require('../../../models');
const Debug = require('../../../utilities/debugger');

const debug = new Debug('FeedProduction:BotV2');

class FeedProductionBot {
  constructor() {
    this._corrections = {
      lavaside: ['lavacide'],
      maize: ['corn'],
      'toxin binder': ['toxin-binder', 'Toxin-binda', 'Toxin binder'],
      wheatoffal: ['Wheat offer', 'Wheat offal', 'weat offer', 'wheat'],
      'choline chloride': ['Chlorine chloride', 'Chlorine-chloride', 'Choline-Chloride'],
      'vital layer': ['Vita layer', 'Vital-layer', 'vita-layer'],
      'vital grower': ['Vita grower', 'Vital-grower', 'vita-grower'],
      bag: ['bags'],
      layer: ['layers'],
      grower: ['growers'],
      tonne: ['tonnes', 'tonne', 'ton', 'tons'],
      concentrate: ['concentrates']
    };
  }

  listen() {
    client.on('message', async (payload) => {
      if (await this.filterPayload(payload)) {
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

  async addFeedRecord(payload) {
    const message = this.autoCorrect(payload.body.toLowerCase());

    if (this.validatePayload(message)) {
      debug.info('Record received from whatsapp', message);
      try {
        const items = await this.getMatchingItems();
        const stamp = this.generateStamp(payload);

        await new FeedProduction(message, items, stamp, controller)
          .insert()
          .then((res) => {
            debug.info('Add FeedProduction - success', res);
            payload.reply(`*${res.count} RECORD ADDED* 👍\n*ID:* ${res.ids
              .join(' | ')}\n*Cost/Bag:* ₦${res.costs.join(' | ₦')}`);
          });
      } catch (e) {
        debug.error('INSERT ERROR', e);
        payload.reply(`*An Error Occurred*\n${e.message || e.error}`);
      }
    }
  }

  async deleteFeedRecord(payload) {
    const message = this.autoCorrect(payload.body.toLowerCase());
    if (this.validatePayload(message)) {
      debug.info('Delete Record received from whatsapp', message);

      try {
        const stamp = this.generateStamp(payload);

        new FeedProduction(message, [], stamp, controller).delete()
          .then((info) => {
            if (!info.error) {
              payload.reply('*RECORD DELETED!*👍');
            }
            debug.info('RECORD DELETED', info);
          });
      } catch (e) {
        debug.error('DELETING ERROR', e);
        payload.reply(`*ERROR*\n${e.message || e.error}`);
      }
    }
  }

  async filterPayload(msg) {
    const chat = await msg.getChat();
    return chat.isGroup && (chat.name === 'Bhammy Farms - Feed Mill' || (chat.name.includes('Feed')
      && chat.name.includes('Bhammy')));
  }

  validatePayload(message) {
    return /(\d{1,2})([\/-])(\d{1,2})\2(\d{2,4})/.test(message)
      && ['maize', 'type'].every((term) => message.includes(term))
      && /layer|grower|concentrate/i.test(message)
      && /quantity|tonne/i.test(message);
  }

  autoCorrect(message) {
    let correctedMsg = message;
    for (const correction in this._corrections) {
      const subRegex = this._corrections[correction].join('|');
      const regex = new RegExp(`\\b(?:${subRegex})\\b`, 'ig');

      correctedMsg = correctedMsg.replace(regex, correction);

      // add space between letter, digit and '('
      correctedMsg = correctedMsg.replace(/[a-z](?=\d)|\d(?=[a-z])|[a-z](?=\()|\d(?=\()/gi, '$& ');
    }

    debug.info('autoCorrect', correctedMsg);

    return correctedMsg;
  }

  getMatchingItems() {
    return Item.findAll({
      attributes: ['item_id', 'item_name', 'category', 'packaging_metric', 'unit', 'packaging_size', 'is_produced'],
      where: {
        category: {
          [Op.in]: ['concentrate', 'feed', 'feed ingredient', 'feed additive']
        }
      },
      raw: true
    })
      .then((items) => new Map(items
        .map((item) => [item.item_name.toLowerCase(), {...item, item_name: item.item_name.toLowerCase()}])));
  }

  generateStamp(payload) {
    return `${payload.from.split('@')[0]}::${payload.timestamp}::${payload.body}`;
  }
}

module.exports = FeedProductionBot;
