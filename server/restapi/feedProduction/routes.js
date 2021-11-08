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

router.delete('/:productionId', async (req, res) => {
  const production = await controllers.deleteProduction({ id: req.params.productionId }, req.user);
  res.json(production);
});

module.exports = router;
