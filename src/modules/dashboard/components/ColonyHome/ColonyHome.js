/* @flow */

import { compose } from 'recompose';
import { connect } from 'react-redux';

import type { ENSName } from '~types';

import { withFeatureFlags } from '~utils/hoc';
import { withColonyFromRoute } from '../../../core/hocs';

import { fetchColonyDomains as fetchColonyDomainsAction } from '../../actionCreators';
import { getColonyAdmins, getColonyDomains } from '../../selectors';
import { walletAddressSelector } from '../../../users/selectors/users';

import ColonyHome from './ColonyHome.jsx';

const enhance = compose(
  withColonyFromRoute,
  connect(
    (state: Object, { ensName }: { ensName: ENSName }) => ({
      walletAddress: walletAddressSelector(state),
      colonyAdmins: getColonyAdmins(state, ensName),
      colonyDomains: getColonyDomains(state, ensName).toArray(),
    }),
    { fetchColonyDomains: fetchColonyDomainsAction },
  ),
  withFeatureFlags(),
);

export default enhance(ColonyHome);
