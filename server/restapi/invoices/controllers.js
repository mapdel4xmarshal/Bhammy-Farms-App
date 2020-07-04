
const { Invoice, Customer } = require('../../models');

class Controller {
  async getInvoices() {
    return Invoice.findAll({
      attributes: [['invoice_id', 'id'], ['invoice_date', 'invoiceDate'], ['payment_date', 'paymentDate'],
        ['customer_id', 'customerId'], ['payment_status', 'paymentStatus'], ['fulfilment_status', 'fulfilmentStatus'],
      'amount', 'discount', 'notes'],
      order: [['invoice_id', 'DESC'], ['created_at', 'DESC']]
    })
      .then((breeds) => breeds);
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

    return Customer.create({
      name: `${farm.name}-${(batchCount + 1).toString()
        .padStart(3, '0')}`,
      move_in_date: new Date(batch.moveInDate),
      move_out_date: moveOutDate,
      move_in_age: batch.initialAge,
      animal_category_id: 1,
      breed_id: batch.breedId,
      initial_stock_count: batch.initialStock,
      mortality_count: batch.initialStock - batch.currentStock,
      supplier_id: batch.supplierId,
      source_id: batch.sourceId,
      cost_per_unit: batch.costPerBird,
      total_cost: batch.amount,
      description: batch.note,
      is_active: moveOutDate > new Date(),
      house_id: batch.houseId
    })
      .then((newBatch) => newBatch.batch_id)
      .catch((error) => {
        console.log(error); // todo: add proper logger
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async getInvoiceById(invoiceId) {
    return Invoice.findOne({
      where: { invoice_id: invoiceId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
      .then((invoice) => invoice.invoice_id);
  }
}

module.exports = new Controller();
