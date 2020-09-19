const path = require('path');
const formidable = require('formidable');
const {
  Expense, ExpenseType, Sequelize, sequelize, Batch, Location, House, Item
} = require('../../models');
const { fileUploadPath } = require('../../configs');

class Controller {
  async getExpenses({
                      type: name, category, after, before, date
                    }) {
    const where = {};
    const
      expenseTypeWhere = {};
    if (category) where.category = category;
    if (name) expenseTypeWhere.name = name;
    if (before || after) where.date = {};
    if (before) where.date[Sequelize.Op.lte] = before;
    if (after) where.date[Sequelize.Op.gte] = after;
    if (date) where.date = date;

    return Expense.findAll({
      attributes: [
        [Sequelize.literal('Item.item_id'), 'item'],
        [Sequelize.literal('Item.item_name'), 'itemName'],
        [Sequelize.literal('ExpenseType.expense_type_id'), 'type'],
        [Sequelize.literal('Batch.batch_id'), 'batch'],
        [Sequelize.literal('Batch.name'), 'batchName'],
        [Sequelize.literal('House.house_id'), 'house'],
        [Sequelize.literal('House.name'), 'houseName'],
        [Sequelize.literal('Location.location_id'), 'farm'],
        [Sequelize.literal('Location.name'), 'farmName'],
        ['expense_id', 'id'], [Sequelize.fn('date_format', Sequelize.col('date'), '%Y-%m-%d'), 'date'],
        'category', 'quantity', 'price', 'provider', ['invoice_number', 'invoiceNumber'], 'amount',
        ['proof_of_payment', 'attachment'], 'description'
      ],
      order: [
        ['date', 'DESC'],
      ],
      include: [{
        model: Item,
        attributes: []
      },
        {
          model: ExpenseType,
          attributes: [],
          required: false,
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

    const transaction = await sequelize.transaction();

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, expense, files) => {
        if (err) reject(err);

        const attachment = files.attachment ? files.attachment.path.replace(`${fileUploadPath}${path.sep}`, '') : null;
        let expenseData = {
          date: expense.date,
          category: expense.category,
          location_id: expense.farm,
          house_id: expense.house,
          batch_id: expense.batch,
          invoice_number: expense.invoiceNumber,
          amount: expense.amount,
          proof_of_payment: attachment,
          description: expense.description
        };

        switch (expense.category) {
          case 'Purchase': {
            expenseData.quantity = expense.quantity;
            expenseData.item_id = !Number.isNaN(expense.item) ? expense.item : null;
            expenseData.provider = Number.isNaN(expense.item) ? expense.item : null;
            expenseData.price = expense.price;
            break;
          }
          case 'Service': {
            expenseData.provider = expense.provider;
            expenseData.expense_type_id = expense.type;
            break;
          }
          case 'Salary': {
            break;
          }
        }

        const newExpense = await Expense.create(expenseData, {
          user,
          resourceId: 'expense_id',
          transaction
        })
          .catch(reject);

        if (expenseData.item_id) {
          const item = await Item.findByPk(expenseData.item_id, { transaction })
            .catch(reject);

          await Item.update({ quantity: Number(item.quantity) + Number(expenseData.quantity) }, {
            where: { item_id: expenseData.item_id },
            user,
            resourceId: 'expense_id',
            transaction
          })
            .catch(reject);
        }
        await transaction.commit();
        resolve(newExpense);
      });
    }).catch(async (e) => {
      console.log(e); // todo: add proper logger
      await transaction.rollback();
      return {
        error: 'Unable to process request. Please try again later!',
        status: 500
      };
    });
  }

  async updateExpense(req, expense) {
    const { user } = req;

    let expenseData = {
      date: expense.date,
      category: expense.category,
      location_id: expense.farm,
      house_id: expense.house,
      batch_id: expense.batch,
      invoice_number: expense.invoiceNumber,
      amount: expense.amount,
      description: expense.description
    };

    switch (expense.category) {
      case 'Purchase': {
        expenseData.quantity = expense.quantity;
        expenseData.item_id = !Number.isNaN(expense.item) ? expense.item : null;
        expenseData.provider = Number.isNaN(expense.item) ? expense.item : null;
        expenseData.price = expense.price;
        break;
      }
      case 'Service': {
        expenseData.provider = expense.provider;
        expenseData.expense_type_id = expense.type;
        break;
      }
      case 'Salary': {
        break;
      }
    }

    const transaction = await sequelize.transaction();

    try {
      if (expenseData.item_id) {
        const oldExpense = await Expense.findByPk(expense.id, { transaction });

        await Item.decrement('quantity', {
          by: Number(oldExpense.quantity),
          where: { item_id: oldExpense.item_id },
          transaction,
          user,
          resourceId: 'item_id'
        });

        await Item.increment('quantity', {
          by: Number(expenseData.quantity),
          where: { item_id: expenseData.item_id },
          transaction,
          user,
          resourceId: 'item_id'
        });
      }

      return Expense.update(expenseData, {
        transaction,
        user,
        resourceId: 'expense_id',
        where: { expense_id: expense.id }
      })
        .then((updatedExpense) => {
          transaction.commit();
          return updatedExpense;
        });

    } catch (e) {
      console.log(e);
      await transaction.rollback();
      return {
        error: 'Unable to process request. Please try again later!',
        status: 500
      };
    }
  }
}

module.exports = new Controller();
