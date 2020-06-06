const { Sequelize } = require('sequelize');
const config = require('../configs');

const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPass, {
  dialect: 'mysql',
  define: {
    underscored: true
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.batch = require('./batch.js')(sequelize);
db.house = require('./house.js')(sequelize);
db.location = require('./location.js')(sequelize);

// Relations
db.location.houses = db.location.hasMany(db.house);
db.house.batches = db.house.hasMany(db.batch);
db.batch.house = db.batch.belongsTo(db.house);

sequelize.sync({ force: true })
  .then(() => {
    db.location.count()
      .then((count) => {
        if (count === 0) {
          db.location.bulkCreate([
            {
              name: 'Ajegunle',
              address: 'Bhammy Farms, Off Asa-dam',
              state: 'Ilorin',
              phone: '08073290177',
              houses: [{
                name: 'AJG-P001',
                capacity: 4000,
                type: 'Pen'
              }]
            },
            {
              name: 'Oloko',
              address: 'Bhammy Farms, Oloko Village',
              state: 'Ilorin',
              phone: '08073290177',
              houses: [
                {
                  name: 'OLO-P001',
                  capacity: 4000,
                  type: 'Pen'
                },
                {
                  name: 'OLO-B001',
                  capacity: 4500,
                  type: 'Brooding'
                }
              ]
            }
          ], {
            include: [db.location.houses]
          });
        }
      });
  });

module.exports = db;
