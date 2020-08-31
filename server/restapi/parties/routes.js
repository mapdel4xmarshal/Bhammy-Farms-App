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

router.get('/customers', async (req, res) => {
  const customers = await controllers.getCustomers();
  res.json(customers);
});

router.post('/customers', async (req, res) => {
  const customer = await controllers.addCustomer(req.body);
  res.json(customer);
});

router.get('/customers/:customerId', async (req, res) => {
  const customer = await controllers.getCustomers(req.params.customerId);
  res.json(customer);
});

router.patch('/customers/:customerId', async (req, res) => {
  const customer = await controllers.updateCustomer(req.body);
  res.json(customer);
});

module.exports = router;
