const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const expenses = await controllers.getExpenses(req.query);
  res.json(expenses);
});

router.get('/types', async (req, res) => {
  const expenseTypes = await controllers.getExpenseTypes();
  res.json(expenseTypes);
});

router.get('/:expenseId', async (req, res) => {
  const expense = await controllers.getExpenseById(req.params.expenseId);
  res.json(expense);
});

router.post('/', async (req, res) => {
  const expenseResponse = await controllers.addExpense(req, req.body);
  res.status(expenseResponse.status || 200).json(expenseResponse);
});

module.exports = router;
