import { Address } from '~types/index';
import {
  ActionTypes,
  ActionType,
  ErrorActionType,
  UniqueActionType,
} from '~redux/index';
import { AnyTask, Payouts } from '~data/index';

type TaskActionMeta = {
  key: string; // draftId
};

type TaskActionPayload<P> = AnyTask['id'] & P;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TaskActionType<T extends string, P>
  extends UniqueActionType<T, TaskActionPayload<P>, TaskActionMeta> {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TaskErrorActionType<T extends string>
  extends ErrorActionType<T, TaskActionMeta> {}

/**
 * @todo Define missing task action payload types.
 * @body These are:
 * TASK_MANAGER_COMPLETE
 * TASK_MANAGER_COMPLETE_SUCCESS
 * TASK_MANAGER_END
 * TASK_MANAGER_END_SUCCESS
 * TASK_MANAGER_RATE_WORKER
 * TASK_MANAGER_RATE_WORKER_SUCCESS
 * TASK_MANAGER_REVEAL_WORKER_RATING
 * TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS
 * TASK_MODIFY_WORKER_PAYOUT
 * TASK_MODIFY_WORKER_PAYOUT_SUCCESS
 * TASK_SUBMIT_DELIVERABLE
 * TASK_SUBMIT_DELIVERABLE_SUCCESS
 * TASK_WORKER_CLAIM_REWARD
 * TASK_WORKER_CLAIM_REWARD_SUCCESS
 * TASK_WORKER_END
 * TASK_WORKER_END_SUCCESS
 * TASK_WORKER_RATE_MANAGER
 * TASK_WORKER_RATE_MANAGER_SUCCESS
 * TASK_WORKER_REVEAL_MANAGER_RATING
 * TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS
 */
export type TaskActionTypes =
  | UniqueActionType<
      ActionTypes.TASK_CREATE,
      {
        colonyAddress: Address;
        ethDomainId: AnyTask['ethDomainId'];
      },
      object
    >
  | ErrorActionType<ActionTypes.TASK_CREATE_ERROR, object>
  | UniqueActionType<ActionTypes.TASK_CREATE_SUCCESS, { id: string }, object>
  | ActionType<ActionTypes.TASK_FETCH_ALL>
  | TaskActionType<
      ActionTypes.TASK_FINALIZE,
      {
        colonyAddress: Address;
        draftId: AnyTask['id'];
        workerAddress: Address;
        domainId: number;
        skillId: number;
        payouts: Payouts;
        persistent: boolean;
      }
    >
  | TaskErrorActionType<ActionTypes.TASK_FINALIZE_ERROR>
  | UniqueActionType<
      ActionTypes.TASK_FINALIZE_SUCCESS,
      { draftId: string; potId: string },
      object
    >
  | TaskActionType<ActionTypes.TASK_MANAGER_COMPLETE, object>
  | TaskErrorActionType<ActionTypes.TASK_MANAGER_COMPLETE_ERROR>
  | TaskActionType<ActionTypes.TASK_MANAGER_COMPLETE_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_MANAGER_END, object>
  | TaskErrorActionType<ActionTypes.TASK_MANAGER_END_ERROR>
  | TaskActionType<ActionTypes.TASK_MANAGER_END_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_MANAGER_RATE_WORKER, object>
  | TaskErrorActionType<ActionTypes.TASK_MANAGER_RATE_WORKER_ERROR>
  | TaskActionType<ActionTypes.TASK_MANAGER_RATE_WORKER_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_MANAGER_REVEAL_WORKER_RATING, object>
  | TaskErrorActionType<ActionTypes.TASK_MANAGER_REVEAL_WORKER_RATING_ERROR>
  | TaskActionType<
      ActionTypes.TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS,
      object
    >
  | TaskActionType<ActionTypes.TASK_SUBMIT_DELIVERABLE, object>
  | TaskErrorActionType<ActionTypes.TASK_SUBMIT_DELIVERABLE_ERROR>
  | TaskActionType<ActionTypes.TASK_SUBMIT_DELIVERABLE_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_WORKER_CLAIM_REWARD, object>
  | TaskErrorActionType<ActionTypes.TASK_WORKER_CLAIM_REWARD_ERROR>
  | TaskActionType<ActionTypes.TASK_WORKER_CLAIM_REWARD_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_WORKER_END, object>
  | TaskErrorActionType<ActionTypes.TASK_WORKER_END_ERROR>
  | TaskActionType<ActionTypes.TASK_WORKER_END_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_WORKER_RATE_MANAGER, object>
  | TaskErrorActionType<ActionTypes.TASK_WORKER_RATE_MANAGER_ERROR>
  | TaskActionType<ActionTypes.TASK_WORKER_RATE_MANAGER_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_WORKER_REVEAL_MANAGER_RATING, object>
  | TaskErrorActionType<ActionTypes.TASK_WORKER_REVEAL_MANAGER_RATING_ERROR>
  | TaskActionType<
      ActionTypes.TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS,
      object
    >;
