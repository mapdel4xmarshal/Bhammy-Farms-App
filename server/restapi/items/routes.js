const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await controllers.getItems(req.query);
  res.json(items);
});

router.post('/', async (req, res) => {
  const itemResponse = await controllers.addItem(req.body);
  res.status(itemResponse.status || 200).json(itemResponse);
});

module.exports = router;
