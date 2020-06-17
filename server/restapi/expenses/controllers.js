const Expenses = require('../../models');

class Controller {
  async getExpenses() {
    return Expenses.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
      .then((expenses) => expenses);
  }

  async getExpenseById(expenseId) {
    return Expenses.findOne({ where: { id: expenseId }, attributes: { exclude: ['createdAt', 'updatedAt'] } })
      .then((expense) => expense);
  }

  async addExpense(expense) {
    return Expenses.create({
      date: expense.date,
      category: expense.category,
      quantity: expense.quantity,
      invoice_number: expense.referenceId,
      amount: expense.totalAmount,
      proof_of_payment: expense.attachment,
      description: expense.description,
    })
      .then((expense) => expense.expense_id)
      .catch(error => {
        console.log(error); // todo: add proper logger
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }
}

module.exports = new Controller();
