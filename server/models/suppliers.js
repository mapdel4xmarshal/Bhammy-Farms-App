
const { Model, DataTypes } = require('sequelize');

class Suppliers extends Model {
  static get tblName() {
    return 'suppliers';
  }

  static get modelName() {
    return 'Supplier';
  }

  static get schema() {
    return {
      supplier_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: false
      }
    };
  }

  static association({ parties }) {
    Suppliers.parties = Suppliers.belongsTo(parties);
  }
}

module.exports = (sequelize) => {
  Suppliers.init(Suppliers.schema, {
    sequelize,
    modelName: Suppliers.modelName,
    tableName: Suppliers.tblName,
    underscored: true
  });

  return Suppliers;
};
