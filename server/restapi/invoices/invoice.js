class Invoice {
  constructor(invoice) {
    if (!invoice) throw 'invoice is required!';
    if (!invoice.items || invoice.items.length === 0) throw 'At least one invoice item is required!';
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
      location_id: this._rawInvoice.farmLocation,
      amount: this.amount,
      discount: this.discount,
      notes: this._rawInvoice.notes || '',
      stamp: this._rawInvoice.stamp || null
    };
  }

  formatItems(invoiceId) {
    return this._rawInvoice.items.map((item) => ({
      item_id: item.id,
      invoice_id: invoiceId,
      item_price: item.price,
      quantity: item.quantity,
      discount: item.discount
    }));
  }

  _calculate() {
    this.amount = 0;
    this.discount = 0;
    this._rawInvoice.items.forEach((item) => {
      this.amount += (+item.amount);
      this.discount += (+item.discount);
    });
  }
}

module.exports = Invoice;
