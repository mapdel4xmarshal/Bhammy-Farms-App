
const { Model, DataTypes } = require('sequelize');

class Breeds extends Model {
  static get tblName() {
    return 'breeds';
  }

  static get modelName() {
    return 'Breed';
  }

  static get schema() {
    return {
      breed_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      category: {
        type: DataTypes.ENUM('bird', 'fish'),
        allowNull: false
      }
    };
  }
}

module.exports = (sequelize) => {
  Breeds.init(Breeds.schema, {
    sequelize,
    modelName: Breeds.modelName,
    tableName: Breeds.tblName,
    underscored: true
  });

  return Breeds;
};
