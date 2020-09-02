const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const invoices = await controllers.getInvoices(req.query);
    res.json(invoices);
  } catch (e) {
    console.log(e);
    res.status(500)
      .json({
        error: 'Unable to process request. Please try again later!',
        status: 500
      });
  }
});

router.post('/', async (req, res) => {
  try {
    const response = await controllers.addInvoice(req.user, req.body);
    if (response.error) res.status(response.status);
    res.json(response);
  } catch (e) {
    console.log(e);
    res.status(500)
      .json({
        error: 'Unable to process request. Please try again later!',
        status: 500
      });
  }
});

router.get('/:invoiceId', async (req, res) => {
  try {
    const invoice = await controllers.getInvoiceById(req.params.invoiceId);
    res.json(invoice);
  } catch (e) {
    res.status(500).json({
      error: 'Unable to process request. Please try again later!',
      status: 500
    });
  }
});

module.exports = router;
