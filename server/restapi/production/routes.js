const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const batches = await controllers.getProductions(req.query);
  res.json(batches);
});

router.post('/', async (req, res) => {
  const batch = await controllers.addProduction(req.body);
  if (batch.error) res.status(batch.status);
  res.json(batch);
});


router.get('/:productionId', async (req, res) => {
  const batch = await controllers.getProductionById(req.params.productionId);
  res.json(batch);
});

router.patch('/:productionId', async (req, res) => {
  const batch = await controllers.updateProduction(req.body);
  res.json(batch);
});

module.exports = router;
