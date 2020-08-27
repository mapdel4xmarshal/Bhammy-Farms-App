const {
  Invoice: InvoiceModel, Customer, InvoiceItem, Party, Sequelize: { Op, col, fn, literal }, Location
} = require('../../models');
const Invoice = require('./invoice');

class Controller {
  async getInvoices({ before, after }) {  console.log(before, Op.lt)
    const where = { invoice_date: {} };
    if (before) where.invoice_date[Op.lte] = before;
    if (after) where.invoice_date[Op.gte] = after;

    return InvoiceModel.findAll({
      attributes: [['invoice_id', 'id'],
        [fn('date_format', col('invoice_date'), '%Y-%m-%d'), 'invoiceDate'],
        [fn('date_format', col('payment_date'), '%Y-%m-%d'), 'paymentDate'],
        [col('Location.name'), 'farmLocation'],
        ['customer_id', 'customerId'], ['payment_status', 'paymentStatus'], ['fulfilment_status', 'fulfilmentStatus'],
        [literal('`Customer->Party`.name'), 'customerName'], 'amount', 'discount', 'notes'],
      order: [['invoice_id', 'DESC'], ['created_at', 'DESC']],
      raw: true,
      where,
      include: [{
        model: Customer,
        include: [{ model: Party, attributes: [] }],
        attributes: []
      }, { model: Location, attributes: [] }]
    })
      .then((invoices) => invoices);
  }


  async addInvoice(invoice) {
    const validCustomer = await Customer.count({
      where: {
        customer_id: invoice.customerId
      }
    });

    if (validCustomer === 0) {
      return {
        error: 'No customer found matching the specified id. '
          + 'Please specify a valid customerId and try again!',
        status: 400
      };
    }

    if (!invoice.items || invoice.items.length === 0) {
      return {
        error: 'At least on item is required. Please specify an item and try again!',
        status: 400
      };
    }

    const normalizedInvoice = new Invoice(invoice);

    return InvoiceModel.create({
      ...normalizedInvoice.toDBFormat()
    })
      .then(async (newInvoice) => {
        await InvoiceItem.bulkCreate(normalizedInvoice.formatItems(newInvoice.invoice_id));
        return newInvoice.invoice_id;
      })
      .catch((error) => {
        console.log(error); // todo: add proper logger
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async getInvoiceById(invoiceId) {
    return InvoiceModel.findOne({
      where: { invoice_id: invoiceId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
      .then((invoice) => invoice.invoice_id);
  }
}

module.exports = new Controller();
