const {
  Batch,
  Breed,
  House,
  Production,
  Mortality,
  Location,
  Source,
  Party,
  Sequelize: {
    Op,
    literal,
    fn,
    col
  },
  sequelize,
  Expense,
  Item
} = require('../../models');
const BatchProduction = require('./BatchProduction');

class Controller {
  async getBatches({
    house,
    batch,
    status
  }) {
    const allowedStatus = {
      retired: 0,
      active: 1
    };
    let where = {};
    if (house) where = { house_id: house };
    if (batch) where = { batch_id: batch };
    if (status) where = { is_active: allowedStatus[status.toLowerCase()] };

    return Batch.findAll({
      where,
      attributes: [
        'name', ['batch_id', 'batchId'], 'name', ['house_id', 'houseId'], [literal('House.name'), 'house'],
        [col('`House->location`.name'), 'farm'],
        [fn('date_format', col('move_in_date'), '%Y-%m-%d'), 'moveInDate'],
        [fn('date_format', col('move_out_date'), '%Y-%m-%d'), 'moveOutDate'],
        ['move_in_age', 'moveInAge'], [literal('DATEDIFF(LEAST(NOW(), move_out_date), move_in_date) + move_in_age'), 'currentAge'],
        [literal('Breed.name'), 'breed'], [literal('Breed.type'), 'category'], ['initial_stock_count', 'initialStock'],
        [literal('initial_stock_count - "Productions->Mortalities.count"'), 'currentStock'], ['supplier_id', 'supplier'],
        ['source_id', 'source'], ['cost_per_unit', 'costPerUnit'], ['total_cost', 'totalCost'], ['description', 'batchNote'],
        [fn('sum', fn('COALESCE', col('Productions->Mortalities.count'), 0)), 'totalMortality'],
        [literal('`Source->Party`.`name`'), 'sourceName'],
        [literal('CASE WHEN is_active = 1 THEN "Active" ELSE "Retired" END'), 'status']],
      order: [['name', 'ASC']],
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
    }, {
      user,
      resourceId: 'batch_id'
    })
      .then((newBatch) => newBatch.batch_id)
      .catch((error) => {
        console.log(error); // todo: add proper logger
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async getBatchTreatments(batchId, list) {
    const batch = await Batch.findByPk(batchId);

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
        if (!list) {
          return await this.processTreatments(treatments);
        }
        return treatments
          .filter((treatment) => treatment.vaccinationId || treatment.medicationId)
          .map((treatment) => ({
            date: treatment.date,
            week: Math.floor((((new Date(treatment.date) - new Date(batch.move_in_date)) / 86400000) + batch.move_in_age) / 7),
            type: treatment.vaccinationId ? 'vaccination' : 'medication',
            note: treatment.vaccinationNotes || treatment.medicationNotes,
            id: treatment.vaccinationId || treatment.medicationId,
            dosageUnit: treatment.vaccineDosageUnit || treatment.medicamentDosageUnit,
            totalDosage: treatment.vaccineTotalDosage || treatment.medicamentTotalDosage,
            vaccineName: treatment.vaccineName,
            medicamentName: treatment.medicamentName,
            vaccineBrand: treatment.vaccineBrand,
            medicamentBrand: treatment.medicamentBrand
          }));
      })
      .catch((error) => {
        console.log(error); // todo: add proper logger
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async getBatchById(batchId) {
    const batches = await this.getBatches({ batch: batchId });
    if (Array.isArray(batches)) return batches[0];
    return batches;
  }

  async getIncomeSummary(batchId) {
    const expenses = await Expense.findAll({
      where: { batch_id: batchId },
      attributes: [[fn('SUM', col('amount')), 'amount']]
    });

    return sequelize.query(`
      SELECT ROUND(SUM((production_items.quantity / items.packaging_size) * production_items.price)) AS amount, items.category
      FROM productions
      JOIN production_items ON productions.production_id = production_items.production_id
      JOIN items ON production_items.item_id = items.item_id
      WHERE productions.batch_id = '${batchId}'
      GROUP BY items.category;`)
      .then(([summary,]) => [...summary, {
        category: 'expense',
        amount: expenses[0].amount
      }])
      .catch((error) => {
        console.log(error); // todo: add proper logger
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async updateBatch(BatchId) {
    return Batch.findOne({
      where: { id: BatchId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
      .then((Batch) => Batch);
  }

  async getProduction(batchId) {
    const batch = await Batch.findByPk(batchId);

    return Production.findAll({
      where: {
        batch_id: batchId
      },
      attributes: [
        ['production_id', 'id'], 'date', 'humidity', 'temperature', 'weatherCondition', 'water', 'note',
        [literal(`COALESCE(DATEDIFF(date, '${batch.move_in_date.toJSON()
          .slice(0, 10)}'), 0) + ${batch.move_in_age}`),
        'batchAge']
      ],
      order: [
        ['date', 'DESC']
      ],
      include: [
        {
          model: Item,
          attributes: [
            ['item_id', 'id'], ['item_name', 'name'], 'category', 'brand', ['packaging_size', 'packagingSize'],
            'unit', ['image', 'thumbnail'], 'description', ['packaging_metric', 'packagingMetric']
          ],
          through: {
            attributes: ['quantity', 'price']
          }
        }
      ]
    })
      .then((productions) => productions.map((production) => new BatchProduction(production.toJSON())));
  }

  async processTreatments(treatments) {
    const normalizedTreatments = {};
    treatments.forEach((treatment) => {
      if (!normalizedTreatments[treatment.date] && (treatment.vaccinationId || treatment.medicationId)) {
        normalizedTreatments[treatment.date] = [];
      }
      if (treatment.vaccinationId) {
        normalizedTreatments[treatment.date].push({
          type: 'vaccination',
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
          type: 'medication',
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
