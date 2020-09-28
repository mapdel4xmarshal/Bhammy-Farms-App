'strict';

const crypto = require('crypto');
const request = require('request');
const path = require('path');
const formidable = require('formidable');
const uuid = require('uuid');
const { Party, Employee, Sequelize, BankDetail, Salary } = require('../../models');
const { fileUploadPath } = require('../../configs');
const SalaryScheduler = require('./salaryScheduler');

class Controller {
  constructor() {
    this._commonFields = [[Sequelize.literal('Party.name'), 'name'],
      [Sequelize.literal('Party.email'), 'email'],
      [Sequelize.literal('Party.address'), 'address'],
      [Sequelize.literal('Party.phone'), 'phone'],
      [Sequelize.literal('Party.alt_phone'), 'altPhone'],
      [Sequelize.literal('Party.state'), 'state']];

    const salaryScheduler = new SalaryScheduler();
    salaryScheduler.schedule();
  }

  async getEmployees(id) {
    const where = {};
    if (id) where.employee_id = id;

    return Employee[id ? 'findOne' : 'findAll']({
      include: [
        {
          model: Party,
          attributes: []
        }
      ],
      raw: false,
      attributes: [
        ['employee_id', 'id'],
        ...this._commonFields,
        ['image', 'avatar'],
        ['is_active', 'isActive'],
        'department',
        ['position', 'role'],
        ['day_off', 'dayOff']
      ],
      where
    })
      .then((employees) => employees)
      .catch((error) => {
        console.log(error);
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async getRoles() {
    return Employee.findAll({
      attributes: ['position'],
      group: ['position']
    })
      .then((positions) => positions.map((position) => position.position))
      .catch(error => {
        console.log(error);
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async getDepartments() {
    return Employee.findAll({
      attributes: ['department'],
      group: ['department']
    })
      .then((departments) => departments.map((department) => department.department))
      .catch(error => {
        console.log(error);
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async getBank(accountNumber, bankCode) {
    return new Promise((resolve) => {
      const url = `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;
      request.get(url, (error, res, detail) => {
        if (error) {
          resolve({
            error: 'Unable to process request. Please try again later!',
            status: 500
          });
        } else {
          resolve(JSON.parse(detail));
        }
      })
        .auth(null, null, true, 'sk_test_b1ed49c1c941573da4eeaa7de1c9169e068cfc8d');
    });
  }

  async createRecipient(recipient) {
    return new Promise((resolve) => {
      const url = `https://api.paystack.co/transferrecipient`;
      request.post({
        url,
        json: recipient
      }, (error, res, detail) => {
        if (error) {
          resolve({
            error: 'Unable to process request. Please try again later!',
            status: 500
          });
        } else {
          resolve(detail);
        }
      })
        .auth(null, null, true, process.env.PAYSTACK_SECRET);
    });
  }

  async addBankDetails(bankDetail, user) {
    const employee = await Employee.findByPk(bankDetail.employeeId);

    if (!employee) {
      return {
        status: 400,
        message: 'No employee found matching the supplied "employeeId"'
      };
    }

    const employeeBankDetail = await BankDetail.count({
      where: {
        employee_id: bankDetail.employeeId
      }
    });

    if (employeeBankDetail > 0) {
      return {
        status: 409,
        message: 'Bank-details already exist for the specified user'
      };
    }

    const bankInfo = await this.getBank(bankDetail.accountNumber, bankDetail.bankCode);
    if (bankInfo && bankInfo.status) {
      const recipient = await this.createRecipient({
        type: 'nuban',
        name: bankInfo.data.account_name,
        account_number: bankInfo.data.account_number,
        bank_code: bankDetail.bankCode,
        metadata: employee.employee_id,
        currency: 'NGN'
      });

      if (recipient && recipient.status) {
        return BankDetail.create({
          account_number: bankInfo.data.account_number,
          account_name: bankInfo.data.account_name,
          bank_name: recipient.data.details.bank_name,
          bank_code: bankDetail.bankCode,
          verified: true,
          intermediary_id: recipient.data.recipient_code,
          employee_id: bankDetail.employeeId
        }, {
          user,
          resourceId: 'id'
        })
          .catch((error) => {
            console.log(error);
            return {
              status: 500,
              message: 'unable to create bank-detail. Please try again or contact us.'
            };
          });
      } else {
        return {
          status: 500,
          message: 'Unable to create recipient bank detail'
        };
      }
    } else {
      return {
        status: 400,
        message: 'Invalid bank details'
      };
    }
  }

  async addEmployee(req) {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir: `${fileUploadPath}${path.sep}uploads`
    });
    const { user } = req;

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, employee, files) => {
        if (err) reject(err);

        const thumbnail = files.thumbnail ? files.thumbnail.path.replace(`${fileUploadPath}${path.sep}`, '') : null;

        const newEmployee = await Employee.create({
          Party: {
            party_id: uuid.v4(),
            name: employee.name,
            address: employee.address,
            state: employee.state,
            email: employee.email,
            phone: employee.phone,
            alt_phone: employee.altPhone
          },
          gender: employee.gender,
          employment_date: employee.employmentDate,
          position: employee.position,
          department: employee.department,
          date_of_birth: employee.dateOfBirth,
          is_active: true,
          salary: employee.salary,
          is_manager: employee.level,
          image: thumbnail,
          day_off: employee.dayOff,
          comment: employee.remark,
          house_id: employee.house,
          location_id: employee.location
        }, {
          include: [Party],
          user,
          resourceId: 'employee_id'
        });

        resolve(newEmployee);
      });
    }).catch(async (e) => {
      console.log(e); // todo: add proper logger
      return {
        error: 'Unable to process request. Please try again later!',
        status: 500
      };
    });
  }

  processWebhookEvent(req) {
    const secret = process.env.PAYSTACK_SECRET;
    const hash = crypto.createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    if (hash === req.headers['x-paystack-signature'] && req.body.event.startsWith('transfer.')) {
      this.updateSalaryStatus(req.body);
    }
  }

  async updateSalaryStatus(transferInfo) {
    const employee = await Employee.findOne({
      include: [
        {
          model: BankDetail,
          as: 'bankDetail',
          attributes: [],
          where: {
            verified: true,
            intermediary_id: transferInfo.data.recipient.recipient_code
          }
        },
        {
          model: Salary,
          as: 'salaries',
          where: {
            status: 'processing'
          }
        }]
    });

    const salariesLen = employee.salaries.length - 1;
    employee.salaries[salariesLen].reference_id = transferInfo.data.reference;
    employee.salaries[salariesLen].status = transferInfo.data.status;

    employee.salaries[salariesLen].save();
  }
}

module.exports = new Controller();
