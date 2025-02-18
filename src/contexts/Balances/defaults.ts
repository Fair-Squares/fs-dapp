// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import {
  Balance,
  BalanceLedger,
  BalancesContextInterface,
  Nominations,
} from 'contexts/Balances/types';

export const balance: Balance = {
  total: new BN(0),
};

export const ledger: BalanceLedger = {
  address: null,
  stash: null,
  active: new BN(0),
  total: new BN(0),
  unlocking: [],
};

export const nominations: Nominations = {
  targets: [],
  submittedIn: 0,
};

export const defaultBalancesContext: BalancesContextInterface = {
  // eslint-disable-next-line
  getAccount: (address) => null,
  // eslint-disable-next-line
  getAccountBalance: (address) => balance,
  // eslint-disable-next-line
  getLedgerForStash: (address) => ledger,
  // eslint-disable-next-line
  getLedgerForController: (address) => null,
  // eslint-disable-next-line
  accounts: [],
  existentialAmount: new BN(0),
  ledgers: [],
};
