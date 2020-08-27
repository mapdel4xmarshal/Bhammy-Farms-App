const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await controllers.getItems(req.query);
  res.json(items);
});

router.post('/', async (req, res) => {
  const itemResponse = await controllers.addItem(req);
  res.status(itemResponse.status || 200).json(itemResponse);
});

router.get('/brands', async (req, res) => {
  const brands = await controllers.getItemBrands(req.query);
  res.json(brands);
});

module.exports = router;
