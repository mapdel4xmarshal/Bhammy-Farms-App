const Activity = require('./Activity');
const { ActivityLog, sequelize } = require('../../models');

class Controller {
  constructor() {
    this.registerHooks();
  }

  registerHooks() {
    sequelize.addHook('afterCreate', (instance, options) => {
      if (options.user && options.resourceId) {
        return this.addActivity(options.user,
          new Activity('create', instance, options.resourceId), options.transaction);
      }
    });

    sequelize.addHook('afterUpdate', (instance, options) => {
      if (options.user && options.resourceId) {
        return this.addActivity(options.user,
          new Activity('update', instance, options.resourceId), options.transaction);
      }
    });

    sequelize.addHook('afterSave', (instance, options) => {
      if (options.user && options.resourceId) {
        return this.addActivity(options.user,
          new Activity('update', instance, options.resourceId), options.transaction);
      }
    });

    sequelize.addHook('afterUpsert', (instance, options) => {
      if (options.user && options.resourceId) {
        return this.addActivity(options.user,
          new Activity('update', instance, options.resourceId), options.transaction);
      }
    });

    sequelize.addHook('afterBulkCreate', (instance, options) => {
      if (options.user && options.resourceId) {
        const modelInstances = !Array.isArray(instance) ? [instance] : instance;

        return this.addActivity(options.user, modelInstances
          .map((modelInstance) => new Activity('create', modelInstance, options.resourceId)),
        options.transaction);
      }
    });
  }

  async getActivities() {
    return ActivityLog.findAll()
      .then((activities) => activities);
  }

  activity(activity, user) {
    return {
      initiator_id: user.id,
      initiator_name: user.displayName,
      operation: activity.operation,
      resource_id: activity.resourceId,
      resource: activity.resource,
      payload: activity.payload
    };
  }

  addActivity(user = {}, activities = {}, transaction) {
    if (activities.resource === 'ACTIVITY_LOG' || !activities.resourceId) return;
    let payload;
    let action = 'create';

    if (Array.isArray(activities)) {
      payload = activities.map((activity) => this.activity(activity, user));
      action = 'bulkCreate';
    } else payload = this.activity(activities, user);

    return ActivityLog[action](payload, { transaction })
      .then((newActivity) => newActivity.activity_id)
      .catch((error) => console.log(error));// todo: add proper logger
  }
}

module.exports = new Controller();
