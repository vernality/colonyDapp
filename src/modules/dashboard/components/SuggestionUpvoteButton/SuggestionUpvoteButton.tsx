import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router-dom';

import Button from '~core/Button';
import Icon from '~core/Icon';
import {
  OneSuggestion,
  useAddUpvoteToSuggestionMutation,
  useRemoveUpvoteFromSuggestionMutation,
  useLoggedInUser,
} from '~data/index';
import unfinishedProfileOpener from '~users/UnfinishedProfile';
import { getMainClasses } from '~utils/css';

import { hasUpvotedSuggestion as hasUpvotedSuggestionCheck } from '../../checks';

import styles from './SuggestionUpvoteButton.css';

const MSG = defineMessages({
  titleAddUpvote: {
    id: 'Dashboard.SuggestionUpvoteButton.titleAddUpvote',
    defaultMessage: 'Upvote this suggestion',
  },
  titleRemoveUpvote: {
    id: 'Dashboard.SuggestionUpvoteButton.titleRemoveUpvote',
    defaultMessage: 'Remove your upvote from this suggestion',
  },
});

interface Props {
  suggestionId: OneSuggestion['id'];
  upvotes: OneSuggestion['upvotes'];
}

const displayName = 'Dashboard.SuggestionUpvoteButton';

const SuggestionUpvoteButton = ({ suggestionId, upvotes }: Props) => {
  const { username, walletAddress } = useLoggedInUser();
  const history = useHistory();

  const hasUpvoted = hasUpvotedSuggestionCheck(upvotes, walletAddress);

  const [addUpvote] = useAddUpvoteToSuggestionMutation({
    variables: {
      input: { id: suggestionId },
    },
  });
  const [removeUpvote] = useRemoveUpvoteFromSuggestionMutation({
    variables: {
      input: { id: suggestionId },
    },
  });

  const handleUnclaimedProfile = useCallback(() => {
    unfinishedProfileOpener(history);
  }, [history]);

  const handleClick = useCallback(() => {
    if (!username) {
      return handleUnclaimedProfile();
    }
    return hasUpvoted ? removeUpvote() : addUpvote();
  }, [addUpvote, handleUnclaimedProfile, hasUpvoted, removeUpvote, username]);

  const htmlTitle = hasUpvoted ? MSG.titleRemoveUpvote : MSG.titleAddUpvote;

  return (
    <Button
      appearance={{ size: 'small', theme: 'no-style' }}
      className={getMainClasses({}, styles, {
        hasUpvoted,
      })}
      onClick={handleClick}
      title={htmlTitle}
    >
      <Icon name="caret-up-small" title={htmlTitle} />
    </Button>
  );
};

SuggestionUpvoteButton.displayName = displayName;

export default SuggestionUpvoteButton;
