/* @flow */

import React from 'react';

import { defineMessages } from 'react-intl';

import type { FormikProps } from 'formik';
import styles from './StepTokenChoice.css';

import Heading from '~core/Heading';
import Button from '~core/Button';
import DecisionHub from '~core/DecisionHub';

import type { SubmitFn } from '~core/Wizard';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.heading',
    defaultMessage:
      /* eslint-disable max-len */
      'How would you like to create a new token or use an existing ERC20 token?',
  },
  subTitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'Each Colony has a native token. When rewarding contributors with the native token, those users will also earn reputation in your Colony.',
  },
  subTitleWithLink: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.subTitleWithLink',
    defaultMessage: 'Not sure which option to choose?',
  },
  button: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.button',
    defaultMessage: 'Back',
  },
  learnMore: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.learnMore',
    defaultMessage: 'Learn More',
  },
  createTokenTitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.newToken',
    defaultMessage: 'Create a new token',
  },
  selectTokenTitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.existingToken',
    defaultMessage: 'Use an existing ERC20 token',
  },
  createTokenSubtitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.newTokenSubtitle',
    defaultMessage: 'Earn reputation for your tasks',
  },
  selectTokenSubtitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.existingTokenSubtitle',
    defaultMessage: 'For example: DAI, EOS, SNT, etc',
  },
});

const options = [
  {
    value: 'create',
    title: MSG.createTokenTitle,
    subtitle: MSG.createTokenSubtitle,
  },
  {
    value: 'select',
    title: MSG.selectTokenTitle,
    subtitle: MSG.selectTokenSubtitle,
  },
];

type FormValues = {
  tokenChoice: string,
};

type Props = {
  previousStep: () => void,
  nextStep: () => void,
} & FormikProps<FormValues>;

const displayName = 'dashboard.CreateColonyWizard.StepTokenChoice';

const StepTokenChoice = ({ previousStep, handleSubmit }: Props) => (
  <section className={styles.content}>
    <div className={styles.title}>
      <Heading
        appearance={{ size: 'medium', weight: 'thin' }}
        text={MSG.heading}
      />
    </div>
    <div className={styles.subtitle}>
      <Heading
        appearance={{ size: 'normal', weight: 'thin' }}
        text={MSG.subTitle}
      />
    </div>
    <div className={styles.subtitleWithLinkBox}>
      <Heading
        className={styles.subtitleWithLink}
        appearance={{ size: 'normal', weight: 'thin' }}
        text={MSG.subTitleWithLink}
      />
      <div className={styles.link}>
        <Button
          appearance={{ theme: 'blue' }}
          type="continue"
          text={MSG.learnMore}
        />
      </div>
    </div>
    <form onSubmit={handleSubmit}>
      {<DecisionHub name="tokenChoice" options={options} />}
    </form>
    <div className={styles.buttonContainer}>
      <Button
        appearance={{ theme: 'secondary' }}
        type="cancel"
        text={MSG.button}
        onClick={previousStep}
      />
    </div>
  </section>
);

StepTokenChoice.displayName = displayName;

export const Step = StepTokenChoice;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();