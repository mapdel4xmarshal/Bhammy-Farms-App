const schedule = require('node-schedule');
const request = require('request');
const mailer = require('../../mailer/mailer');
const {
  Employee, BankDetail, Salary, Deductible, Absence, sequelize, Party
} = require('../../models');
const SalaryClass = require('./salary');

class SalaryScheduler {
  constructor() {
    this._jobHandle = null;
  }

  get job() {
    return this._jobHandle;
  }

  async schedule() {
    return new Promise((resolve) => {
      this._jobHandle = schedule.scheduleJob('0 0 1 * *', async () => {
        const result = await this.process();
        resolve(result);
      });
    });
  }

  async process(employeeId, user = {
    id: 'Auto',
    displayName: 'System'
  }, fullMonthsOnly) {
    return new Promise(async (resolve) => {
      const transaction = await sequelize.transaction();
      const where = employeeId ? { employee_id: employeeId } : {};

      const employees = await Employee.findAll({
        include: [
          {
            model: BankDetail,
            as: 'bankDetail',
            where: {
              verified: true
            },
            required: false
          },
          {
            model: Salary,
            as: 'salaries',
            attributes: ['id', ['period_start', 'periodStart'], ['period_end', 'periodEnd'],
              ['payment_date', 'paymentDate'], 'amount', 'status', ['reference_id', 'referenceId'],
              ['loan_payment', 'loanPaidAmount']],
            required: false
          },
          {
            model: Deductible,
            as: 'deductibles',
            attributes: ['id', 'amount', 'comment', 'date', ['expiry_date', 'dueDate'], 'type'],
            required: false
          },
          {
            model: Absence,
            required: false
          },
          {
            model: Party,
            attributes: ['name']
          },
        ],
        where
      }, { transaction, logging: false })
        .catch((error) => {
          console.log(error);
        });

      const recipients = {
        currency: 'NGN',
        source: 'balance',
        transfers: []
      };

      employees.forEach(async (employee) => {
        const employeeData = employee.toJSON();
        if (employeeData.is_active) {
          const salary = new SalaryClass(employeeData, fullMonthsOnly);
          if (salary.nextSalary.amount > 0 && employeeData.bankDetail) {
            recipients.transfers.push({
              amount: Math.floor(salary.nextSalary.amount) * 100,
              reason: `${employeeData.Party.name}-SALARY ${salary.nextSalary.period}`,
              recipient: employeeData.bankDetail[0].intermediary_id,
              reference: employeeData.employee_id
            });

            await employee.createSalary({
              period_start: salary.nextSalary.start || new Date(),
              period_end: salary.nextSalary.end || new Date(),
              payment_date: new Date(),
              amount: salary.nextSalary.amount,
              loan_payment: salary.nextRepaymentAmount,
              status: 'processing',
              comment: `base: ${salary.base}, ${salary.nextSalary.period}`
            }, {
              transaction,
              user,
              logging: false,
              resourceId: 'id'
            });
          }
        }
      });

      if (recipients.transfers.length === 0 && employeeId) {
        return resolve({
          message: 'Ensure bank detail is accurate and salary is greater than zero (0)',
          status: 400,
          error: 'Salary should be greater than zero (0)'
        });
      }

      const url = 'https://api.paystack.co/transfer/bulk';
      request.post({
        url,
        json: recipients
      }, async (error, res, detail) => {
        if (error || !detail.status) {
          console.log(error);
          mailer.sendNotification('Salary Process Error', JSON.stringify(error || detail));
          await transaction.rollback();
          resolve({
            message: 'Unable to process request. Please ensure the bank detail is accurate, then try again!',
            status: 500,
            error: error || detail
          });
        } else {
          await transaction.commit();
          const title = detail.status ? 'Processing Salaries' : 'Processing Salaries Failed';
          await mailer.sendNotification(title, JSON.stringify(detail));
          resolve(detail);
        }
      })
        .auth(null, null, true, process.env.PAYSTACK_SECRET);
    });
  }
}

module.exports = SalaryScheduler;
