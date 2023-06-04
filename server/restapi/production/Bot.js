const client = require('../../whatsapp');
const {
  Item,
  Batch,
  Production,
  Sequelize: { Op }
} = require('../../models');
const { isEmpty } = require('../../utilities/common');
const Debug = require('../../utilities/debugger');

const debug = new Debug('Production:Bot');

class Bot {
  constructor(controllers) {
    this._controllers = controllers;

    this._excludedKeywords = ['Production', 'Total mor', 'Egg production', 'Wastage'];
    this._corrections = {
      'Large Egg': ['Large size', 'Large'],
      'Extra Large Egg': ['ExtraLarge', 'Jumbo', 'Extra Large'],
      'Medium Egg': ['Medium size', 'Medium'],
      'Pullet Egg': ['Pullet size', 'Pullet', 'Pullets'],
      'Cracked Egg': ['Cracks', 'crack'],
      'Small Egg': ['Small', 'small'],
      water: ['Water consumed'],
      'Vitamin - Miavit': ['vitamin (miavit)'],
      compounded: ['local'],
      layer: ['layers'],
      feed: ['Feed consumed', 'consumed'],
      'production total': ['Egg Production'],
      'Production%': ['%Egg production']
    };

    this._user = {
      id: 'WhatsApp Bot',
      displayName: 'WhatsApp Bot - Group Message'
    };

    this.requiredItems = ['Water', 'Feed'];
  }

  listen() {
    client.on('message', async (payload) => {
      if (await this.filterPayload(payload)) {
        debug.info('Record received from whatsapp', payload);
        await this.addProductionRecord(payload);
      }
    });

    client.on('message_revoke_everyone', async (payload, previousPayload) => {
      if (await this.filterPayload(payload)) {
        debug.info('Record deleted from whatsapp', previousPayload);
        await this.deleteProductionRecord(previousPayload);
      }
    });
  }

  async filterPayload(msg) {
    const chat = await msg.chat;
    return chat.isGroup
      && (chat.name === 'Bhammy Farms - Production'
        || (chat.name.includes('Production') && chat.name.includes('Bhammy'))
        || chat.name === 'Bhammy Farms - Brooding'
        || (chat.name.includes('Brooding') && chat.name.includes('Bhammy')));
  }

  async addProductionRecord(payload) {
    try {
      let { body } = payload;

      if (this.isBroodingRecord(body)) {
        body = this.broodingToProductionRecord(body);
      }

      body = this.autoCorrect(body.toLowerCase());

      const bodyArray = body.split('\n');

      if (this.isValidPayload(body)) {
        let record = this.parsePayload(bodyArray);

        debug.info('Corrected payload', record);

        record = await this.generateRecord(record, this.generateStamp(payload));

        debug.info('Production record', record);

        const res = await this._controllers.addProduction(this._user, record);

        if (res.error) {
          throw { msg: res.message || res.error };
        } else {
          debug.info('AddProduction - success', res);
          payload.reply('*RECORD ADDED* 👍');
        }
      }
    } catch (e) {
      debug.error('Bot', e);
      let message = 'Error, please revalidate record!';

      if (e.msg) message += `\n*REASON:* ${e.msg}`;
      payload.reply(message);
    }
  }

  broodingToProductionRecord(msg) {
    return `${msg.replace('Report on Brooding Record', '')
      .replace(/([-]){3,}.*?\1/g, '')
      .replace(/\n\n/g, '')
      .replace(/Date\. {5}=/ig, ' ')
      .replace(/(Feed\.)/ig, 'Feed')
      .replace(/(water\.)/ig, 'water')
      .replace(/(Drug\.|Drug)/ig, 'Medication')}\nbrooding=A`;
  }

  isBroodingRecord(msg) {
    const string = msg.toLowerCase();
    return /(\d{1,2})([\/-])(\d{1,2})\2(\d{2,4})/.test(string)
      && ['date', 'feed', 'water'].every((term) => string.includes(term))
      && /brooding|large|feed|drug|mortality/ig.test(string)
      && !(/pen/.test(string));
  }

  generateStamp(payload) {
    return `${payload.from.split('@')[0]}::${payload.timestamp}::${payload.body}`;
  }

