class ProductionRecord {
  constructor(production, millingCostPerKg) {
    this._millingCostPerKg = millingCostPerKg;
    this._production = {};
    this._production.id = production.id;
    this._production.date = production.date;
    this._production.energyLevel = production.energyLevel;
    this._production.type = production.type;
    this._production.note = production.note;
    this.ingredients = production.Items;

    this.concentrate = this.ingredients
      .filter((item) => {
        if (item.name.includes('concentrate') || item.category.includes('concentrate')) return item;
      });

    this.wheatOffal = this.ingredients
      .filter((item) => item.name.toLowerCase()
        .includes('wheat') || item.category.toLowerCase()
        .includes('wheat'));

    this.maize = this.ingredients
      .filter((item) => item.name.toLowerCase().includes('maize')
        || item.category.toLowerCase().includes('maize')
        || item.name.toLowerCase().includes('corn'));

    this.toxinBinder = this.ingredients
      .filter((item) => item.name.toLowerCase().includes('toxin binder')
        || item.category.toLowerCase().includes('toxin binder')
        || item.name.toLowerCase().includes('toxinbinder'));

    this.summary = this.ingredients;

    return this._production;
  }

  get summary() {
    return this._production.summary;
  }

  set summary(ingredients) {
    this._production.summary = { totalAmount: 0, quantity: 0 };
    ingredients.forEach((ingredient) => {
      this._production.summary.totalAmount += (ingredient.price * (ingredient.quantity / ingredient.packagingSize));
      this._production.summary.quantity += ingredient.quantity;
    });

    // Include milling cost
    this._production.summary.totalAmount += (this._millingCostPerKg * this._production.summary.quantity);

    this._production.summary.costPerUnit = Math
      .ceil(this._production.summary.totalAmount / this._production.summary.quantity);
  }

  get ingredients() {
    return this._production.ingredients;
  }

  set ingredients(ingredients) {
    this._production.ingredients = ingredients.map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      category: ingredient.category,
      packagingSize: ingredient.packagingSize,
      unit: ingredient.unit,
      thumbnail: ingredient.image,
      quantity: +ingredient.FeedProductionItem.quantity,
      price: +ingredient.FeedProductionItem.price,
      qtyUsed: +ingredient.FeedProductionItem.quantity
    }));
  }

  get toxinBinder() {
    return this._production.toxinBinder;
  }

  set toxinBinder(value) {
    this._production.toxinBinder = { quantity: 0, amount: 0 };
    value.forEach((toxinBinder) => {
      this._production.toxinBinder.quantity += toxinBinder.quantity;
      this._production.toxinBinder.amount += (toxinBinder.price * toxinBinder.quantity);
      this._production.toxinBinder.unit = toxinBinder.unit;
    });
  }

  get maize() {
    return this._production.maize;
  }

  set maize(value) {
    this._production.maize = { quantity: 0, amount: 0 };
    value.forEach((maize) => {
      this._production.maize.quantity += maize.quantity;
      this._production.maize.amount += (maize.price * maize.quantity);
      this._production.maize.unit = maize.unit;
    });
  }

  get wheatOffal() {
    return this._production.wheatOffal;
  }

  set wheatOffal(value) {
    this._production.wheatOffal = { quantity: 0, amount: 0 };
    value.forEach((wheatOffal) => {
      this._production.wheatOffal.quantity += wheatOffal.quantity;
      this._production.wheatOffal.amount += (wheatOffal.price * wheatOffal.quantity);
      this._production.wheatOffal.unit = wheatOffal.unit;
    });
  }

  get concentrate() {
    return this._production.concentrate;
  }

  set concentrate(value) {
    this._production.concentrate = { quantity: 0, amount: 0 };
    value.forEach((concentrate) => {
      this._production.concentrate.quantity += concentrate.quantity;
      this._production.concentrate.amount += (concentrate.price * concentrate.quantity);
      this._production.concentrate.unit = concentrate.unit;
    });
  }
}

module.exports = ProductionRecord;
