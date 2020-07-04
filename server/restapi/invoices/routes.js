const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const invoices = await controllers.getInvoices(req.query);
  res.json(invoices);
});

router.post('/', async (req, res) => {
  const response = await controllers.addInvoice(req.body);
  if (response.error) res.status(response.status);
  res.json(response);
});

router.get('/:invoiceId', async (req, res) => {
  const invoice = await controllers.getInvoiceById(req.params.invoiceId);
  res.json(invoice);
});

module.exports = router;
