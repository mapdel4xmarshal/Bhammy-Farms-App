const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const locations = await controllers.getLocations();
  res.json(locations);
});

router.get('/:locationId', async (req, res) => {
  const location = await controllers.getLocationById(req.params.locationId);
  res.json(location);
});

module.exports = router;
