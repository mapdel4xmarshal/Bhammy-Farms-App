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

router.patch('/:batchId', async (req, res) => {
  const batch = await controllers.updateBatch(req.user, req.body);
  res.json(batch);
});

module.exports = router;
