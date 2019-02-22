/* @flow */

import type {
  Collection as CollectionType,
  List as ListType,
  Map as ImmutableMapType,
  RecordOf,
} from 'immutable';

import type { ENSName } from '~types';
import type { ContractTransactionRecordType, DataRecordType } from '~immutable';

export type AdminTransactionsState = ImmutableMapType<
  ENSName,
  DataRecordType<ListType<ContractTransactionRecordType>>,
>;

export type AdminUnclaimedTransactionsState = ImmutableMapType<
  ENSName,
  DataRecordType<ListType<ContractTransactionRecordType>>,
>;

export type AdminStateProps = {|
  transactions: AdminTransactionsState,
  unclaimedTransactions: AdminUnclaimedTransactionsState,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type AdminStateRecord = CollectionType<*, *> & RecordOf<AdminStateProps>;