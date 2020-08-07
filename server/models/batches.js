
const { Model, DataTypes } = require('sequelize');

class Batches extends Model {
  static get tblName() {
    return 'batches';
  }

  static get modelName() {
    return 'Batch';
  }

  static get schema() {
    return {
      batch_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING
      },
      move_in_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      move_out_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      move_in_age: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        comment: 'Move in age in weeks'
      },
      initial_stock_count: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      cost_per_unit: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total_cost: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING
      },
      is_active: {
        type: DataTypes.TINYINT,
        defaults: 1
      }
    };
  }

  static associate({
    House, Supplier, Source, Breed, Production
  }) {
    Batches.house = Batches.belongsTo(House, { foreignKey: 'house_id' });
    Batches.supplier = Batches.belongsTo(Supplier, { foreignKey: 'supplier_id' });
    Batches.source = Batches.belongsTo(Source, { foreignKey: 'source_id' });
    Batches.bread = Batches.belongsTo(Breed, { foreignKey: 'breed_id' });
    Batches.production = Batches.hasMany(Production, { foreignKey: 'batch_id' });
  }
}

module.exports = (sequelize) => {
  Batches.init(Batches.schema, {
    sequelize,
    modelName: Batches.modelName,
    tableName: Batches.tblName,
    underscored: true
  });

  return Batches;
};
