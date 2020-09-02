const path = require('path');
const formidable = require('formidable');
const {
  Expense, ExpenseType, Supplier, Sequelize, Batch, Location, House
} = require('../../models');
const { fileUploadPath } = require('../../configs');

class Controller {
  async getExpenses({
    type: name, category, after, before, date
  }) {
    const where = {}; const
      expenseTypeWhere = {};
    if (category) where.category = category;
    if (name) expenseTypeWhere.name = name;
    if (before || after) where.date = {};
    if (before) where.date[Sequelize.Op.lte] = before;
    if (after) where.date[Sequelize.Op.gte] = after;
    if (date) where.date = date;

    return Expense.findAll({
      attributes: [
        [Sequelize.literal('Supplier.supplier_id'), 'supplier_id'],
        [Sequelize.literal('ExpenseType.name'), 'type'],
        [Sequelize.literal('Batch.name'), 'batch'],
        [Sequelize.literal('House.name'), 'house'],
        [Sequelize.literal('Location.name'), 'farm'],
        ['expense_id', 'id'], [Sequelize.fn('date_format', Sequelize.col('date'), '%Y-%m-%d'), 'date'],
        'category', 'quantity', ['invoice_number', 'referenceId'], 'amount', ['proof_of_payment', 'attachment'],
        'description'
      ],
      order: [
        ['date', 'DESC'],
      ],
      include: [{
        model: Supplier,
        attributes: []
      },
      {
        model: ExpenseType,
        attributes: [],
        where: expenseTypeWhere
      },
      {
        model: Batch,
        attributes: []
      },
      {
        model: Location,
        attributes: []
      },
      {
        model: House,
        attributes: []
      }],
      raw: true,
      where
    })
      .then((expenses) => expenses);
  }

  async getExpenseTypes() {
    return ExpenseType.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
      .then((expenseTypes) => expenseTypes);
  }

  async getExpenseById(expenseId) {
    return Expense.findOne({
      where: { id: expenseId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
      .then((expense) => expense);
  }

  async addExpense(req) {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir: `${fileUploadPath}${path.sep}uploads`
    });
    const { user } = req;

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, expense, files) => {
        if (err) reject(err);

        const attachment = files.attachment ? files.attachment.path.replace(`${fileUploadPath}${path.sep}`, '') : null;

        Expense.create({
          date: expense.date,
          category: expense.category,
          quantity: expense.quantity,
          expense_type_id: expense.type,
          supplier_id: expense.supplier,
          location_id: expense.farm,
          house_id: expense.pen,
          batch_id: expense.batch,
          invoice_number: expense.invoiceNumber,
          amount: expense.amount,
          proof_of_payment: attachment,
          description: expense.description
        }, { user, resourceId: 'expense_id' })
          .then(resolve)
          .catch(reject);
      });
    }).catch((e) => {
      console.log(e); // todo: add proper logger
      return {
        error: 'Unable to process request. Please try again later!',
        status: 500
      };
    });
  }
}

module.exports = new Controller();
