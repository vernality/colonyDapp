import { MessageDescriptor } from 'react-intl';

import React from 'react';

import { Address } from '~types/index';
import { Colony } from '~data/index';
import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';

import DomainListItem from './DomainListItem';

import styles from './DomainList.css';

interface Props {
  /*
   * Map of domain data
   */
  domains?: Colony['domains'];
  /*
   * Whether to show the remove button
   * Gets passed down to `DomainListItem`
   */
  viewOnly?: boolean;
  /*
   * Title to show before the list
   */
  label?: string | MessageDescriptor;
  colonyAddress: Address;
}

const displayName = 'admin.DomainList';

const DomainList = ({
  domains,
  viewOnly = true,
  label,
  colonyAddress,
}: Props) => (
  <div className={styles.main}>
    {label && (
      <Heading
        appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
        text={label}
      />
    )}
    <div className={styles.listWrapper}>
      <Table scrollable>
        <TableBody>
          {domains ? (
            domains.map((domain) => (
              <DomainListItem
                key={domain.id}
                domain={domain}
                viewOnly={viewOnly}
                colonyAddress={colonyAddress}
              />
            ))
          ) : (
            <div>
              {/* //TODO: Add empty state here once we have it designed */}
            </div>
          )}
        </TableBody>
      </Table>
    </div>
  </div>
);

DomainList.displayName = displayName;

export default DomainList;