  parsePayload(payloadArray) {
    const record = {
      batchId: null,
      date: null,
      note: '',
      water: null,
      eggs: [],
      feeds: [],
      mortality: [],
      medications: [],
      vaccinations: []
    };

    payloadArray.forEach((item) => {
      if (item.includes('=')) {
        const itemArr = item.split('=');
        const name = itemArr[0].trim()
          .replace('.', '');
        const quantity = itemArr[1].trim();

        if (!isEmpty(quantity)) {
          if (name.includes('pen')) {
            record.batchName = quantity.toLowerCase().includes('brooding') ? 'BROODING-A'
              : `PEN-${quantity}`.toUpperCase();
          }

          if (name.includes('brooding')) {
            record.batchName = `BROODING-${quantity}`.toUpperCase();
          }

          // Include water
          if (name.includes('water')) {
            record.water = quantity.replace(/[a-z]/i, '');
          }

          // Add eggs
          if (name.includes('Egg')) {
            let eggQuantity = quantity.replace(/crates|crate/g, '');

            if (quantity.indexOf('piece') > -1) {
              const breakDown = quantity.split(/(\d+)/).filter(Boolean);

              if (breakDown.length === 2) {
                eggQuantity = +breakDown[0];
              } else {
                eggQuantity = +breakDown[0] * 30 + (+breakDown[2] || 0);
              }
            } else {
              const qty = eggQuantity.split('.');
              eggQuantity = (qty[0] * 30) + (+qty[1] || 0);
            }

            record.eggs.push({
              id: null,
              name,
              quantity: eggQuantity
            });
          }

          // Add feeds
          if (name.toLowerCase()
            .startsWith('feed')) {
            const feeds = quantity.split(/,|and/);
            feeds.forEach((feed) => {
              const feedData = feed.trim()
                .split(/(\d+)/)
                .filter(Boolean);

              let qty;
              let type;

              if (feed.includes('.')) {
                qty = Number(`${feedData[0].trim()}.${feedData[2].trim()}`);
                type = feedData[3].trim();
              } else {
                qty = feedData[0].trim();
                type = feedData[1].trim();
              }

              if (type.includes(' feed')) {
                type = type.replace(' feed', '');
              }

              if (type === 'compounded layer'
              /* || ['vital', 'compounded', 'layer'].every((keyword) => type.includes(keyword)) */) {
                type = 'layer mash (compounded)';
              }

              if (type === 'compounded grower'
              /* || ['vital', 'compounded', 'grower'].every((keyword) => type.includes(keyword)) */) {
                type = 'grower mash (compounded)';
              }

              record.feeds.push({
                id: null,
                name: type,
                quantity: qty * 25
              });
            });
          }

          // Add mortality
          if (name.includes('mortality')) {
            const mortality = quantity.split(',');
            mortality.forEach((mort) => {
              mort = mort.trim();
              const mortData = mort.split(/(\d+)/)
                .filter(Boolean);
              record.mortality.push({
                time: new Date().toTimeString()
                  .split(' ')[0],
                reason: 'other',
                count: mortData[0],
                description: mort
              });
            });
          }

          // Add medication
          if (name.includes('medication')) {
            const medications = quantity.split(',');

            medications.forEach((medication) => {
              medication = medication.trim();
              const medicament = medication.split(/(\d+)/)
                .filter(Boolean);

              record.medications.push({
                medicament: { id: null },
                name: medicament[0].replace(/\(|\)/, '')
                  .trim(),
                totalDosage: medicament[1],
                dosageUnit: null,
                administeredBy: 'Unknown',
                reason: ''
              });
            });
          }

          // Add vaccination
          if (name.includes('vaccination')) {
            const vaccinations = quantity.split(',');

            vaccinations.forEach((vaccination) => {
              vaccination = vaccination.trim();
              const vaccines = vaccination.split(/(\d+)/)
                .filter(Boolean);

              record.vaccinations.push({
                vaccine: { id: null },
                name: vaccines[0].replace(/\(|\)/, '')
                  .trim(),
                totalDosage: vaccines[1],
                dosageUnit: null,
                administeredBy: 'Unknown',
                reason: ''
              });
            });
          }
        }
      } else {
        const date = item.match(/(\d{1,2})([\/-])(\d{1,2})\2(\d{2,4})/g);

        if (date) {
          const dateArray = date[0].split('/');

          record.date = new Date(`${dateArray[1]}-${dateArray[0]}-${dateArray[2]}`).toISOString();
        }
      }
    });

    return record;
  }

  async generateRecord(record, stamp) {
    const productionRecord = { ...record };

    productionRecord.batchId = await this.processBatch(record.batchName);
    productionRecord.eggs = await this.processEggs(record.eggs);
    productionRecord.feeds = await this.processFeeds(record.feeds);
    productionRecord.medications = await this.processMedications(record.medications);
    productionRecord.vaccinations = await this.processVaccinations(record.vaccinations);
    productionRecord.stamp = stamp;

    return productionRecord;
  }

  async processBatch(batch) {
    const activeBatch = await Batch.findOne({
      where: {
        name: {
          [Op.like]: `${batch}%`
        },
        is_active: 1
      },
      order: [['move_in_date', 'DESC']],
      limit: 1
    });

    if (activeBatch) {
      return activeBatch.batch_id;
    }
    throw { msg: `The Pen specified, ${batch} does not exist.` };
  }

