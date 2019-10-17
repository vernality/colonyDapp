import { Address } from '~types/index';
import { Action, ActionTypes } from '~redux/index';

export const fetchDomains = (
  colonyAddress: Address,
): Action<ActionTypes.COLONY_DOMAINS_FETCH> => ({
  type: ActionTypes.COLONY_DOMAINS_FETCH,
  payload: { colonyAddress },
  meta: { key: colonyAddress },
});

export const fetchDomainsAndRoles = (
  colonyAddress: Address,
): Action<ActionTypes.COLONY_DOMAINS_FETCH> => ({
  type: ActionTypes.COLONY_DOMAINS_FETCH,
  payload: { colonyAddress, options: { fetchRoles: true } },
  meta: { key: colonyAddress },
});
