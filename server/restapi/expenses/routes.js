const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const expenses = await controllers.getExpenses();
  res.json(expenses);
});

router.get('/:expenseId', async (req, res) => {
  const expense = await controllers.getExpenseById(req.params.expenseId);
  res.json(expense);
});

router.post('/', async (req, res) => {
  const expenseId = await controllers.addExpense(req.body);
  res.json(expenseId);
});

module.exports = router;
