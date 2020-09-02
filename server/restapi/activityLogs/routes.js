const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const activities = await controllers.getActivities(req.query);
  res.json(activities);
});

module.exports = router;
