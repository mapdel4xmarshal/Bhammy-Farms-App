const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const config = require('../configs');

const db = {};

let sequelize;

sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPass, {
  dialect: 'mysql',
  host: config.dbHost,
  define: {
    underscored: true
  },
  logging: false
});

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = require(`./${file}`)(sequelize);
    db[model.modelName] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }

  if (db[modelName].hooks) {
    db[modelName].hooks(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.sync({ force: false, alter: false });

module.exports = db;
