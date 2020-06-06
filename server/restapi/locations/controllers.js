const { location } = require('../../models');

class Controller {
  async getLocations() {
    return location.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, include: [location.houses] })
      .then((locations) => locations);
  }

  async getLocationById(locationId) {
    return location.findOne({ where: { id: locationId }, attributes: { exclude: ['createdAt', 'updatedAt'] } })
      .then((location) => location);
  }
}

module.exports = new Controller();
