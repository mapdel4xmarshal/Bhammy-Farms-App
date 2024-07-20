const express = require('express');
const controller = require('./controllers');

const router = express.Router();

router.post('/payment', async (req, res) => {
  try {
    const messages = await controller.processPaymentNotifications(req.body);
    res.json(messages);
  } catch (e) {
    console.log(e);
    res.status(500)
      .json({
        error: e,
        status: 500
      });
  }
});

router.post('/whatsapp', async (req, res) => {
  try {
    const messages = await controller.processWhatsappNotifications(req.body);
    res.json(messages);
  } catch (e) {
    console.log(e);
    res.status(500)
      .json({
        error: e,
        status: 500
      });
  }
});

router.post('whatsapp/webhook', async (req, res) => {
  try {
    const messages = await controller.processWhatsappWebhook(req.body);
    res.json(messages);
  } catch (e) {
    console.log(e);
    res.status(500)
      .json({
        error: e,
        status: 500
      });
  }
});

module.exports = router;
