class BatchProduction {
  constructor(production) {
    this._production = production;
    this.items = production.Items;
    return this._production;
  }

  get items() {
    return this._production.items;
  }

  set items(productionItems) {
    this._production.items = productionItems.map(item => {  console.log(item, item.quantity);
      item.quantity = item.ProductionItem.quantity;
      item.price = item.ProductionItem.price;
      delete item.ProductionItem;
      return item;
    });

    delete this._production.Items;
  }
}

module.exports = BatchProduction;
