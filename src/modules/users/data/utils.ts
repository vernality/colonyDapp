import { Address, ColonyClient, createAddress } from '~types/index';

// import { EventTypes } from '~data/constants';
import {
  // NOTIFICATION_EVENT_ASSIGNED,
  // NOTIFICATION_EVENT_COLONY_ENS_CREATED,
  // NOTIFICATION_EVENT_COLONY_ROLE_SET,
  // NOTIFICATION_EVENT_DOMAIN_ADDED,
  // NOTIFICATION_EVENT_REQUEST_WORK,
  // NOTIFICATION_EVENT_TASK_FINALIZED,
  // NOTIFICATION_EVENT_TOKENS_MINTED,
  // NOTIFICATION_EVENT_UNASSIGNED,
  NOTIFICATION_EVENT_USER_CLAIMED_PROFILE,
  // NOTIFICATION_EVENT_USER_MENTIONED,
  // NOTIFICATION_EVENT_USER_TRANSFER,
} from '~users/Inbox/events';

const notificationsToEventsMapping = {
  // [EventTypes.ASSIGNED_TO_TASK]: NOTIFICATION_EVENT_ASSIGNED,
  // [EventTypes.UNASSIGNED_FROM_TASK]: NOTIFICATION_EVENT_UNASSIGNED,
  // [EventTypes.COMMENT_MENTION]: NOTIFICATION_EVENT_USER_MENTIONED,
  // [EventTypes.TASK_FINALIZED_NOTIFICATION]: NOTIFICATION_EVENT_TASK_FINALIZED,
  // [EventTypes.WORK_REQUEST]: NOTIFICATION_EVENT_REQUEST_WORK,
  // [EventTypes.USER_PROFILE_CREATED]: NOTIFICATION_EVENT_USER_CLAIMED_PROFILE,
  // ColonyRoleSet: NOTIFICATION_EVENT_COLONY_ROLE_SET,
  // ColonyLabelRegistered: NOTIFICATION_EVENT_COLONY_ENS_CREATED,
  // DomainAdded: NOTIFICATION_EVENT_DOMAIN_ADDED,
  // Mint: NOTIFICATION_EVENT_TOKENS_MINTED,
  // Transfer: NOTIFICATION_EVENT_USER_TRANSFER,
  NewUser: NOTIFICATION_EVENT_USER_CLAIMED_PROFILE,
};

export const transformNotificationEventNames = (eventName: string): string =>
  notificationsToEventsMapping[eventName];

export const getExtensionAddresses = async (
  colonyClient: ColonyClient,
): Promise<[Address, Address]> => {
  const {
    address: oldRolesAddress,
  } = await colonyClient.getExtensionAddress.call({
    contractName: 'OldRoles',
  });
  const { address: oneTxAddress } = await colonyClient.getExtensionAddress.call(
    {
      contractName: 'OneTxPayment',
    },
  );

  return [createAddress(oldRolesAddress), createAddress(oneTxAddress)];
};

export const decorateColonyEventPayload = ({ payload, ...event }: any) => ({
  ...event,
  payload: {
    ...payload,
    ...(() => {
      switch (event.type) {
        case 'ColonyRoleSet':
          return {
            colonyAddress: event.meta.sourceId,
            targetUser: payload.address,
          };
        case 'DomainAdded':
          return {
            colonyAddress: event.meta.sourceId,
          };
        case 'Mint':
          return {
            colonyAddress: payload.address,
            tokenAddress: payload.tokenAddress,
          };
        case 'ColonyLabelRegistered':
          return {
            colonyAddress: payload.colony,
          };
        default:
          return {};
      }
    })(),
  },
});
