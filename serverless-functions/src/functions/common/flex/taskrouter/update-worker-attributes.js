const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const TaskRouterOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);

const requiredParameters = [
  { key: 'workerSid', purpose: 'unique ID of the worker' },
  {
    key: 'attributesUpdate',
    purpose: 'object to overwrite on existing task attributes',
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    // Make sure that this user is allowed to perform this action
    const canUpdateAnyWorker =
      event.TokenResult.roles.includes('supervisor') || event.TokenResult.roles.includes('admin');
    const canUpdateSelf =
      event.TokenResult.worker_sid && event.workerSid && event.TokenResult.worker_sid === event.workerSid;

    if (!(canUpdateAnyWorker || canUpdateSelf)) {
      response.setStatusCode(403);
      response.setBody({ success: false, error: 'User does not have the permissions to perform this action.' });
      return callback(null, response);
    }

    const { workerSid, attributesUpdate } = event;
    const result = await TaskRouterOperations.updateWorkerAttributes({
      context,
      workerSid,
      attributesUpdate,
    });
    const { status, data: worker } = result;

    response.setStatusCode(status);
    response.setBody({ worker, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
