const { Location, House } = require('../../models');

class Controller {
  async getLocations() {
    return Location.findAll({
      attributes: [['location_id', 'id'], 'address', 'state', 'name', 'phone', ['alt_phone', 'altPhone']],
      include: [{
        model: House,
        as: 'houses',
        attributes: [['house_id', 'id'], 'name', 'type', 'capacity']
      }],
      order: [['name', 'ASC']]
    })
      .then((locations) => locations);
  }

  async getLocationById(locationId) {
    return Location.findOne({
      where: { id: locationId },
      attributes: [['location_id', 'id'], 'address', 'state', 'name', 'phone', ['alt_phone', 'altPhone']],
      include: [{
        model: House,
        as: 'houses',
        attributes: [['house_id', 'id'], 'name', 'type', 'capacity']
      }]
    })
      .then((location) => location);
  }                                                                                                                                      /**/
}

module.exports = new Controller();

