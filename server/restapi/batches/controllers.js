const {
  Batch, Breed, House, Production, Mortality, Location, Source, Party, Sequelize: {
    Op, literal, fn, col
  }, sequelize, ProductionItems
} = require('../../models');

class Controller {
  async getBatches({ house, batch }) {
    let where = {};
    if (house) where = { house_id: house };
    if (batch) where = { batch_id: batch };

    return Batch.findAll({
      where,
      attributes: [
        'name', ['batch_id', 'batchId'], 'name', ['house_id', 'houseId'], [literal('House.name'), 'house'],
        [col('`House->location`.name'), 'farm'],
        [fn('date_format', col('move_in_date'), '%Y-%m-%d'), 'moveInDate'],
        [fn('date_format', col('move_out_date'), '%Y-%m-%d'), 'moveOutDate'],
        ['move_in_age', 'moveInAge'], [literal('DATEDIFF(NOW(), move_in_date) + move_in_age'), 'currentAge'],
        [literal('Breed.name'), 'breed'], [literal('Breed.type'), 'category'], ['initial_stock_count', 'initialStock'],
        [literal('initial_stock_count - "Productions->Mortalities.count"'), 'currentStock'], ['supplier_id', 'supplier'],
        ['source_id', 'source'], ['cost_per_unit', 'costPerUnit'], ['total_cost', 'totalCost'], ['description', 'batchNote'],
        [fn('sum', fn('COALESCE', col('Productions->Mortalities.count'), 0)), 'totalMortality'],
        [literal('`Source->Party`.`name`'), 'sourceName'],
        [literal('CASE WHEN is_active = 1 THEN "Active" ELSE "Retired" END'), 'status']],
      include: [
        {
          model: Breed,
          attributes: []
        },
        {
          model: House,
          attributes: [],
          include: [
            {
              model: Location,
              as: 'location',
              attributes: []
            }
          ]
        },
        {
          model: Source,
          attributes: [],
          include: [
            {
              model: Party,
              attributes: []
            }
          ]
        },
        {
          model: Production,
          attributes: [],
          include: [
            {
              model: Mortality,
              attributes: []
            }
          ]
        }
      ],
      group: ['Batch.batch_id'],
      raw: true
    })
      .then((batches) => batches.map((batch) => {
        batch.currentStock = batch.initialStock - batch.totalMortality;
        return batch;
      }));
  }

  async getBreeds() {
    return Breed.findAll({
      attributes: [['breed_id', 'id'], 'name', 'type', 'category'],
      order: [['name', 'ASC']]
    })
      .then((breeds) => breeds);
  }

