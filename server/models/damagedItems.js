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
      invoice_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      damage_type: {
        type: DataTypes.ENUM(['crack', 'wastage', 'expired', 'other']),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      stamp: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    };
  }

  static associate({ Location, Item }) {
    DamagedItems.location = DamagedItems.belongsTo(Location, { foreignKey: 'location_id' });
    DamagedItems.item = DamagedItems.belongsTo(Item, { foreignKey: 'item_id' });
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
