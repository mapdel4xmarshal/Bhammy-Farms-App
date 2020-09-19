class InvoiceDetail {
  constructor(_invoice) {
    this._invoice = _invoice;
    const { Items, Customer, ...detail } = this._invoice;

    detail.amount = +detail.amount;
    detail.discount = +detail.discount;

    return {
      ...detail,
      items: this.items,
      customer: this.customer,
    }
  }

  get items() {
    return this._invoice.Items.map((item) => {
      return {
        id: item.item_id,
        name: item.item_name,
        category: item.category,
        brand: item.brand,
        packagingSize: +item.packaging_size,
        packagingMetric: item.packaging_metric,
        unit: item.unit,
        thumbnail: item.image,
        quantity: +item.InvoiceItem.quantity,
        price: +item.InvoiceItem.item_price,
        discount: +item.InvoiceItem.discount
      }
    });
  }

  get customer() {
    const customer = this._invoice.Customer;
    return {
      id: customer.customer_id,
      name: customer.Party.name,
      address: customer.Party.address,
      state: customer.Party.state,
      phone: customer.Party.phone
    };
  }
}

module.exports = InvoiceDetail;
