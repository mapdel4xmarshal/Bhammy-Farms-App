const { Model, DataTypes } = require('sequelize');

class BankDetails extends Model {
  static get tblName() {
    return 'bank_details';
  }

  static get modelName() {
    return 'BankDetail';
  }

  static get schema() {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      account_number: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      account_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      bank_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      bank_code: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      intermediary_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      verified: {
        type: DataTypes.BOOLEAN,
        default: false
      }
    };
  }

  static associate({ Employee }) {
    BankDetails.employee = BankDetails.belongsTo(Employee, { foreignKey: 'id' });
  }
}

module.exports = (sequelize) => {
  BankDetails.init(BankDetails.schema, {
    sequelize,
    modelName: BankDetails.modelName,
    tableName: BankDetails.tblName,
    underscored: true
  });

  return BankDetails;
};
