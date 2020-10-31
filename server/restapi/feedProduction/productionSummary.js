class ProductionSummary {
  constructor(productions) {
    this.summary = productions;
    return this.summary;
  }

  get summary() {
    return this._summary;
  }

  set summary(productions) {
    const uniqueIngredients = new Map();
    const productionByType = new Map();

    let totalAmount = 0;
    let totalQuantity = 0;

    productions.forEach(async (production) => {
      totalAmount += production.summary.totalAmount;
      totalQuantity += production.summary.quantity;

      if (!productionByType.has(production.type.id)) {
        productionByType.set(production.type.id, {
          name: production.type.name,
          quantity: 0,
          totalAmount: 0
        });
      }

      const productionType = productionByType.get(production.type.id);
      productionType.quantity += production.summary.quantity;
      productionType.totalAmount += production.summary.totalAmount;

      production.ingredients.forEach((ingredient) => {
        if (!uniqueIngredients.has(ingredient.id)) {
          uniqueIngredients.set(ingredient.id, ingredient);
          ingredient.minPrice = ingredient.price;
          ingredient.maxPrice = ingredient.price;
        } else {
          const unique = uniqueIngredients.get(ingredient.id);
          unique.quantity += ingredient.quantity;
          unique.minPrice = Math.min(+ingredient.price, unique.minPrice || ingredient.price);
          unique.maxPrice = Math.max(+ingredient.price, unique.maxPrice || 0);
        }
      });
    });
    this._summary = {
      totalAmount,
      totalQuantity,
      feeds: Array.from(productionByType.values()),
      ingredients: Array.from(uniqueIngredients.values())
    };
  }
}

module.exports = ProductionSummary;
