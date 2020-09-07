class ProductionSummary {
  constructor(properties) {
    this._production = {};
    this._production.id = properties.id;
    this._production.batch = properties.batch;
    this._production.date = properties.date;
    this._production.humidity = properties.humidity;
    this._production.temperature = properties.temperature;
    this._production.weatherCondition = properties.weatherCondition;
    this._production.water = properties.water;
    this._production.note = properties.note;
    this._production.batch = properties.batch;
    this._production.type = properties.batchType;
    this._production.status = properties.isActive === 1 ? 'Active' : 'Retired';
    this._production.flockCount = properties.flockCount;
    this._production.initialPopulation = properties.initialFlockCount;

    properties.items = Array.from(properties.items.values());
    properties.mortality = Array.from(properties.mortality.values());

    this.vaccinations = properties.vaccinations;
    this.medications = properties.medications;
    this.mortality = properties.mortality;

    this.eggs = properties.items.filter((item) => item.category.toLowerCase() === 'egg');
    this.feeds = properties.items.filter((item) => item.category.toLowerCase() === 'feed');
    this.feedPerAnimal = this.feeds;
    this.productionPercent = this.eggs;
    this.mortalityRate = this.mortality;
    this.profit = properties.items;

    return this._production;
  }

  get vaccinations() {
    return this._production.vaccinations;
  }

  set vaccinations(vaccinations) {
    this._production.vaccinations = vaccinations.map((vaccination) => ({
      id: vaccination.vaccination_id,
      vaccineBatchNo: vaccination.vaccine_batch_no,
      dosage: vaccination.dosage,
      dosageUnit: vaccination.dosage_unit,
      totalDosage: vaccination.total_dosage,
      noOfBirds: vaccination.no_of_birds,
      vaccinationMethod: vaccination.method,
      administeredBy: vaccination.administered_by,
      reason: vaccination.notes,
      vaccineId: vaccination.vaccine_id
    }));
  }

  get medications() {
    return this._production.medications;
  }

  set medications(medications) {
    this._production.medications = medications.map((medication) => ({
      id: medication.medication_id,
      medicamentBatchNo: medication.medicament_batch_no,
      dosage: medication.dosage,
      dosageUnit: medication.dosage_unit,
      totalDosage: medication.total_dosage,
      noOfBirds: medication.no_of_birds,
      vaccinationMethod: medication.method,
      administeredBy: medication.administered_by,
      reason: medication.notes,
      medicamentId: medication.medicament_id
    }));
  }

  get mortality() {
    return this._production.mortality;
  }

  set mortality(mortality) {
    this._production.mortality = mortality
      .reduce((totalMortality, mortality) => totalMortality + Number.parseInt(mortality.count), 0) || 0;
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
  }

  get eggs() {
    return this._production.eggs;
  }

  set eggs(eggs) {
    this._production.eggs = eggs.reduce((totalEggs, egg) => totalEggs + Number.parseInt(egg.quantity), 0);
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
    this._production.profit = items.reduce((total, item) => {
      if (item.category.toLowerCase() === 'feed') return total - ((item.quantity / item.size) * item.price);
      if (item.category.toLowerCase() === 'egg') return total + ((item.quantity / 30 ) * item.price);
      return 0;
    }, 0);
  }
}

module.exports = ProductionSummary;
