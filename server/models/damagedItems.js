
const { Model, DataTypes } = require('sequelize');

class DamagedItems extends Model {
  static get tblName() {
    return 'damaged_items';
  }

  static get modelName() {
    return 'DamagedItems';
  }

  static get schema() {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      quantity: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    };
  }
}

module.exports = (sequelize) => {
  DamagedItems.init(DamagedItems.schema, {
    sequelize,
    modelName: DamagedItems.modelName,
    tableName: DamagedItems.tblName
  });

  return DamagedItems;
};
