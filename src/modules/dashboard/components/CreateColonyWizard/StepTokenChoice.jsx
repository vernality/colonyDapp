/* @flow */

import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './StepTokenChoice.css';

import Heading from '~core/Heading';
import ExternalLink from '~core/ExternalLink';
import DecisionHub from '~core/DecisionHub';
import { Form } from '~core/Fields';

import type { WizardProps } from '~core/Wizard';

import { getNormalizedDomainText } from '~utils/strings';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.heading',
    defaultMessage: 'Choose a native token for {colony}',
  },
  subtitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.subtitle',
    defaultMessage:
      // eslint-disable-next-line max-len
      'Colonies need a native token to calculate Reputation at the end of a task.',
  },
  callToAction: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.callToAction',
    defaultMessage: 'Choose which token is right for {colony}.',
  },
  subtitleWithExample: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.subtitleWithExample',
    defaultMessage: `E.g.: Leia has completed a task worth 1.5 ETH and 5 CLNY.
      If CLNY is the native token then she also earns +5 Reputation points.`,
  },
  button: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.button',
    defaultMessage: 'Back',
  },
  learnMore: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.learnMore',
    defaultMessage: 'Learn More',
  },
  notSure: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.notSure',
    defaultMessage: 'Not sure?',
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
    defaultMessage: 'For example: MyAwesomeToken',
  },
  selectTokenSubtitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.existingTokenSubtitle',
    defaultMessage: 'For example: DAI, EOS, SNT, etc',
  },
  tooltipCreate: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.tooltipCreate',
    defaultMessage:
      // eslint-disable-next-line max-len
      "Good for projects that don't already have a token or who want more control over their token",
  },
  tooltipSelect: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.tooltipSelect',
    defaultMessage:
      // eslint-disable-next-line max-len
      'Good for projects that already have their own token or want to use an existing one like DAI.',
  },
});

const options = [
  {
    value: 'create',
    title: MSG.createTokenTitle,
    subtitle: MSG.createTokenSubtitle,
    icon: 'question-mark',
    tooltip: MSG.tooltipCreate,
  },
  {
    value: 'select',
    title: MSG.selectTokenTitle,
    subtitle: MSG.selectTokenSubtitle,
    icon: 'question-mark',
    tooltip: MSG.tooltipSelect,
  },
];

type FormValues = {
  tokenChoice: string,
  colonyName: string,
};

type Props = WizardProps<FormValues>;

const displayName = 'dashboard.CreateColonyWizard.StepTokenChoice';

const StepTokenChoice = ({ nextStep, wizardForm, wizardValues }: Props) => (
  <Form onSubmit={nextStep} {...wizardForm}>
    {
      <section className={styles.content}>
        <div className={styles.title}>
          <Heading
            appearance={{ size: 'medium', weight: 'medium' }}
            text={MSG.heading}
            textValues={{
              colony: getNormalizedDomainText(wizardValues.colonyName),
            }}
          />
        </div>
        <div className={styles.subtitle}>
          <Heading
            appearance={{ size: 'normal', weight: 'thin' }}
            text={MSG.subtitle}
            // textValues={{ colony: wizardValues.colonyName }}
          />
        </div>
        <div className={styles.subtitleWithExampleBox}>
          <Heading
            className={styles.subtitleWithExample}
            appearance={{ size: 'normal', weight: 'thin' }}
            text={MSG.subtitleWithExample}
          />
        </div>
        <div className={styles.subtitleWithExampleBox}>
          <FormattedMessage
            {...MSG.callToAction}
            values={{
              colony: getNormalizedDomainText(wizardValues.colonyName),
            }}
          />
        </div>
        <DecisionHub name="tokenChoice" options={options} />
        <div className={styles.titleAndButton}>
          <Heading
            appearance={{
              size: 'tiny',
              weight: 'bold',
              margin: 'none',
            }}
            text={MSG.notSure}
          />
          <ExternalLink
            className={styles.link}
            text={MSG.learnMore}
            // eslint-disable-next-line max-len
            href="https://help.colony.io/hc/en-us/articles/360024589073-How-to-choose-a-native-token"
          />
        </div>
      </section>
    }
  </Form>
);

StepTokenChoice.displayName = displayName;

export default StepTokenChoice;
