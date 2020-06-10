const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/suppliers', async (req, res) => {
  const suppliers = await controllers.getSuppliers();
  res.json(suppliers);
});

router.get('/suppliers/:supplierId', async (req, res) => {
  const location = await controllers.getSupplierById(req.params.supplierId);
  res.json(location);
});

router.get('/sources', async (req, res) => {
  const sources = await controllers.getSources();
  res.json(sources);
});

router.get('/sources/:sourceId', async (req, res) => {
  const sources = await controllers.getSourceById(req.params.sourceId);
  res.json(sources);
});

module.exports = router;
