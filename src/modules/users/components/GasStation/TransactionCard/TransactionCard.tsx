import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Card from '~core/Card';
import {
  TransactionOrMessageGroup,
  getGroupKey,
  getGroupStatus,
  getGroupValues,
} from '../transactionGroup';
import styles from './TransactionCard.css';
import TransactionStatus from './TransactionStatus';

interface Props {
  idx: number;
  transactionGroup: TransactionOrMessageGroup;
  onClick?: (idx: number) => void;
}

class TransactionCard extends Component<Props> {
  static displayName = 'users.GasStation.TransactionCard';

  handleClick = () => {
    const { idx, onClick } = this.props;
    if (onClick) onClick(idx);
  };

  render() {
    const { transactionGroup, onClick } = this.props;
    const groupKey = getGroupKey(transactionGroup);
    const status = getGroupStatus(transactionGroup);
    const values = getGroupValues(transactionGroup);
    return (
      <Card className={styles.main}>
        <button
          type="button"
          className={styles.button}
          onClick={this.handleClick}
          disabled={!onClick}
        >
          <div className={styles.summary}>
            <div className={styles.description}>
              <Heading
                appearance={{ theme: 'dark', size: 'normal', margin: 'none' }}
                text={{
                  id: `transaction.${groupKey}${
                    transactionGroup[0].methodContext
                      ? `.${transactionGroup[0].methodContext}`
                      : ''
                  }.title`,
                }}
                textValues={values.params}
              />
              <FormattedMessage
                id={`transaction.${groupKey}${
                  transactionGroup[0].methodContext
                    ? `.${transactionGroup[0].methodContext}`
                    : ''
                }.description`}
                values={values.params}
              />
            </div>
            {/* For multisig, how do we pass it in here? */}
            <TransactionStatus
              groupCount={transactionGroup.length}
              status={status}
              // multisig={{}}
            />
          </div>
        </button>
      </Card>
    );
  }
}

export default TransactionCard;