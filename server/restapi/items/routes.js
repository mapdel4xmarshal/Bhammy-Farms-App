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

router.patch('/:itemId', async (req, res) => {
  const itemResponse = await controllers.updateItem(req.params.itemId, req);
  res.status(itemResponse.status || 200).json(itemResponse);
});

router.get('/brands', async (req, res) => {
  const brands = await controllers.getItemBrands(req.query);
  res.json(brands);
});

router.get('/categories', async (req, res) => {
  const categories = await controllers.getItemCategories(req.query);
  res.json(categories);
});

router.get('/units', async (req, res) => {
  const categories = await controllers.getItemUnits(req.query);
  res.json(categories);
});

module.exports = router;
