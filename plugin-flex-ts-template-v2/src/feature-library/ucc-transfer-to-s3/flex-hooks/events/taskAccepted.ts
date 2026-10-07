import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';
import { getLambdaLink } from '../../config';
import logger from '../../../../utils/logger';

export const eventName = FlexEvent.taskAccepted;
export const eventHook = (flex: typeof Flex, _manager: Flex.Manager, task: Flex.ITask) => {
  logger.info(`[ucc-transfer-to-s3] Task accepted: ${task.sid}`);
  console.log('taskaccepted+++++', task);


  logger.info(`[ucc-transfer-to-s3] Before complete task: ${task.sid}`);
  console.log('attributes+++++++++', task.attributes);

  // Extract the key from conference participants
  const key = task.attributes?.conference?.participants?.worker;

  

  if (!key) {
    logger.warn(`[ucc-transfer-to-s3] No worker participant key found for task: ${task.sid}`);
    return;
  }

  // Get the lambda link from configuration
  const lambdaLink = getLambdaLink();
  if (!lambdaLink) {
    logger.warn(`[ucc-transfer-to-s3] No lambda link configured`);
    return;
  }

  const newAttributes = { ...task.attributes };
  const current_reservation_attributes = task.attributes?.reservation_attributes || {};
  const reservationSid = task.sid;

  newAttributes.reservation_attributes = {
    ...current_reservation_attributes,
    [reservationSid]: {
      media: [
        {
          url_provider: `${lambdaLink}?key=${key}`,
          type: 'VoiceRecording',
        },
      ],
    },
  };

  task.setAttributes(newAttributes);

  logger.info(`[ucc-transfer-to-s3] Updated task attributes for task: ${task.sid}`);
  console.log('AFTER OBJECT ', task);
};
