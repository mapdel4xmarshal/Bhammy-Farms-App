const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const employees = await controllers.getEmployees();
  res.json(employees);
});

router.get('/roles', async (req, res) => {
  const roles = await controllers.getRoles();
  res.json(roles);
});

router.get('/departments', async (req, res) => {
  const departments = await controllers.getDepartments();
  res.json(departments);
});

router.post('/', async (req, res) => {
  const employee = await controllers.addEmployee(req);
  res.status(employee.status ? employee.status : 200).json(employee);
});

router.post('/bank-detail', async (req, res) => {
  const bankDetail = await controllers.addBankDetails(req.body, req.user);
  res.status(bankDetail.status ? bankDetail.status : 200).json(bankDetail);
});

router.post('/webhook/salary', async (req, res) => {
  controllers.processWebhookEvent(req);
  res.sendStatus(200);
});

router.get('/bank/resolve', async (req, res) => {
  const bank = await controllers.getBank(req.query.accountNumber, req.query.bankCode);
  res.json(bank);
});

module.exports = router;
