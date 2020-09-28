const schedule = require('node-schedule');
const request = require('request');
const mailer = require('../../mailer/mailer');
const { Employee, BankDetail, Salary, Deductible, Absence, sequelize } = require('../../models');
const SalaryClass = require('./salary');

class SalaryScheduler {
  constructor() {
    this._jobHandle = null;
  }

  get job() {
    return this._jobHandle;
  }

  async schedule() {   this.process();
    return new Promise((resolve) => {
      this._jobHandle = schedule.scheduleJob('0 0 1 * *', async () => {
        const result = await this.process();
        resolve(result);
      });
    });
  }

  async process() {
    return new Promise(async (resolve) => {
      const transaction = await sequelize.transaction();

      const employees = await Employee.findAll({
        include: [
          {
            model: BankDetail,
            as: 'bankDetail',
            where: {
              verified: true
            }
          },
          {
            model: Salary,
            as: 'salaries'
          },
          {
            model: Deductible,
            as: 'deductibles'
          },
          {
            model: Absence
          }
        ]
      }, { transaction });

      const recipients = {
        currency: 'NGN',
        source: 'balance',
        transfers: []
      };

      employees.forEach( async (employee) => {
        const employeeData = employee.toJSON();
        const salary = new SalaryClass(employeeData);
        recipients.transfers.push({
          amount: Math.floor(salary.nextSalary.amount) * 100,
          reason: `BHAMMYFARMS: SALARY ${salary.nextSalary.period}`,
          recipient: employeeData.bankDetail[0].intermediary_id
        });   console.log(salary.nextRepaymentAmount, salary.outstandingLoanAmount, salary.nextSalary)

        await employee.createSalary({
          period_start: new Date(),
          period_end: new Date(),
          payment_date: new Date(),
          amount: salary.nextSalary.amount,
          loan_payment: salary.nextRepaymentAmount,
          status: 'processing',
          comment: `base: ${salary.base}, ${salary.nextSalary.period}`
        }, { transaction });
      });

      const url = `https://api.paystack.co/transfer/bulk`;
      request.post({
        url,
        json: recipients
      }, async (error, res, detail) => {
        if (error || !detail.status) {
          mailer.sendNotification('Salary Process Error', JSON.stringify(error || detail));
          await transaction.rollback();
          resolve({
            error: 'Unable to process request. Please try again later!',
            status: 500
          });
        } else {
          await transaction.commit();
          const title = detail.status ? 'Processing Salaries' : 'Processing Salaries Failed';
          mailer.sendNotification(title, JSON.stringify(detail));
          resolve(detail);
        }
      })
        .auth(null, null, true, process.env.PAYSTACK_SECRET);
    });
  }
}

module.exports = SalaryScheduler;
