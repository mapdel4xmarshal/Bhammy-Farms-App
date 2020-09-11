const {
  Invoice: InvoiceModel, Customer, Item, InvoiceItem, Party, sequelize, Sequelize: {
    Op, col, fn, literal
  }, Location
} = require('../../models');
const Invoice = require('./invoice');

class Controller {
  async getInvoices({ before, after, paymentStatus, date }) {
    const where = {};
    if (before || after) where.invoice_date = {};
    if (date) where.invoice_date = date;
    if (before) where.invoice_date[Op.lte] = before;
    if (after) where.invoice_date[Op.gte] = after;
    if (paymentStatus) where.payment_status = paymentStatus;

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
        include: [{
          model: Party,
          attributes: []
        }],
        attributes: []
      }, {
        model: Location,
        attributes: []
      }]
    })
      .then((invoices) => invoices);
  }


  async addInvoice(user, invoice) {
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

    const transaction = await sequelize.transaction();

    return InvoiceModel.create({
      ...normalizedInvoice.toDBFormat()
    }, {
      user,
      resourceId: 'invoice_id',
      transaction
    })
      .then(async (newInvoice) => {
        const invoiceItems = normalizedInvoice.formatItems(newInvoice.invoice_id);
        await InvoiceItem.bulkCreate(invoiceItems,
          {
            user,
            resourceId: 'invoice_id',
            transaction
          });

        for (const item of invoiceItems) {
          await Item.decrement('quantity', {
            by: item.quantity,
            where: { item_id: item.item_id },
            transaction,
            user,
            resourceId: 'item_id'
          });
        }
        transaction.commit();
        return newInvoice.invoice_id;
      })
      .catch((error) => {
        transaction.rollback();
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

  async getInvoicesSummary({ before, after, date, paymentStatus }) {
    let where = [];
    if (date) where.push(`invoices.invoice_date = '${date}'`);
    if (before) where.push(`invoices.invoice_date <= '${before}'`);
    if (after) where.push(`invoices.invoice_date >= '${after}'`);
    if (paymentStatus) where.push(`invoices. >= '${date}'`);

    const clause = where.length > 0? `where ${where.join(' AND ')}` : '';

    return sequelize.query(`
      SELECT items.item_name AS itemName, SUM(invoice_items.quantity) AS quantity, items.image AS thumbnail, 
      SUM(((invoice_items.quantity  / items.size) * invoice_items.item_price) - invoice_items.discount) AS itemAmount,
      invoice_items.item_id AS itemId, items.unit FROM invoices
      JOIN invoice_items ON invoices.invoice_id = invoice_items.invoice_id
      JOIN items ON invoice_items.item_id = items.item_id
      ${clause} group by invoice_items.item_id;
    `)
      .then(([summary,]) => {
        return summary;
      });
  }
}

module.exports = new Controller();
