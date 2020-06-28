
const { Model, DataTypes } = require('sequelize');

class Customers extends Model {
  static get tblName() {
    return 'Customers';
  }

  static get modelName() {
    return 'Customer';
  }

  static get schema() {
    return {
      customer_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Unknown'),
        allowNull: false
      },
      rating: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      comment: {
        type: DataTypes.STRING
      }
    };
  }

  static associate({ Party }) {
    Customers.party = Customers.belongsTo(Party, { foreignKey: 'customer_id' });
  }
}

module.exports = (sequelize) => {
  Customers.init(Customers.schema, {
    sequelize,
    modelName: Customers.modelName,
    tableName: Customers.tblName,
    underscored: true
  });

  return Customers;
};
