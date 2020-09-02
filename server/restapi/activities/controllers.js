
const { Activity, Sequelize, Location } = require('../../models');

class Controller {
  async getActivities() {
    return Activity.findAll({
      attributes: [
        ['activity_id', 'id'],
        [Sequelize.fn('date_format', Sequelize.col('activity_date'), '%Y-%m-%d'), 'date'],
        ['location_id', 'farmId'], ['batch_id', 'batchId'], ['house_id', 'houseId'], 'category', 'description'
      ],
      include: [{ model: Location, as: 'location', attributes: ['location_id', 'name'] }],
      order: [['activity_date', 'DESC'], ['category', 'ASC']],
    })
      .then((batch) => batch);
  }

  async addActivity(user, activity) {
    return Activity.create({
      category: activity.category,
      location_id: activity.farm,
      batch_id: activity.batch,
      house_id: activity.pen,
      activity_date: activity.date,
      description: activity.description
    }, { user, resourceId: 'activity_id' })
      .then((newActivity) => newActivity.activity_id)
      .catch((error) => {
        console.log(error); // todo: add proper logger
        return {
          error: 'Unable to process request. Please try again later!',
          status: 500
        };
      });
  }

  async getActivityById(activityId) {
    return Activity.findOne({
      where: { id: activityId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
      .then((activity) => activity);
  }
}

module.exports = new Controller();
