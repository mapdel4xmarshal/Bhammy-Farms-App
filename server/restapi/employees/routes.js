const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const employees = await controllers.getEmployees(null, req.query.status);
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

router.get('/:employeeId', async (req, res) => {
  const employee = await controllers.getEmployee(req.params.employeeId);
  res.json(employee);
});

router.post('/', async (req, res) => {
  const employee = await controllers.addEmployee(req);
  res.status(employee.status ? employee.status : 200).json(employee);
});

router.patch('/:employeeId', async (req, res) => {
  const employee = await controllers.updateEmployee(req);
  res.status(employee.status ? employee.status : 200).json(employee);
});

router.post('/:employeeId/loan', async (req, res) => {
  const loan = await controllers.addLoan(req.params.employeeId, req.body, req.user);
  res.status(loan.status ? loan.status : 200).json(loan);
});

router.post('/:employeeId/leave', async (req, res) => {
  const leave = await controllers.addLeave(req.params.employeeId, req.body, req.user);
  res.status(leave.status ? leave.status : 200).json(leave);
});

router.post('/:employeeId/bank-detail', async (req, res) => {
  const bankDetail = await controllers.addBankDetails(req.params.employeeId, req.body, req.user);
  res.status(bankDetail.status ? bankDetail.status : 200).json(bankDetail);
});

router.patch('/:employeeId/bank-detail', async (req, res) => {
  const bankDetail = await controllers.updateBankDetails(req.params.employeeId, req.body, req.user);
  res.status(bankDetail.status ? bankDetail.status : 200).json(bankDetail);
});

router.post('/:employeeId/process-payment', async (req, res) => {
  const salary = await controllers.paySalary(req.params.employeeId, req.user);
  res.status(salary.status === true ? 200 : salary.status).json(salary);
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
