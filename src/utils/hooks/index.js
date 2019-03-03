/* @flow */

import type { Action } from '~redux';
import type { RootStateRecord } from '~immutable';

// $FlowFixMe (not possible until we upgrade flow to 0.87)
import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { isFetchingData } from '~immutable/utils';

type DataFetcher = {
  select: (rootState: RootStateRecord, ...selectArgs: any[]) => any,
  fetch: (...fetchArgs: any[]) => Action<*>,
};

type Selector<T> = (reduxState: Object, extraArgs?: any[]) => T;

type DependantSelector = (
  selector: any,
  reduxState: Object,
  extraArgs?: any[],
) => boolean;

export type Given = (
  potentialSelector: Selector<any> | any,
  dependantSelector?: DependantSelector,
) => any | boolean;

export const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const transformFetchedData = data => {
  if (!data) return null;
  if (data.record && typeof data.record.toJS == 'function') {
    return data.record.toJS();
  }
  return data.record;
};

export const useDataFetcher = (
  fetcher: DataFetcher,
  selectArgs: any[],
  fetchArgs: any[],
) => {
  const dispatch = useDispatch();
  const mapState = useCallback(
    state => ({
      data: fetcher.select(state, ...selectArgs),
    }),
    selectArgs,
  );
  const { data } = useMappedState(mapState);
  useEffect(() => {
    dispatch(fetcher.fetch(...fetchArgs), fetchArgs);
  }, fetchArgs);
  return {
    data: transformFetchedData(data),
    isFetching: isFetchingData(data),
    error: data ? data.error : null,
  };
};

export const useFeatureFlags = (
  potentialSelectorArgs?: any[] = [],
  dependantSelectorArgs?: any[] = [],
) => {
  const mapState = useCallback(
    reduxState => ({
      given: (
        potentialSelector: any,
        dependantSelector?: DependantSelector,
      ) => {
        let potentialSelectorValue = potentialSelector;
        if (potentialSelector && typeof potentialSelector === 'function') {
          potentialSelectorValue = potentialSelector(
            reduxState,
            ...potentialSelectorArgs,
          );
        }
        if (dependantSelector && typeof dependantSelector === 'function') {
          return dependantSelector(
            potentialSelectorValue,
            reduxState,
            ...dependantSelectorArgs,
          );
        }
        return potentialSelectorValue;
      },
    }),
    [...potentialSelectorArgs, ...dependantSelectorArgs],
  );
  return useMappedState(mapState);
};
