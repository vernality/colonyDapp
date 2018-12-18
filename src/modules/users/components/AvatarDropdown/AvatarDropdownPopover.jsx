/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { OpenDialog } from '~core/Dialog/types';
import withDialog from '~core/Dialog/withDialog';

import { USER_EDIT_ROUTE, CREATE_COLONY_ROUTE } from '~routes';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import Link from '~core/Link';
import NavLink from '~core/NavLink';

import type { UserRecord } from '~immutable';

const MSG = defineMessages({
  buttonGetStarted: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.buttonGetStarted',
    defaultMessage: 'Get started',
  },
  myProfile: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.myProfile',
    defaultMessage: 'My Profile',
  },
  settings: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.colonySettings',
    defaultMessage: 'Settings',
  },
  createColony: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.createColony',
    defaultMessage: 'Create a Colony',
  },
  requestFeatures: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.requestFeatures',
    defaultMessage: 'Request Features',
  },
  reportBugs: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.reportBugs',
    defaultMessage: 'Report Bugs',
  },
  helpCenter: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.helpCenter',
    defaultMessage: 'Help Center',
  },
  signOut: {
    id: 'users.AvatarDropdown.AvatarDropdownPopover.link.signOut',
    defaultMessage: 'Sign Out',
  },
});

type Props = {
  closePopover: () => void,
  user: UserRecord,
  openDialog: OpenDialog,
};

class AvatarDropdownPopover extends Component<Props> {
  static displayName = 'users.AvatarDropdown.AvatarDropdownPopover';

  handleSetup = () => {
    const {
      openDialog,
      user: {
        profile: { walletAddress },
      },
    } = this.props;

    return openDialog('UnfinishedProfileDialog')
      .afterClosed()
      .then(() =>
        openDialog('ClaimProfileDialog', { walletAddress })
          .afterClosed()
          .then(() => openDialog('ENSNameDialog'))
          .catch(err => {
            // eslint-disable-next-line no-console
            console.log(err);
          }),
      );
  };

  renderUserSection = () => {
    const {
      user: {
        profile: { username },
      },
    } = this.props;
    return (
      <DropdownMenuSection separator>
        {!username && (
          <DropdownMenuItem>
            <button type="button" onClick={this.handleSetup}>
              <FormattedMessage {...MSG.buttonGetStarted} />
            </button>
          </DropdownMenuItem>
        )}
        {username && (
          <DropdownMenuItem>
            <NavLink to={`/user/${username}`} text={MSG.myProfile} />
          </DropdownMenuItem>
        )}
        {username && (
          <DropdownMenuItem>
            <NavLink to={USER_EDIT_ROUTE} text={MSG.settings} />
          </DropdownMenuItem>
        )}
      </DropdownMenuSection>
    );
  };

  renderColonySection = () => {
    const {
      user: {
        profile: { username },
      },
    } = this.props;
    if (username) {
      return (
        <DropdownMenuSection separator>
          <DropdownMenuItem>
            <NavLink to={CREATE_COLONY_ROUTE} text={MSG.createColony} />
          </DropdownMenuItem>
        </DropdownMenuSection>
      );
    }
    return null;
  };

  renderHelperSection = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <Link to="/" text={MSG.requestFeatures} />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/" text={MSG.reportBugs} />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <a
          href="https://help.colony.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FormattedMessage {...MSG.helpCenter} />
        </a>
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  renderMetaSection = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <Link to="/" text={MSG.signOut} />
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  render() {
    const { closePopover } = this.props;
    return (
      <DropdownMenu onClick={closePopover}>
        {this.renderUserSection()}
        {this.renderColonySection()}
        {this.renderHelperSection()}
        {this.renderMetaSection()}
      </DropdownMenu>
    );
  }
}

export default withDialog()(AvatarDropdownPopover);
