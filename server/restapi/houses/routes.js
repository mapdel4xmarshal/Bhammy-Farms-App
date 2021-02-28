const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const houses = await controllers.getHouses();
  res.json(houses);
});

router.get('/:houseId', async (req, res) => {
  const house = await controllers.getHouseById(req.params.houseId);
  res.json(house);
});

module.exports = router;
