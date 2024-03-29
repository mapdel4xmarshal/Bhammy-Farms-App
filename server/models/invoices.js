
const { Model, DataTypes } = require('sequelize');

class Invoices extends Model {
  static get tblName() {
    return 'invoices';
  }

  static get modelName() {
    return 'Invoice';
  }

  static get schema() {
    return {
      invoice_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      invoice_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      payment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      payment_status: {
        type: DataTypes.ENUM(['paid', 'unpaid', 'partial']),
        allowNull: false
      },
      fulfilment_status: {
        type: DataTypes.ENUM(['Fulfilled', 'Partially fulfilled', 'Unfulfilled']),
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      stamp: {
        type: DataTypes.TEXT('long'),
        allowNull: true
      }
    };
  }

  static associate({
    InvoiceItem, Item, Customer, Location
  }) {
    Invoices.items = Invoices.belongsToMany(Item, { through: InvoiceItem, foreignKey: 'invoice_id' });
    Invoices.customer = Invoices.belongsTo(Customer, { through: InvoiceItem, foreignKey: 'customer_id' });
    Invoices.location = Invoices.belongsTo(Location, { foreignKey: 'location_id' });
  }
}

module.exports = (sequelize) => {
  Invoices.init(Invoices.schema, {
    sequelize,
    modelName: Invoices.modelName,
    tableName: Invoices.tblName,
    underscored: true
  });

  return Invoices;
};
