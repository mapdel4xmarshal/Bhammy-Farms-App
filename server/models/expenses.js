
const { Model, DataTypes } = require('sequelize');

class Expenses extends Model {
  static get tblName() {
    return 'Expenses';
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
        type: DataTypes.DATE,
        allowNull: false
      },
      category: {
        type: DataTypes.ENUM('Purchase', 'Service'),
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      invoice_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      proof_of_payment: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    };
  }

  static associate({
    ExpenseType, Supplier, Location, House, Batch
  }) {
    Expenses.location = Expenses.belongsTo(Location, { foreignKey: 'location_id' });
    Expenses.house = Expenses.belongsTo(House, { foreignKey: 'house_id' });
    Expenses.batch = Expenses.belongsTo(Batch, { foreignKey: 'batch_id' });
    Expenses.type = Expenses.belongsTo(ExpenseType, { foreignKey: 'expense_type_id' });
    Expenses.supplier = Expenses.belongsTo(Supplier, { foreignKey: 'supplier_id' });
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
