/* @flow */

import type { Saga } from 'redux-saga';

import { eventChannel } from 'redux-saga';
import { call, put, spawn, take, takeLatest, all } from 'redux-saga/effects';

import softwareWallet from '@colony/purser-software';
import metamaskWallet, { accountChangeHook } from '@colony/purser-metamask';
import ledgerWallet from '@colony/purser-ledger';
import trezorWallet from '@colony/purser-trezor';
import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';
import { getNetworkClient } from '@colony/colony-js-client';

import type { Action } from '~redux';
import type { Address } from '~types';

import { create, putError } from '~utils/saga/effects';
import { ACTIONS } from '~redux';
import { createAddress } from '~types';
import { WALLET_SPECIFICS, WALLET_CATEGORIES } from '~immutable';
import { HARDWARE_WALLET_DEFAULT_ADDRESS_COUNT } from '../constants';
import { DEFAULT_NETWORK } from '../../core/constants';

// This should be typed better
type WalletInstance = Object;

const hardwareWallets = {
  ledger: ledgerWallet,
  trezor: trezorWallet,
  json: softwareWallet,
  mnemonic: softwareWallet,
  metamask: metamaskWallet,
  trufflepig: softwareWallet,
};

function* fetchAddressBalance(address, provider) {
  const checkSumedAddress = yield call(createAddress, address);
  const balance = yield call(
    [provider, provider.getBalance],
    checkSumedAddress,
  );
  return {
    address: checkSumedAddress,
    balance,
  };
}

function* fetchAccounts(
  action: Action<typeof ACTIONS.WALLET_FETCH_ACCOUNTS>,
): Saga<*> {
  const { walletType } = action.payload;

  try {
    const { otherAddresses } = yield call(hardwareWallets[walletType].open, {
      addressCount: HARDWARE_WALLET_DEFAULT_ADDRESS_COUNT,
    });

    const {
      adapter: { provider },
    } = yield call(
      getNetworkClient,
      DEFAULT_NETWORK,
      {
        type: WALLET_CATEGORIES.HARDWARE,
        subtype: walletType,
      },
      // $FlowFixMe this _can_ be undefined, it's ok
      process.env.INFURA_ID,
      !!process.env.VERBOSE,
    );

    const addressesWithBalance = yield all(
      otherAddresses.map(address =>
        call(fetchAddressBalance, address, provider),
      ),
    );

    yield put<Action<typeof ACTIONS.WALLET_FETCH_ACCOUNTS_SUCCESS>>({
      type: ACTIONS.WALLET_FETCH_ACCOUNTS_SUCCESS,
      payload: { allAddresses: addressesWithBalance },
    });
  } catch (err) {
    return yield putError(ACTIONS.WALLET_FETCH_ACCOUNTS_ERROR, err);
  }
  return null;
}

function* openMnemonicWallet(
  action: Action<typeof ACTIONS.WALLET_CREATE>,
): Saga<*> {
  const { connectwalletmnemonic } = action.payload;
  return yield call(softwareWallet.open, {
    mnemonic: connectwalletmnemonic,
  });
}

/**
 * Watch for changes in Metamask account, and log the user out when they happen.
 */
function* metamaskWatch(walletAddress: Address): Saga<*> {
  const channel = eventChannel(emit => {
    accountChangeHook(({ selectedAddress }: { selectedAddress: string }) =>
      emit(createAddress(selectedAddress)),
    );
    return () => {
      // @todo Nicer unsubscribe once supported in purser-metamask
      if (window.web3) {
        // eslint-disable-next-line no-underscore-dangle
        window.web3.currentProvider.publicConfigStore._events.update.pop();
      }
    };
  });
  let previousAddress = walletAddress;
  while (true) {
    const selectedAddress: Address = yield take(channel);
    if (previousAddress !== selectedAddress) {
      previousAddress = selectedAddress;
      yield put<Action<typeof ACTIONS.USER_LOGOUT>>({
        type: ACTIONS.USER_LOGOUT,
      });
    }
  }
}

function* openMetamaskWallet(): Saga<*> {
  const wallet = yield call(metamaskWallet.open);
  yield spawn(metamaskWatch, createAddress(wallet.address));
  return wallet;
}

function* openHardwareWallet(
  action: Action<typeof ACTIONS.WALLET_CREATE>,
): Saga<*> {
  const { hardwareWalletChoice, method } = action.payload;
  const wallet = yield call(hardwareWallets[method].open, {
    /**
     * @todo : is 100 addresses really what we want?
     */
    addressCount: 100,
  });
  const selectedAddressIndex = wallet.otherAddresses.findIndex(
    address => address === hardwareWalletChoice,
  );
  wallet.setDefaultAddress(selectedAddressIndex);
  return wallet;
}

function* openKeystoreWallet(
  action: Action<typeof ACTIONS.WALLET_CREATE>,
): Saga<*> {
  const { keystore, password } = action.payload;
  return yield call(softwareWallet.open, {
    keystore,
    password,
  });
}

function* openTrufflepigWallet({
  payload: { accountIndex },
}: Action<typeof ACTIONS.WALLET_CREATE>): Saga<*> {
  const loader = yield create(TrufflepigLoader);
  const { privateKey } = yield call([loader, loader.getAccount], accountIndex);
  return yield call(softwareWallet.open, {
    privateKey,
  });
}

function* createWallet(action: Action<typeof ACTIONS.WALLET_CREATE>): Saga<*> {
  const { mnemonic } = action.payload;
  return yield call(softwareWallet.open, {
    mnemonic,
  });
}

export function* getWallet(
  action: Action<typeof ACTIONS.WALLET_CREATE>,
): Saga<WalletInstance> {
  const { method } = action.payload;
  switch (method) {
    case 'create':
      return yield call(createWallet, action);
    case WALLET_SPECIFICS.METAMASK:
      return yield call(openMetamaskWallet, action);
    case WALLET_SPECIFICS.TREZOR:
      return yield call(openHardwareWallet, action);
    case WALLET_SPECIFICS.LEDGER:
      return yield call(openHardwareWallet, action);
    case WALLET_SPECIFICS.MNEMONIC:
      return yield call(openMnemonicWallet, action);
    case WALLET_SPECIFICS.JSON:
      return yield call(openKeystoreWallet, action);
    case WALLET_SPECIFICS.TRUFFLEPIG:
      return yield call(openTrufflepigWallet, action);
    default:
      throw new Error(
        `Method ${method} is not recognized for getting a wallet`,
      );
  }
}

export function* setupWalletSagas(): Saga<void> {
  yield takeLatest(ACTIONS.WALLET_FETCH_ACCOUNTS, fetchAccounts);
}
