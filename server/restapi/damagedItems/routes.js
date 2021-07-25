const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const batches = await controllers.getDamagedItems(req.query);
  res.json(batches);
});

router.post('/', async (req, res) => {
  const batch = await controllers.addDamagedItem(req.user, req.body);
  if (batch.error) res.status(batch.status);
  res.json(batch);
});


router.delete('/:id', async (req, res) => {
  const batch = await controllers.deleteDamagedItemById(req.user, req.params.id);
  res.json(batch);
});

module.exports = router;
