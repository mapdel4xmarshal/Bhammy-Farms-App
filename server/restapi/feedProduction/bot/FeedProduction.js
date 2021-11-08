const Debug = require('../../../utilities/debugger');
const {isEmpty} = require('../../../utilities/common');
const {sequelize} = require('../../../models');

const debug = new Debug('FeedProduction:BotV2:FeedProduction');

class FeedProduction {
  constructor(message, matchingItems, stamp, controller) {
    this._stamp = stamp;
    this._matchingItems = matchingItems;
    this._controller = controller;
    this._user = {
      id: 'WhatsApp Bot v2',
      displayName: 'WhatsApp Bot - Group Message'
    };
    this._excludedKeywords = [];
    this._rawRecords = message.split('\n\n');
    this._requiredIngredients = ['Maize', 'Toxin Binder', 'WheatOffal', 'Concentrate'];
    this.records = [];

    debug.info('Received message ::', message);
    debug.info('Received matchingItems ::', matchingItems);
  }

  get _rawRecords() {
    return this._raw;
  }

  set _rawRecords(messages) {
    this._raw = messages.map((message) => {
      const record = {
        ingredients: [],
        energyLevel: '',
        comment: this._user.displayName,
        stamp: this._stamp
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

            if (!record.type.includes('mash')) record.type += ' mash';
          } else if (item.match(/quantity/ig)) {
            record.quantity = item.split(/quantity|=/ig)
              .filter(Boolean)[0].trim();
          } else if (item.includes('=')) {
            const [name, quantity] = item.split('=').map((_item) => _item.trim());

            if (!isEmpty(quantity) && !this._excludedKeywords.includes(name)) {
              record.ingredients.push({
                name,
                quantity
              });
            }
          }
        });

      debug.info('_rawRecord ', record);
      return record;
    });
  }

  enforceRequiredIngredients(ingredients) {
    this._requiredIngredients.forEach((reqIngredient) => {
      if (!ingredients.find((ingredient) => ingredient.name === reqIngredient.toLowerCase()
        || (reqIngredient.toLowerCase() === 'concentrate' && ingredient.name.includes('concentrate')))) {
        throw new Error(`*${reqIngredient}* is required! Please revalidate the record and try again.`);
      }
    });
  }

  determineBrands(type, ingredients) {
    const concentrates = ingredients.filter((ingredient) => ingredient.name.match(/concentrate/ig))
      .map((concentrate) => concentrate.name
        .split(/grower[s]?|layer[s]?|prelay[s]?|pre-lay[s]?|concentrate[s]?/)
        .map((s) => s.trim())
        .filter(Boolean).join(',')).filter(Boolean);

    debug.info('concentrates', concentrates);

    return Array.from(new Set(concentrates).values());
  }

  determineType(record) {
    const matchingItems = Array.from(this._matchingItems.values())
      .filter((item) => item.is_produced && record.type.split(' ').every((word) => item.item_name.includes(word)));

    // Match type
    if (matchingItems.length === 1) {
      record.type = {name: matchingItems[0].item_name, id: matchingItems[0].item_id};
    } else if (matchingItems.length === 0) {
      throw new Error(`Unknown feed type *${record.type}*.
      Please check for spelling mistakes or contact @08073290177 for assistant.`);
    } else {
      throw new Error(`Multiple items matches *${record.type}*. Please be more specific.
    \nPossible options are ${matchingItems.map((mItem) => mItem.item_name).join(', ')}`);
    }
  }

  calculateEnergyLevel(record) {
    // Process quantity unit
    const [qty, unit] = record.quantity.split(' ').filter(Boolean);
    if (unit !== 'kg' && unit !== 'tonne') {
      throw new Error('Please provide a valid unit for *Quantity*. Quantity is measured in *kg* or *tonnes*.');
    }

    record.quantity = {
      quantity: +qty.trim() * (unit === 'tonne' ? 1000 : 1),
      unit: unit && unit.trim()
    };

    const maize = record.ingredients.find((ingredient) => ingredient.name.match(/maize|corn/ig));
    const kg = record.ingredients.reduce((total, ingredient) => total + ingredient.quantity, 0);
    const quantity = Math.round(maize.quantity / (kg / 1000));

    if (kg !== +record.quantity.quantity) {
      throw new Error(`Quantity mismatch! Total feed produced is ${kg / 1000} tonnes (${kg
      }kg), but you recorded ${qty}${record.quantity.unit}(s)`);
    }

    if (+quantity >= 500) {
      record.energyLevel = 'high';
    } else if (+quantity >= 450) {
      record.energyLevel = 'medium';
    } else record.energyLevel = 'low';
  }

  processIngredient(ingredient) {
    let matchingItems = this._matchingItems.get(ingredient.name);

    if (!matchingItems) {
      debug.info(`processIngredient:: ${ingredient.name}, no direct match`);
      matchingItems = Array.from(this._matchingItems.values()).filter((item) => {
        return ingredient.name.split(' ').every((word) => item.item_name.includes(word));
      });
    } else matchingItems = [matchingItems];

    // Match ingredient
    if (matchingItems.length === 1) {
      const item = matchingItems[0];

      ingredient.name = item.item_name;
      ingredient.id = item.item_id;

      // Process quantity and validate unit
      const regex = new RegExp(`\\b(?:${item.packaging_metric})\\b`, 'gi');

      if (regex.test(ingredient.unit)) {
        ingredient.quantity = +(ingredient.quantity) * item.packaging_size;
      } else if (new RegExp(`\\b(?:${item.unit})\\b`, 'gi').test(ingredient.unit)) {
        ingredient.quantity = +ingredient.quantity;
      } else {
        debug.info('No matching unit', item.unit, regex, ingredient.quantity);
        throw new Error(`Please specify a valid unit (${item.packaging_metric} or ${item.unit}) for *${ingredient.name}*.`);
      }
    } else if (matchingItems.length === 0) {
      throw new Error(`Unknown item *${ingredient.name
      }*.\nPlease check for spelling mistakes or contact @2348073290177 for assistant.`);
    } else {
      throw new Error(`Multiple items matches *${ingredient.name}*. Please be more specific.
    \nPossible options are ${matchingItems.map((mItem) => mItem.item_name).join(', ')}`);
    }
  }

  processRecord() {
    for (const rawRecord of this._rawRecords) {
      const record = {...rawRecord};
      this.enforceRequiredIngredients(rawRecord.ingredients);
      const concentrateBrands = this.determineBrands(rawRecord.type, rawRecord.ingredients);

      if (concentrateBrands.length === 0) {
        throw new Error('No concentrate brand specified!'
          + '\nPossible options are Vital layer, Vital grower, Chikun layer, Hendirx etc');
      } else if (concentrateBrands.length === 1) {
        record.type = `${concentrateBrands[0]} ${record.type}`;
      }

      // Process ingredient unit
      record.ingredients = rawRecord.ingredients.map((ingredient) => {
        const [quantity, unit] = ingredient.quantity.split(' ').filter(Boolean);

        if (!unit) {
          throw new Error(`No unit provided for *${ingredient.name}*. Please provide one.`);
        }

        ingredient.quantity = +quantity.trim();
        ingredient.unit = unit && unit.trim();

        this.processIngredient(ingredient);

        return ingredient;
      });

      this.determineType(record);
      this.calculateEnergyLevel(record);
      this.records.push(record);
    }
    return this.records;
  }

  async insert() {
    this.processRecord();
    console.log(this.records[0], this.records[1]);
    const transaction = await sequelize.transaction();

    const executions = this.records.map((record) => {
      return this._controller.addProduction(this._user, record, transaction);
    });

    return Promise.all(executions).then(async (results) => {
      debug.info('Insert Results', results);
      await transaction.commit();
      const production = await this._controller.getProductions({stamp: this._stamp});

      return {
        count: results.length,
        ids: results.map((result) => result.id),
        costs: production.records.map((record) => (+record.summary.costPerUnit * 25) + 50)
      };
    });
  }

  async delete() {
    return this._controller.deleteProduction({stamp: this._stamp}, this._user);
  }
}

module.exports = FeedProduction;
