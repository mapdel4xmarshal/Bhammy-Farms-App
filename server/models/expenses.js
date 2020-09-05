
const { Model, DataTypes } = require('sequelize');

class Expenses extends Model {
  static get tblName() {
    return 'expenses';
  }

  static get modelName() {
    return 'Expense';
  }

  static get schema() {
    return {
      expense_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        uniqueItems: true,
        primaryKey: true
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      category: {
        type: DataTypes.ENUM('Purchase', 'Service', 'Salary'),
        allowNull: false
      },
      quantity: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      invoice_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      proof_of_payment: {
        type: DataTypes.STRING,
        allowNull: true
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    };
  }

  static associate({
    ExpenseType, Item, Location, House, Batch
  }) {
    Expenses.location = Expenses.belongsTo(Location, { foreignKey: 'location_id' });
    Expenses.house = Expenses.belongsTo(House, { foreignKey: { name: 'house_id', allowNull: true }, constraints: false });
    Expenses.batch = Expenses.belongsTo(Batch, { foreignKey: { name: 'batch_id', allowNull: true }, constraints: false });
    Expenses.type = Expenses.belongsTo(ExpenseType, { foreignKey: { name: 'expense_type_id', allowNull: true }, constraints: false });
    Expenses.item = Expenses.belongsTo(Item, { foreignKey: { name: 'item_id', allowNull: true }, constraints: false });
  }
}

module.exports = (sequelize) => {
  Expenses.init(Expenses.schema, {
    sequelize,
    modelName: Expenses.modelName,
    tableName: Expenses.tblName
  });

  return Expenses;
};
