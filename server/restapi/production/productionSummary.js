const expectances = require('./expectancy');

class ProductionSummary {
  constructor(properties) {
    this._production = {};
    this._production.id = properties.id;
    this._production.batch = properties.batch;
    this._production.date = properties.date;
    this._production.humidity = properties.humidity;
    this._production.temperature = properties.temperature;
    this._production.weatherCondition = properties.weatherCondition;
    this._production.water = Number(properties.water);
    this._production.note = properties.note;
    this._production.batch = properties.batch;
    this._production.type = properties.batchType;
    this._production.status = properties.isActive === 1 ? 'Active' : 'Retired';
    this._production.flockCount = properties.flockCount;
    this._production.initialPopulation = properties.initialFlockCount;
    this._production.climateEffect = this.climateEffect;
    this._production.batchAge = properties.batchAge;
    this._production.cumulativeMortality = properties.cumulativeMortality;
    this._production.profit = 0;

    properties.items = Array.from(properties.items.values());
    properties.vaccinations = Array.from(properties.vaccinations.values());
    properties.medications = Array.from(properties.medications.values());

    this.vaccinations = properties.vaccinations;
    this.medications = properties.medications;
    this.mortality = properties.mortality;

    this.eggs = properties.items.filter((item) => item.category.toLowerCase() === 'egg');
    this.feeds = properties.items.filter((item) => item.category.toLowerCase() === 'feed');
    this.feedPerAnimal = this.feeds;
    this.productionPercent = this.eggs;
    this.mortalityRate = this.mortality;
    this.profit = properties.items;
    this.expectancy = properties.batchAge;

    return this._production;
  }

  get vaccinations() {
    return this._production.vaccinations;
  }

  set vaccinations(vaccinations) {
    this._production.vaccinations = vaccinations.map((vaccination) => ({
      id: vaccination.vaccinationId,
      vaccineBatchNo: vaccination.vaccineBatchNo,
      dosage: vaccination.dosage,
      dosageUnit: vaccination.dosageUnit,
      totalDosage: vaccination.totalDosage,
      vaccinationMethod: vaccination.vaccinationMethod,
      administeredBy: vaccination.administrator,
      reason: vaccination.note,
      vaccineId: vaccination.vaccineId,
      noOfBirds: vaccination.noOfBirds,
      thumbnail: vaccination.thumbnail
    }));

    this._production.profit += Number.parseInt(vaccinations.reduce((total, item) => total - item.cost, 0));
  }

  get medications() {
    return this._production.medications;
  }

  set medications(medications) {
    this._production.medications = medications.map((medication) => ({
      id: medication.medicationId,
      medicamentBatchNo: medication.batchNo,
      dosage: medication.dosage,
      dosageUnit: medication.dosageUnit,
      totalDosage: medication.totalDosage,
      noOfBirds: medication.noOfBirds,
      medicationMethod: medication.medicationMethod,
      administeredBy: medication.administrator,
      reason: medication.notes,
      medicamentId: medication.medicamentId
    }));

    this._production.profit += Number.parseInt(medications.reduce((total, item) => total - item.cost, 0));
  }

  get mortality() {
    return this._production.mortality;
  }

  set mortality(mortality) {
    this._production.mortality = Number.parseInt(mortality) || 0;
  }

  get mortalityRate() {
    return this._production.mortalityRate;
  }

  set mortalityRate(mortality) {
    this._production.mortalityRate = Number(((mortality * 100) / this._production.flockCount).toFixed(2));
  }

  get feeds() {
    return this._production.feeds;
  }

  set feeds(feeds) {
    this._production.feeds = feeds.reduce((totalFeed, feed) => totalFeed + Number.parseInt(feed.quantity), 0);
    this._production.feedPackagingSize = feeds[0].packagingSize;
    this._production.feedTypes = feeds.map(({
      id, name, quantity, productionItemsId
    }) => ({
      id, name, quantity, productionItemsId
    }));
  }

  get eggs() {
    return this._production.eggs;
  }

  set eggs(eggs) {
    if (eggs.length > 0) {
      this._production.eggs = eggs.reduce((totalEggs, egg) => totalEggs + Number.parseInt(egg.quantity), 0);
      this._production.eggPackagingSize = eggs[0].packagingSize;
      this._production.eggTypes = eggs.map(({ id, name, quantity }) => ({ id, name, quantity }));
    }
  }

  get feedPerAnimal() {
    return this._production.feedPerAnimal;
  }

  set feedPerAnimal(feeds) {
    this._production.feedPerAnimal = Number(((feeds / this._production.flockCount) * 1000).toFixed(2));
  }

  get productionPercent() {
    return this._production.productionPercent;
  }

  set productionPercent(eggs) {
    this._production.productionPercent = Number(((eggs * 100) / this._production.flockCount).toFixed(2));
  }

  get profit() {
    return this._production.profit;
  }

  set profit(items) {
    this._production.profit += Number.parseInt(items.reduce((total, item) => {
      if (item.category.toLowerCase() === 'feed') return total - ((item.quantity / item.packagingSize) * item.price);
      if (item.category.toLowerCase() === 'egg') return total + ((item.quantity / item.packagingSize) * item.price);
      return 0;
    }, 0));
  }

  get climateEffect() {
    const climateEffect = {
      effect: '',
      description: ''
    };
    const { temperature } = this._production;

    if (Number.isNaN(temperature) || temperature === null) {
      climateEffect.effect = null;
      climateEffect.description = null;
    } else if (temperature < 11) {
      climateEffect.effect = 'Fair';
      climateEffect.description = 'Bad production. Possible reduction in feed intake and egg produced.';
    } else if (temperature > 11 && temperature <= 26) {
      climateEffect.effect = 'Excellent';
      climateEffect.description = 'Excellent production climate.';
    } else if (temperature > 26 && temperature <= 28) {
      climateEffect.effect = 'Good';
      climateEffect.description = 'Some reduction in feed intake. Heat prostration sets in, measures to cool the house must be taken.';
    } else if (temperature > 28 && temperature <= 32) {
      climateEffect.effect = 'Fair';
      climateEffect.description = 'Feed consumption reduced and water intake increased; eggs of reduced size and thin shell. Heat prostration sets in, measures to cool the house must be taken.';
    } else if (temperature > 32 && temperature <= 35) {
      climateEffect.effect = 'Bad';
      climateEffect.description = 'Slight panting. Heat prostration sets in, measures to cool the house must be taken.';
    } else {
      climateEffect.effect = 'Worse';
      climateEffect.description = 'Mortality due to heat stress.';
    }
    return climateEffect;
  }

  get expectancy() {
    return this._production.expectancy;
  }

  set expectancy(age) {
    age = Math.ceil(Number(age) / 7);
    this._production.expectancy = expectances[age] || expectances[expectances.length - 1];
  }
}

module.exports = ProductionSummary;
