const { House } = require('../../models');

class Controller {
  async getHouses() {
    return House.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
      .then((houses) => houses);
  }

  async getHouseById(houseId) {
    return House.findOne({ where: { id: houseId }, attributes: { exclude: ['createdAt', 'updatedAt'] } })
      .then((house) => house);
  }
}

module.exports = new Controller();
