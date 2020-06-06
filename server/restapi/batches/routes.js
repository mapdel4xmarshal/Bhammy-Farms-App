const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const batches = await controllers.getBatches();
  res.json(batches);
});

router.post('/', async (req, res) => {
  const batch = await controllers.addBatch(req.body);
  res.json(batch);
});


router.get('/:batchId', async (req, res) => {
  const batch = await controllers.getBatchById(req.params.batchId);
  res.json(batch);
});

router.patch('/:batchId', async (req, res) => {
  const batch = await controllers.updateBatch(req.body);
  res.json(batch);
});

module.exports = router;
