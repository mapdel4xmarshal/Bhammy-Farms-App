class Activity {
  constructor(operation, instance = {}, resourceId) {
    const tableName = instance._modelOptions
      ? instance._modelOptions.tableName : instance.tableName || instance.constructor.name;

    return {
      operation: operation.toUpperCase(),
      resource: tableName.toUpperCase(),
      resourceId: instance[resourceId] || instance.dataValues[resourceId],
      payload: JSON.stringify({
        dataValues: instance.dataValues,
        previousDataValues: instance._previousDataValues,
        changed: instance._changed
      })
    };
  }
}

module.exports = Activity;
