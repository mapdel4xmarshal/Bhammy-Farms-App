const { Invoice: InvoiceModel, Customer, InvoiceItem, Party, Sequelize, Location } = require('../../models');
const Invoice = require('./invoice');

class Controller {
  async getInvoices() {
    return InvoiceModel.findAll({
      attributes: [['invoice_id', 'id'],
        [Sequelize.fn('date_format', Sequelize.col('invoice_date'), '%Y-%m-%d'), 'invoiceDate'],
        [Sequelize.fn('date_format', Sequelize.col('payment_date'), '%Y-%m-%d'), 'paymentDate'],
        [Sequelize.col('Location.name'), 'farmLocation'],
        ['customer_id', 'customerId'], ['payment_status', 'paymentStatus'], ['fulfilment_status', 'fulfilmentStatus'],
        [Sequelize.literal('CONCAT(Customer.title, " ", `Customer->Party`.name)'), 'customerName'], 'amount', 'discount', 'notes'],
      order: [['invoice_id', 'DESC'], ['created_at', 'DESC']],
      raw: true,
      include: [{
        model: Customer,
        include: [{ model: Party, attributes: [] }],
        attributes: []
      }, { model: Location, attributes: [] }]
    })
      .then((invoices) => invoices);
  }


  async addInvoice(invoice) {
    console.log(invoice);
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

    const normalizedInvoice = new Invoice(invoice); console.log("normalizedInvoice.toDBFormat()",normalizedInvoice.toDBFormat());

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
