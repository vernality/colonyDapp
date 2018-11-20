/* @flow */

import type { MessageDescriptor } from 'react-intl';

import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Radio } from '~core/Fields';
import Heading from '~core/Heading';
import StarRating from '~core/StarRating';

import styles from './StarRatingRadio.css';

type Props = {
  name: string,
  /*
   * @NOTE the value, will also control the way the stars are highlighted
   * and the warning text displayed
   *
   */
  value: 1 | 2 | 3,
  checked: boolean,
  title: MessageDescriptor,
  titleValues?: Object,
  description: MessageDescriptor,
  descriptionValues?: Object,
};

const displayName = 'dashboard.TaskRatingDialogs.StarRatingRadio';

const StarRatingRadio = ({
  title,
  titleValues = {},
  description,
  descriptionValues = {},
  value = 3,
  name,
  checked = false,
}: Props) => (
  <Radio checked={checked} name={name} value={value}>
    <div className={styles.ratingItem}>
      <div className={styles.ratingText}>
        <Heading
          appearance={{ size: 'normal', margin: 'none' }}
          text={title}
          textValues={titleValues}
        />
        <p
          className={
            value === 1
              ? styles.ratingItemWarning
              : styles.ratingItemDescription
          }
        >
          <FormattedMessage {...description} values={descriptionValues} />
        </p>
      </div>
      <div className={styles.ratingStars}>
        <StarRating rating={value} />
      </div>
    </div>
  </Radio>
);

StarRatingRadio.displayName = displayName;

export default StarRatingRadio;
