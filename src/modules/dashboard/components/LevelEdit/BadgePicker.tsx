import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useField } from 'formik';
import camelcase from 'camelcase';

import { InputLabel } from '~core/Fields';
import Avatar from '~core/Avatar';
import Button from '~core/Button';

import styles from './BadgePicker.css';

import { badges } from '../../../../img/icons.json';
import InputStatus from '~core/Fields/InputStatus';

const badgeIcons = badges.map((badgeName) => {
  const id = camelcase(badgeName);
  return {
    id,
    // eslint-disable-next-line global-require, import/no-dynamic-require
    Badge: require(`../../../../img/badges/${id}.svg`).default,
    title: badgeName,
  };
});

const MSG = defineMessages({
  label: {
    id: 'dashboard.LevelEdit.BadgePicker.label',
    defaultMessage: 'Select Achievement',
  },
  explainer: {
    id: 'dashboard.LevelEdit.BadgePicker.explainer',
    defaultMessage:
      'Users will earn the selected achievement once they complete the level.',
  },
  badgeTitleNone: {
    id: 'dashboard.LevelEdit.BadgePicker.badgeTitleNone',
    defaultMessage: 'None',
  },
});

interface Props {
  name: string;
}

const displayName = 'dashboard.LevelEdit.BadgePicker';

const BadgePicker = ({ name }: Props) => {
  const [, { error, value }, { setValue }] = useField(name);
  return (
    <div className={styles.main}>
      <InputLabel label={MSG.label} />
      <FormattedMessage {...MSG.explainer} />
      <div className={styles.avatars}>
        {badgeIcons.map(({ Badge, id, title }) => (
          <Button
            key={id}
            className={value === id ? styles.avatarSelected : styles.avatar}
            onClick={() => setValue(id)}
          >
            <Avatar placeholderIcon="question-mark" size="m" title={title}>
              <Badge />
            </Avatar>
          </Button>
        ))}
      </div>
      <InputStatus error={error} />
    </div>
  );
};

BadgePicker.displayName = displayName;

export default BadgePicker;