  async addBatch(user, batch) {
    const farm = await House.findOne({
      where: { house_id: batch.houseId },
      attributes: ['name']
    });

    const moveOutDate = new Date(batch.moveOutDate);
    const activeBatchCount = await Batch.count({
      where: {
        house_id: batch.houseId,
        move_out_date: {
          [Op.gt]: new Date()
        }
      }
    });

    const batchCount = await Batch.count({ where: { house_id: batch.houseId } });

    if (activeBatchCount > 0) {
      return {
        error: 'A batch already exist for the specified house. '
          + 'Please end the current batch or select a different house.',
        status: 409
      };
    }

    return Batch.create({
      name: `${farm.name}-${(batchCount + 1).toString()
        .padStart(3, '0')}`,
      move_in_date: new Date(batch.moveInDate),
      move_out_date: moveOutDate,
      move_in_age: batch.initialAge,
      animal_category_id: 1,
      breed_id: batch.breedId,
      initial_stock_count: batch.initialStock,
      mortality_count: batch.initialStock - batch.currentStock,
      supplier_id: batch.supplierId,
      source_id: batch.sourceId,
      cost_per_unit: batch.costPerBird,
      total_cost: batch.amount,
      description: batch.note,
      is_active: moveOutDate > new Date(),
      house_id: batch.houseId
    }, { user, resourceId: 'batch_id' })
      .then((newBatch) => newBatch.batch_id)
      .catch((error) => {
        console.log(error); // todo: add proper logger
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async getBatchTreatments(batchId) {
    return sequelize.query(`
    SELECT productions.production_id, productions.date, 
    vaccinations.administered_by AS vaccineAdministrator, vaccinations.notes AS vaccinationNotes, 
    vaccinations.vaccination_id AS vaccinationId, vaccinations.vaccine_batch_no AS vaccineBatchNo,
    vaccinations.method AS vaccinationMethod, vaccinations.vaccine_id AS vaccineId, 
    vaccinations.dosage AS vaccineDosage, vaccinations.dosage_unit AS vaccineDosageUnit, 
    vaccinations.total_dosage AS vaccineTotalDosage, vaccinations.no_of_birds AS vaccinatedBirds,
    medication.administered_by AS medicamentAdministrator, medication.notes AS medicationNotes, 
    medication.medication_id AS medicationId, medication.medicament_batch_no AS medicamentBatchNo,
    medication.method AS medicationMethod, medication.medicament_id AS medicamentId, 
    medication.dosage AS medicamentDosage, medication.dosage_unit AS medicamentDosageUnit, 
    medication.total_dosage AS medicamentTotalDosage, medication.no_of_birds AS medicatedBirds,
    vaccine.item_name AS vaccineName, vaccine.brand AS vaccineBrand, medicament.item_name AS medicamentName,
    medicament.brand AS medicamentBrand, vaccine.image AS vaccineThumbnail, medicament.image AS medicamentThumbnail
    FROM productions
    LEFT JOIN vaccinations ON productions.production_id = vaccinations.production_id
    LEFT JOIN medication ON productions.production_id = medication.production_id
    LEFT JOIN items vaccine ON vaccinations.vaccine_id = vaccine.item_id
    LEFT JOIN items medicament ON medication.medicament_id = medicament.item_id
    WHERE productions.batch_id = '${batchId}'
    ORDER BY productions.date DESC;
`)
      .then(async ([treatments]) => {
        const res = await this.processTreatments(treatments);
        return res;
      }).catch((error) => {
        console.log(error); // todo: add proper logger
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async getBatchById(batchId) {
    const batches = await this.getBatches({ batch: batchId});
    if (Array.isArray(batches)) return batches[0];
    return batches;
  }

  async getExpenseSummary(batchId) {
    return Batch.findByPk(batchId, {

    })
  }

  async updateBatch(BatchId) {
    return Batch.findOne({
      where: { id: BatchId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
      .then((Batch) => Batch);
  }

  async processTreatments(treatments) {
    const normalizedTreatments = {};
    treatments.forEach((treatment) => {
       if (!normalizedTreatments[treatment.date] && (treatment.vaccinationId || treatment.medicationId)) {
         normalizedTreatments[treatment.date] = [];
       }
       if (treatment.vaccinationId) {
         normalizedTreatments[treatment.date].push({
           type: "vaccination",
           administeredBy: treatment.vaccineAdministrator,
           note: treatment.vaccinationNotes,
           id: treatment.vaccinationId,
           batchNo: treatment.vaccineBatchNo,
           method: treatment.vaccinationMethod,
           vaccineId: treatment.vaccineId,
           dosage: treatment.vaccineDosage,
           dosageUnit: treatment.vaccineDosageUnit,
           totalDosage: treatment.vaccineTotalDosage,
           noOfBirds: treatment.vaccinatedBirds,
           vaccineName: treatment.vaccineName,
           vaccineBrand: treatment.vaccineBrand,
           thumbnail: treatment.vaccineThumbnail
         });
       }
       if (treatment.medicationId) {
         normalizedTreatments[treatment.date].push({
           type: "medication",
           administeredBy: treatment.medicamentAdministrator,
           note: treatment.medicationNotes,
           id: treatment.medicationId,
           batchNo: treatment.medicamentBatchNo,
           method: treatment.medicationMethod,
           vaccineId: treatment.medicamentId,
           dosage: treatment.medicamentDosage,
           dosageUnit: treatment.medicamentDosageUnit,
           totalDosage: treatment.medicamentTotalDosage,
           noOfBirds: treatment.medicatedBirds,
           medicamentName: treatment.medicamentName,
           medicamentBrand: treatment.medicamentBrand,
           thumbnail: treatment.medicamentThumbnail
         });
       }
    });
    return normalizedTreatments;
  }
}

module.exports = new Controller();
