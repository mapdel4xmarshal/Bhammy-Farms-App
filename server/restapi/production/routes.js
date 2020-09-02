const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const production = await controllers.getProductions(req.query);
  res.json(production);
});

router.post('/', async (req, res) => {
  const production = await controllers.addProduction(req.user, req.body);
  if (production.error) res.status(production.status);
  res.json(production);
});


router.get('/:productionId', async (req, res) => {
  const production = await controllers.getProductionById(req.params.productionId);
  res.json(production);
});

router.patch('/:productionId', async (req, res) => {
  const production = await controllers.updateProduction(req.body);
  res.json(production);
});

module.exports = router;
