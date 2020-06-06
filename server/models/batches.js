
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
      animal_category_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      animal_breed_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      initial_stock_count: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      mortality_count: {
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
    House, Supplier, Source, Breed
  }) {
    Batches.house = Batches.belongsTo(House);
    Batches.supplier = Batches.belongsTo(Supplier);
    Batches.source = Batches.belongsTo(Source);
    Batches.bread = Batches.belongsTo(Breed);
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
