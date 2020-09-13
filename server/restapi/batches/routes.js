const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const batches = await controllers.getBatches(req.query);
  res.json(batches);
});

router.get('/breeds', async (req, res) => {
  const breeds = await controllers.getBreeds();
  res.json(breeds);
});

router.post('/', async (req, res) => {
  const batch = await controllers.addBatch(req.user, req.body);
  if (batch.error) res.status(batch.status);
  res.json(batch);
});


router.get('/:batchId', async (req, res) => {
  const batch = await controllers.getBatchById(req.params.batchId);
  res.json(batch);
});

router.get('/:batchId/treatments', async (req, res) => {
  const treatments = await controllers.getBatchTreatments(req.params.batchId);
  res.json(treatments);
});

router.get('/:batchId/income-summary', async (req, res) => {
  const summary = await controllers.getIncomeSummary(req.params.batchId);
  res.json(summary);
});

router.get('/:batchId/productions', async (req, res) => {
  const production = await controllers.getProduction(req.params.batchId);
  res.json(production);
});

router.patch('/:batchId', async (req, res) => {
  const batch = await controllers.updateBatch(req.user, req.body);
  res.json(batch);
});

module.exports = router;
