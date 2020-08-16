class ProductionSummary {
  constructor(properties) {
    console.log(properties);
    this._production = {};
    this._production.id = properties.production_id;
    this._production.batchId = properties.batch_id;
    this._production.date = properties.date;
    this._production.humidity = properties.humidity;
    this._production.temperature = properties.temperature;
    this._production.weatherCondition = properties.weatherCondition;
    this._production.water = properties.water;
    this._production.note = properties.note;
    this._production.batch_id = properties.batchId;
    this.batch = properties.Batch;

    this.vaccinations = properties.Vaccinations;
    this.medications = properties.Medications;
    this.mortalities = properties.Mortalities;
    this.eggs = properties.Items.filter((item) => item.category.toLowerCase() === 'egg');
    this.feeds = properties.Items.filter((item) => item.category.toLowerCase() === 'feed');

    return this._production;
  }

  get batch() {
    return this._production.batch;
  }

  set batch(batch) {
    this._production.batch = {
      id: batch.batchId,
      batch: batch.batch,
      status: batch.isActive === 1 ? 'Active' : 'Retired',
      type: batch.batchType
    };
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

  get mortalities() {
    return this._production.mortalities;
  }

  set mortalities(mortalities) {
    this._production.mortalities = mortalities.reduce((totalMortality, mortality) => totalMortality + Number.parseInt(mortality.count), 0);
  }


  get feeds() {
    return this._production.feeds;
  }

  set feeds(feeds) {
    this._production.feeds = feeds.reduce((totalFeed, feed) => totalFeed + Number.parseInt(feed.ProductionItem.quantity), 0);
  }

  get eggs() {
    return this._production.eggs;
  }

  set eggs(eggs) {
    this._production.eggs = eggs.reduce((totalEggs, egg) => totalEggs + Number.parseInt(egg.ProductionItem.quantity), 0);
  }
}

module.exports = ProductionSummary;
