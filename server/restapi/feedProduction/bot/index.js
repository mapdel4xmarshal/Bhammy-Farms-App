const client = require('../../../whatsapp');
const FeedProduction = require('./FeedProduction');
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
      quantity: ['qty', 'tonnes', 'tonne', 'ton', 'tons']
    };

    this.requestHandler({
      body: 'Date=20/11/2021\n' +
        'Type=Prelay | Layer | Grower\n' +
        'Maize=235kg\n' +
        'Wheatoffal=2.8kg\n' +
        'Lime=1\n' +
        'Soya=10\n' +
        'Chlorine cloride=\n' +
        'Toxin binder=.75kg\n' +
        'Tonne|Quantity=.5\n' +
        'Concentrate=Chikun layer 5bags\n' +
        'Concentrate=Hendrix layer 5bags\n' +
        'Chikun Layer Concentrate=5bags\n' +
        'Concentrate=(3bags chikun layers & 3kg chikun grower)\n' +
        'Concentrate=(3kg chikun layers, 3bag chikun grower)\n' +
        '\n' +
        'Date=20/11/2021\n' +
        'Type=Prelay | Layer | Grower\n' +
        'Maize=235kg\n' +
        'Wheatoffal=2.8kg\n' +
        'Lime=1\n' +
        'Soya=10\n' +
        'Chlorine cloride=\n' +
        '  Toxin binder=.75kg\n' +
        'Tonne|Quantity=.5\n' +
        'Concentrate=Chikun layer 5bags\n' +
        'Concentrate=Hendrix layer 5bags\n' +
        'Chikun Layer Concentrate=5bags\n' +
        'Concentrate=(3bags chikun layers & 3kg chikun grower)\n' +
        'Concentrate=(3kg chikun layers, 3bag chikun grower)\n'
    }).catch(console.error);
  }

  listen() {
    client.on('message', async (payload) => {
      if (await this.filterPayload(payload)) {
        await this.requestHandler(payload);
      }
    });
  }


  async requestHandler(payload) {
    // const message = this.autoCorrect(payload.body.toLowerCase());
                                          console.log(payload)
    if (this.validatePayload(message)) {
      debug.info('Record received from whatsapp', message);
      try {
        await new FeedProduction(payload, message);//.insert();
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
    let correctedMsg;
    for (const correction in this._corrections) {
      const subRegex = this._corrections[correction].join('|');
      const regex = new RegExp(`\\b(?:${subRegex})\\b`, 'gi');
      correctedMsg = message.replace(regex, correction);

      // add space between letter, digit and '('
      correctedMsg = correctedMsg.replace(/[a-z](?=\d)|\d(?=[a-z])|[a-z](?=\()|\d(?=\()/gi, '$& ');
    }

    debug.info('autoCorrect', correctedMsg);

    return correctedMsg;
  }
}

new FeedProductionBot();
