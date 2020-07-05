class Invoice {
  constructor(invoice) {
    if (!invoice) throw 'invoice is required!';
    if(!invoice.items || invoice.items.length === 0) throw 'At least one invoice item is required!';
    this._rawInvoice = invoice;
    this.amount = 0;
    this.discount = 0;
    this._calculate();
  }

  toDBFormat() {
    return {
      invoice_date: this._rawInvoice.invoiceDate,
      payment_date: this._rawInvoice.paymentDate,
      customer_id: this._rawInvoice.customerId,
      payment_status: this._rawInvoice.paymentStatus,
      fulfilment_status: this._rawInvoice.fulfilmentStatus,
      amount: this.amount,
      discount: this.discount,
      notes: this._rawInvoice.notes || ''
    };
  }

  formatItems(invoiceId) {
    return this._rawInvoice.items.map(item => {
      return {
        item_id: item.id,
        invoice_id: invoiceId,
        item_price: item.price,
        quantity: item.quantity,
        discount: item.discount
      };
    });
  }

  _calculate() {
    this.amount = 0;
    this._rawInvoice.items.forEach(item => {
      this.amount += item.price;
      this.discount += item.discount;
    });

    this.amount -= this.discount;
  }
}

module.exports = Invoice;
