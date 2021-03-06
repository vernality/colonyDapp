import React from 'react';
import { defineMessages } from 'react-intl';

import { Select, Form } from '~core/Fields';
import Heading from '~core/Heading';
import { useLoggedInUser } from '~data/index';

import {
  TasksFilterOptions,
  tasksFilterSelectOptions,
} from '../shared/tasksFilter';
import UserTasks from './UserTasks';
import ColoniesList from './ColoniesList';

import styles from './Dashboard.css';

const MSG = defineMessages({
  labelFilter: {
    id: 'dashboard.Dashboard.labelFilter',
    defaultMessage: 'Filter',
  },
  placeholderFilter: {
    id: 'dashboard.Dashboard.placeholderFilter',
    defaultMessage: 'Filter',
  },
  initialTaskTitle: {
    id: 'dashboard.Dashboard.initialTaskTitle',
    defaultMessage: 'Get started with Colony',
  },
  myTasks: {
    id: 'dashboard.Dashboard.myTasks',
    defaultMessage: 'My Tasks',
  },
  myColonies: {
    id: 'dashboard.Dashboard.myColonies',
    defaultMessage: `My Colonies`,
  },
});

const displayName = 'dashboard.Dashboard';

const Dashboard = () => {
  const { username, walletAddress } = useLoggedInUser();

  return (
    <Form
      initialValues={{ filter: TasksFilterOptions.ALL_OPEN }}
      onSubmit={() => {}}
    >
      {({ values: { filter } }) => (
        <div className={styles.layoutMain} data-test="dashboard">
          <main className={styles.content}>
            <div className={styles.sectionTitle}>
              <Heading
                appearance={{
                  size: 'normal',
                  margin: 'none',
                  theme: 'dark',
                }}
                text={MSG.myTasks}
              />
            </div>
            <UserTasks
              initialTask={{
                title: MSG.initialTaskTitle,
                walletAddress,
              }}
              filter={
                <div className={styles.selectWrapper}>
                  <Select
                    appearance={{ alignOptions: 'right', theme: 'alt' }}
                    elementOnly
                    label={MSG.labelFilter}
                    name="filter"
                    options={tasksFilterSelectOptions}
                    placeholder={MSG.placeholderFilter}
                  />
                </div>
              }
              userClaimedProfile={!!username}
              filterOption={filter}
              walletAddress={walletAddress}
            />
          </main>
          <aside className={styles.sidebar}>
            <div className={styles.sectionTitle}>
              <Heading
                appearance={{
                  size: 'normal',
                  margin: 'none',
                  theme: 'dark',
                }}
                text={MSG.myColonies}
              />
            </div>
            <ColoniesList />
          </aside>
        </div>
      )}
    </Form>
  );
};

Dashboard.displayName = displayName;

export default Dashboard;
