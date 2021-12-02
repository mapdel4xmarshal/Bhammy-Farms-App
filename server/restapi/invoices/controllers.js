const {
  Invoice: InvoiceModel,
  Customer,
  Item,
  InvoiceItem,
  Party,
  ItemConsumption,
  sequelize,
  Sequelize: {
    Op,
    col,
    fn,
    literal
  },
  Location
} = require('../../models');
const Invoice = require('./invoice');
const InvoiceDetail = require('./invoiceDetail');
const Bot = require('./Bot');
const damagedItemsControllers = require('../damagedItems/controllers');

class Controller {
  constructor() {
    new Bot(this).listen();
  }

  async getInvoices({
    before,
    after,
    paymentStatus,
    date
  }) {
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
      order: [['invoice_date', 'DESC'], ['created_at', 'DESC']],
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

  async addInvoices(user, invoices, damagedItems) {
    const transaction = await sequelize.transaction();

    for (const invoice of invoices) {
      const response = await this.addInvoice(user, invoice, transaction);
      if (response.error) {
        transaction.rollback();
        throw { msg: response.error };
      }
    }

    if (damagedItems) {
      for (const damagedItem of damagedItems) {
        const response = await damagedItemsControllers.addDamagedItem(user, damagedItem, transaction);
        if (response.error) {
          transaction.rollback();
          throw { msg: response.error };
        }
      }
    }

    return transaction.commit();
  }

  async addInvoice(user, invoice, trnx) {
    const transaction = trnx || await sequelize.transaction();

    const validCustomer = await Customer.count({
      where: {
        customer_id: invoice.customerId
      },
      transaction
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

    const itemPriceMap = await Item.findAll({
      attributes: ['item_id', 'price', 'packaging_size', 'item_name', 'quantity', 'unit'],
      where: {
        item_id: {
          [Op.in]: invoice.items.map((item) => item.id)
        }
      }
    })
      .then((items) => new Map(items.map((item) => [item.item_id, item])));

    for (const item of invoice.items) {
      const stockItem = itemPriceMap.get(item.id);
      if (stockItem.quantity < item.quantity) {
        return {
          error: `Not enough *${stockItem.item_name}* (${stockItem.quantity}${stockItem.unit
          }) in the store. Please restock and try again.`,
          status: 400
        };
      }
    }

    const normalizedInvoice = new Invoice(invoice);

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

        if (!trnx) transaction.commit();
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

  async getInvoiceById(invoiceId, transaction) {
    return InvoiceModel.findByPk(invoiceId, {
      attributes: [['invoice_id', 'id'],
        [fn('date_format', col('invoice_date'), '%Y-%m-%d'), 'invoiceDate'],
        [fn('date_format', col('payment_date'), '%Y-%m-%d'), 'paymentDate'],
        [col('Location.name'), 'farmLocation'],
        ['customer_id', 'customerId'], ['payment_status', 'paymentStatus'], ['fulfilment_status', 'fulfilmentStatus'],
        'amount', 'discount', 'notes'],
      order: [['invoice_id', 'DESC'], ['created_at', 'DESC']],
      include: [
        {
          model: Item,
          through: InvoiceItem
        },
        {
          model: Customer,
          include: [{
            model: Party
          }]
        }, {
          model: Location,
          attributes: []
        }],
      ...(transaction && { transaction })
    })
      .then((invoice) => (invoice ? new InvoiceDetail(invoice.toJSON()) : {
        status: 404,
        message: 'Invoice not found.'
      }))
      .catch((error) => {
        console.log(error); // todo: add proper logger
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async getInvoicesSummary({
    before,
    after,
    date,
    paymentStatus
  }) {
    const where = [];
    if (date) where.push(`invoices.invoice_date = '${date}'`);
    if (before) where.push(`invoices.invoice_date <= '${before}'`);
    if (after) where.push(`invoices.invoice_date >= '${after}'`);
    if (paymentStatus) where.push(`invoices. >= '${date}'`);

    const clause = where.length > 0 ? `where ${where.join(' AND ')}` : '';

    return sequelize.query(`
      SELECT items.item_name AS itemName, SUM(invoice_items.quantity) AS quantity, items.image AS thumbnail,
      SUM(((invoice_items.quantity / items.packaging_size) * invoice_items.item_price) - invoice_items.discount) AS itemAmount,
      invoice_items.item_id AS itemId, items.unit, items.packaging_size AS packagingSize,
      items.packaging_metric AS packagingMetric FROM invoices
      JOIN invoice_items ON invoices.invoice_id = invoice_items.invoice_id
      JOIN items ON invoice_items.item_id = items.item_id
      ${clause} group by invoice_items.item_id;
    `)
      .then(([summary,]) => summary);
  }

  async deleteInvoicesById(user, invoices, damagedItems) {
    const transaction = await sequelize.transaction();

    for (const invoice of invoices) {
      const response = await this.deleteInvoiceById(invoice, user, transaction);

      if (response.error) throw { msg: response.error };
    }

    for (const damagedItem of damagedItems) {
      const response = await damagedItemsControllers.deleteDamagedItemById(user, damagedItem, transaction);

      if (response.error) throw { msg: response.error };
    }

    transaction.commit();
  }

  async deleteInvoiceById(id, user, trnx) {
    const transaction = trnx || await sequelize.transaction();
    const invoice = await this.getInvoiceById(id);

    if (!invoice) {
      return {
        error: `No invoice found with id ${id}`,
        status: 400
      };
    }

    // Reverse invoice items
    for (const item of invoice.items) {
      await Item.increment('quantity', {
        by: Number(item.quantity),
        where: { item_id: item.id },
        transaction,
        user,
        resourceId: 'item_id'
      });
    }

    // Delete consumption
    await ItemConsumption.destroy({
      where: {
        consumer_id: id,
        consumer: 'InvoiceItem'
      },
      transaction
    });

    // Delete invoice
    await InvoiceModel.destroy({
      where: {
        invoice_id: id
      },
      transaction
    });

    if (!trnx) await transaction.commit();

    return {
      status: 200,
      message: `invoice ${id} deleted successfully`
    };
  }
}

module.exports = new Controller();
