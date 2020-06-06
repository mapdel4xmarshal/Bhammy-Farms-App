const Location = require('../../models/house');

class Controller {
  async getLocations() {
    return Location.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
      .then((locations) => locations);
  }

  async getLocationById(locationId) {
    return Location.findOne({ where: { id: locationId }, attributes: { exclude: ['createdAt', 'updatedAt'] } })
      .then((location) => location);
  }
}

module.exports = new Controller();