  async processEggs(eggs) {
    if (eggs.length === 0) {
      eggs.push({
        name: 'Pullet Egg',
        quantity: 0
      });
    }

    const eggItems = await Item.findAll({
      where: {
        category: 'Egg'
      }
    });

    const eggItemsMap = new Map(eggItems.map((item) => [item.item_name, item]));
    return eggs.map((egg) => {
      if (eggItemsMap.has(egg.name)) {
        egg.id = eggItemsMap.get(egg.name).item_id;
        return egg;
      }
      throw { msg: `Unknown egg type, ${egg.name}` };
    });
  }

  async processFeeds(feeds) {
    const feedItems = await Item.findAll({
      where: {
        category: 'feed'
      }
    });

    return feeds.map((feed) => {
      let matchingFeeds = feedItems.filter((mFeed) => mFeed.item_name.toLowerCase() === feed.name);

      if (matchingFeeds.length === 0) {
        matchingFeeds = feedItems.filter((feedItem) => feed.name.split(' ')
          .every((keyword) => feedItem.item_name.toLowerCase()
            .indexOf(keyword) !== -1));
      }

      if (matchingFeeds.length === 0) {
        throw { msg: `Unknown feed type, '${feed.name}'` };
      } else if (matchingFeeds.length === 1) {
        feed.id = matchingFeeds[0].item_id;
        feed.name = matchingFeeds[0].item_name;
      } else {
        throw {
          msg: `Multiple feeds matches the name '${feed.name}', please be more specific.
        \nPossible options are ${matchingFeeds.map((mFeed) => mFeed.item_name)
    .join(',')}`
        };
      }
      return feed;
    });
  }

  async processMedications(medications) {
    const medicamentItems = await Item.findAll({
      where: {
        category: 'Medicament'
      }
    });

    return medications.map((medicament) => {
      const matchingMedicament = medicamentItems.filter((medicamentItem) => medicament.name.split(' ')
        .every((keyword) => medicamentItem.item_name.toLowerCase()
          .indexOf(keyword) !== -1));

      if (matchingMedicament.length === 0) {
        throw { msg: `Unknown medicament type, '${medicament.name}'` };
      } else if (matchingMedicament.length === 1) {
        medicament.medicament.id = matchingMedicament[0].item_id;
        medicament.name = matchingMedicament[0].item_name;
      } else {
        throw { msg: `Multiple medicament matches the name '${medicament.name}', please be more specific.` };
      }
      return medicament;
    });
  }

  async processVaccinations(vaccinations) {
    const vaccineItems = await Item.findAll({
      where: {
        category: 'vaccine'
      }
    });

    return vaccinations.map((vaccine) => {
      const matchingVaccines = vaccineItems.filter((medicamentItem) => vaccine.name.split(' ')
        .every((keyword) => medicamentItem.item_name.toLowerCase()
          .indexOf(keyword) !== -1));

      if (matchingVaccines.length === 0) {
        throw { msg: `Unknown vaccine type, '${vaccine.name}'` };
      } else if (matchingVaccines.length === 1) {
        vaccine.vaccine.id = matchingVaccines[0].item_id;
        vaccine.name = matchingVaccines[0].item_name;
      } else {
        throw { msg: `Multiple medicament matches the name '${vaccine.name}', please be more specific.` };
      }
      return vaccine;
    });
  }

  isValidPayload(string) {
    return /(\d{1,2})([\/-])(\d{1,2})\2(\d{2,4})/.test(string)
      && (
        ['pen', 'feed', 'water'].every((term) => string.includes(term))
        || ['brooding', 'feed', 'water'].every((term) => string.includes(term))
        || ['pen', 'date', 'feed', 'age of bird', 'stock of bird'].every((term) => string.includes(term))
      )
      && /mortality|Large|medium|pullet|crack|jumbo/.test(string);
  }

  autoCorrect(payload) {
    payload = payload.replace(/Date( )*=/i, '')
      .replace(new RegExp(`^.*(${this._excludedKeywords.join('|')}).*$`, 'img'), '');

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

  async deleteProductionRecord(prevPayload) {
    const stamp = this.generateStamp(prevPayload);

    let { body } = prevPayload;

    body = this.autoCorrect(body.toLowerCase());

    if (this.isValidPayload(body)) {
      const records = await Production.findAll({
        attributes: ['production_id', 'stamp'],
        where: {
          stamp
        }
      });

      records.forEach((record) => {
        this._controllers.deleteProduction(record.production_id, this._user)
          .then(() => {
            prevPayload.reply('*RECORD DELETED!*👍');
          });
      });
    }
  }
}

module.exports = Bot;
