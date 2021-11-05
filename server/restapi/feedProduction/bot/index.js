const client = require('../../../whatsapp');
const FeedProduction = require('./FeedProduction');
const Debug = require('../../../utilities/debugger');
const debug = new Debug('FeedProduction:BotV2');
const {
  Item,
  Sequelize: {Op}
} = require('../../../models');

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
        await this.requestHandler(payload);
      }
    });
  }

  async requestHandler(payload) {
    const message = this.autoCorrect(payload.body.toLowerCase());

    if (this.validatePayload(message)) {
      debug.info('Record received from whatsapp', message);
      try {
        const items = await this.getMatchingItems();

        new FeedProduction(message, items).insert();
      } catch (e) {
        debug.error('Bot', e);
        console.error(e);
        // payload.reply(`*Unknown error occurred*\n${e}`);
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
      && ['date', 'maize'].every((term) => message.includes(term))
      && /type|layer|grower|concentrate/i.test(message);
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
}

new FeedProductionBot().requestHandler({
  body: 'Date=20/11/2021\n' +
    'Type=layer\n' +
    'Maize=235kg\n' +
    'Wheatoffal=2.8kg\n' +
    'Chlorine cloride=\n' +
    'Toxin binder=0.75kg\n' +
    'Quantity=363.55 kg\n' +
    'Chikun Layers Concentrates=5bags\n' +
    '\n' +
    'Date=20/11/2021\n' +
    'Type=Prelay\n' +
    'Maize=235kg\n' +
    'Wheatoffal=2.8kg\n' +
    'Chlorine cloride=\n' +
    '  Toxin binder=.75kg\n' +
    'Quantity=0.48855 tonnes\n' +
    'Vital Layer Concentrate=5bags\n'+
    'vital grower Concentrate=5bags\n'
});

module.exports = FeedProductionBot;
