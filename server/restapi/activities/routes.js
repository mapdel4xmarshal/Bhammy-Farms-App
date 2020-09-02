const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const activities = await controllers.getActivities(req.query);
  res.json(activities);
});

router.post('/', async (req, res) => {
  const activity = await controllers.addActivity(req.user, req.body);
  if (activity.error) res.status(activity.status);
  res.json(activity);
});


router.get('/:activityId', async (req, res) => {
  const activity = await controllers.getActivityById(req.params.activityId);
  res.json(activity);
});

module.exports = router;
