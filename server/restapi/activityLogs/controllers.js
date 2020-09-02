const Activity = require('./Activity');
const { ActivityLog, sequelize } = require('../../models');

class Controller {
  constructor() {
    this.registerHooks();
  }

  registerHooks() {
    sequelize.addHook('afterCreate', (instance, options) => {
      if (options.user && options.resourceId) {
        this.addActivity(options.user, new Activity('create', instance, options.resourceId), options.transaction);
      }
    });

    sequelize.addHook('afterUpdate', (instance, options) => {
      if (options.user && options.resourceId) {
        this.addActivity(options.user, new Activity('update', instance, options.resourceId), options.transaction);
      }
    });

    sequelize.addHook('afterSave', (instance, options) => {
      if (options.user && options.resourceId) {
        this.addActivity(options.user, new Activity('update', instance, options.resourceId), options.transaction);
      }
    });

    sequelize.addHook('afterUpsert', (instance, options) => {
      if (options.user && options.resourceId) {
        this.addActivity(options.user, new Activity('update', instance, options.resourceId), options.transaction);
      }
    });

    sequelize.addHook('afterBulkCreate', (instance, options) => {
      if (options.user && options.resourceId) {
        const modelInstance = !Array.isArray(instance) ? [instance] : instance;

        modelInstance.forEach((model) => {
          this.addActivity(options.user, new Activity('create', model, options.resourceId), options.transaction);
        });
      }
    });
  }

  async getActivities() {
    return ActivityLog.findAll()
      .then((activities) => activities);
  }

  addActivity(user = {}, activity = {}, transaction) {
    if (activity.resource === 'ACTIVITY_LOG' || !activity.resourceId) return;

    return ActivityLog.create({
      initiator_id: user.id,
      initiator_name: user.displayName,
      operation: activity.operation,
      resource_id: activity.resourceId,
      resource: activity.resource,
      payload: activity.payload
    }, { transaction })
      .then((newActivity) => newActivity.activity_id)
      .catch((error) => console.log(error) // todo: add proper logger
      );
  }
}

module.exports = new Controller();
