import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { getLambdaLink } from '../../config';
import logger from '../../../../utils/logger';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.AcceptTask;
export const actionHook = function beforeAcceptTask(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    const { task } = payload;
    const { attributes } = task;

    logger.info(`[ucc-transfer-to-s3] Before complete task: ${task.sid}`);
    console.log('TASK++++++', payload);
    console.log('attributes+++++++++', attributes);

    // Extract the key from conference participants
  const key = payload.sid;

    payload.conferenceOptions.record = "true";
    payload.conferenceOptions.recordingStatusCallback = `https://ywiftwrekh.execute-api.ap-southeast-1.amazonaws.com/uat/twi-pd-send-to-zadara?key=${key}`

    console.log("Recording in Progress ", payload)
  });
};
