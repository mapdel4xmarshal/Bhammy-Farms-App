'strict';

const crypto = require('crypto');
const request = require('request');
const path = require('path');
const formidable = require('formidable');
const uuid = require('uuid');
const { Party, Employee, Sequelize, BankDetail, Salary, Deductible, Absence } = require('../../models');
const { fileUploadPath } = require('../../configs');
const mailer = require('../../mailer/mailer');
const SalaryClass = require('./salary');
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

  getEmployee(employeeId) {
    return Employee.findByPk(employeeId, {
      attributes: [['date_of_birth', 'dateOfBirth'], ['day_off', 'dayOff'], 'department',
        ['employment_date', 'employmentDate'], 'gender', ['house_id', 'house'], ['is_active', 'isActive'],
        ['is_manager', 'isManager'], ['location_id', 'location'], 'salary', ['manager_id', 'managerId'], 'position',
        'salary', 'comment', ['image', 'avatar'], ['employee_id', 'id']],
      include: [
        {
          model: BankDetail,
          as: 'bankDetail',
          attributes: [['account_name', 'accountName'], ['account_number', 'accountNumber'], ['bank_code', 'bankCode'],
            ['employee_id', 'employeeId'], 'id', ['intermediary_id', 'intermediaryId'], 'verified',
            ['bank_name', 'bankName']]
        },
        {
          model: Party,
          attributes: ['address', ['alt_phone', 'altPhone'], 'email', 'name', ['party_id', 'partyId'], 'phone', 'state']
        },
        {
          model: Salary,
          as: 'salaries',
          attributes: ['id', ['period_start', 'periodStart'], ['period_end', 'periodEnd'],
            ['payment_date', 'paymentDate'], 'amount', 'status', ['reference_id', 'referenceId'],
            ['loan_payment', 'loanPaidAmount']]
        },
        {
          model: Deductible,
          as: 'deductibles',
          attributes: ['id', 'amount', 'comment', 'date', ['expiry_date', 'dueDate'], 'type']
        },
        {
          model: Absence
        }
      ]
    })
      .then(employee => {
        employee = employee && employee.toJSON();
        const salaryInfo = new SalaryClass(employee);
        employee.unPaidSalary = +salaryInfo.nextSalary.amount;
        employee.unPaidLoan = +salaryInfo.outstandingLoanAmount;
        employee.totalLoan = +salaryInfo.totalLoan;
        employee.paidSalary = +salaryInfo.paidSalaries;
        employee.absences = [...employee.Absences];
        employee = { ...employee, ...employee.Party };
        employee.bankDetail = employee.bankDetail[0];
        delete employee.Absences;
        delete employee.Party;
        return employee;
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
        .auth(null, null, true, process.env.PAYSTACK_SECRET);
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

  async addBankDetails(employeeId, bankDetail, user) {
    const employee = await Employee.findByPk(employeeId);

    if (!employee) {
      return {
        status: 400,
        message: 'No employee found matching the supplied "employeeId"'
      };
    }

    const employeeBankDetail = await BankDetail.count({
      where: {
        employee_id: employeeId
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
          employee_id: employeeId
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

  async addLoan(employeeId, loan, user) {
    let employee = await Employee.findByPk(employeeId);

    if (!employee) {
      return {
        status: 400,
        message: 'No employee found matching the supplied "employeeId"'
      };
    }

    employee = employee && employee.toJSON();
    const salaryInfo = new SalaryClass(employee);

    if (salaryInfo.outstandingLoanAmount > 0) {
      return {
        status: 409,
        message: 'an outstanding loan exists. No new loan can be added until the outstanding one is paid.'
      };
    }

    return Deductible.create({
      type: 'loan',
      date: loan.date,
      expiry_date: loan.expiryDate,
      amount: loan.amount,
      comment: loan.comment,
      employee_id: employeeId
    }, {
      user,
      resourceId: 'id'
    });
  }

  async updateBankDetails(employeeId, bankDetail, user) {
    const employee = await Employee.findByPk(employeeId);

    if (!employee) {
      return {
        status: 400,
        message: 'No employee found matching the supplied "employeeId"'
      };
    }

    const bankDetailCount = await BankDetail.count({
      where: {
        employee_id: employeeId
      }
    });

    if (bankDetailCount === 0) {
      return {
        status: 404,
        message: 'No matching bank detail found'
      };
    }

    const bankInfo = await this.getBank(bankDetail.accountNumber, bankDetail.bankCode);
    if (bankInfo && bankInfo.status) {
      return BankDetail.update({
        account_number: bankDetail.accountNumber,
        account_name: bankDetail.accountName,
        bank_code: bankDetail.bankCode
      }, {
        user,
        resourceId: 'id',
        where: {
          employee_id: employeeId
        }
      })
        .catch((error) => {
          console.log(error);
          return {
            status: 500,
            message: 'unable to update bank-detail. Please try again or contact us.'
          };
        });
    } else {
      return {
        status: 400,
        message: bankInfo.message
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
          comment: employee.comment,
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

  async updateEmployee(req) {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir: `${fileUploadPath}${path.sep}uploads`
    });
    const { user } = req;

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, employee, files) => {
        if (err) reject(err);

        const existingEmployee = await Employee.findOne({
          where: {
            employee_id: employee.id
          }
        });

        if (!existingEmployee) {
          return {
            error: 'No employee found with the supplied id',
            status: 400
          };
        }

        const thumbnail = files.thumbnail ? files.thumbnail.path.replace(`${fileUploadPath}${path.sep}`, '') : null;
        const payload = {
          gender: employee.gender,
          employment_date: employee.employmentDate,
          position: employee.position,
          department: employee.department,
          date_of_birth: employee.dateOfBirth,
          is_active: true,
          salary: employee.salary,
          is_manager: employee.level,
          day_off: employee.dayOff,
          comment: employee.comment,
          house_id: employee.house,
          location_id: employee.location
        };

        if (thumbnail) payload.image = thumbnail;

        await Employee.update(
          payload, {
            include: [Party],
            user,
            resourceId: 'employee_id',
            where: {
              employee_id: employee.id
            }
          });

        await Party.update({
            name: employee.name,
            address: employee.address,
            state: employee.state,
            email: employee.email,
            phone: employee.phone,
            alt_phone: employee.altPhone
          },
          {
            where: {
              party_id: existingEmployee.toJSON().party_id
            }
          });

        resolve(existingEmployee);
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
    let where = {},
      bankDetailWhere = {};
    if (transferInfo.data.recipient.metadata) {
      where = { employee_id: transferInfo.data.recipient.metadata };
    } else {
      bankDetailWhere = { intermediary_id: transferInfo.data.recipient.recipient_code };
    }
    const employee = await Employee.findOne({
      where,
      include: [
        {
          model: BankDetail,
          as: 'bankDetail',
          attributes: [],
          where: {
            verified: true,
            ...bankDetailWhere
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

    if (employee.salaries) {
      const salariesLen = employee.salaries.length - 1;
      employee.salaries[salariesLen].reference_id = transferInfo.data.reference;
      employee.salaries[salariesLen].status = transferInfo.data.status;

      employee.salaries[salariesLen].save();
    }

    mailer.sendNotification('Salary Process Update', JSON.stringify(transferInfo));
  }

  async paySalary(employeeId, user) {
    const salaryScheduler = new SalaryScheduler();
    return salaryScheduler.process(employeeId, user)
      .catch((error) => {
        console.log(error);
        return {
          status: 500,
          message: 'unable to update bank-detail. Please try again or contact us.'
        };
      });
  }
}

module.exports = new Controller();
