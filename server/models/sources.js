'use strict';

const { Model, DataTypes } = require('sequelize');

class Sources extends Model {
  static get tblName() {
    return 'source';
  }

  static get modelName() {
    return 'Source';
  }

  static get schema() {
    return {
      source_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: false
      }
    };
  }

  static associate({ Party }) {
    Sources.party = Sources.belongsTo(Party, { foreignKey: 'party_id'});
  }
}

module.exports = (sequelize) => {
  Sources.init(Sources.schema, {
    sequelize,
    modelName: Sources.modelName,
    tableName: Sources.tblName,
    underscored: true
  });

  return Sources;
};
