/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import nanoid from 'nanoid';

import type { ConsumableItem } from './ItemsList';

import Button from '~core/Button';
import Popover from '~core/Popover';

import styles from './ItemsList.css';

const MSG = defineMessages({
  fallbackListButton: {
    id: 'dashboard.TaskDomains.fallbackListButton',
    defaultMessage: 'Open List',
  },
});

type Props = {
  collapsedList: Array<ConsumableItem>,
  list: Array<ConsumableItem>,
  children?: React$Element<*>,
  itemDisplayPrefix?: string,
  itemDisplaySuffix?: string,
};

type State = {
  /*
   * This values determines if any domain in the (newly opened) list was selected
   */
  listTouched: boolean,
  /*
   * Domain selected in the popover list
   */
  selectedItem: number | void,
  /*
   * Domain that is actually set on the task
   */
  setItem: number | void,
};

class ItemsList extends Component<Props, State> {
  static displayName = 'dashboard.TaskDomains';

  state = {
    listTouched: false,
    selectedItem: undefined,
    setItem: undefined,
  };

  /*
   * Handle clicking on each individual item in the list
   */
  handleSelectItem = (id: number) => {
    this.setState({ selectedItem: id, listTouched: true });
  };

  /*
   * Handle cleanup when closing the popover (or pressing cancel)
   *
   * If an item was selected, but not set (didn't submit the form) then we
   * need to re-set it back to the original set item.
   *
   * Otherwise the next time it will open it will show the selected one, and not
   * the actual set one.
   */
  handleCleanup = (callback?: () => void): void => {
    const { setItem } = this.state || undefined;
    this.setState({ selectedItem: setItem, listTouched: false }, callback);
  };

  /*
   * Set the item when clicking the confirm button
   */
  handleSetItem = (close: () => void) => {
    const {
      state: { selectedItem },
    } = this;
    this.setState(
      {
        setItem: selectedItem,
        selectedItem: undefined,
        listTouched: false,
      },
      close,
    );
  };

  /*
   * Helper to render an entry in the domains list
   *
   * @NOTE This will recursevly render nested children
   */
  renderListItem = (
    { id, name, children }: ConsumableItem,
    nestingCounter: number = 0,
  ) => {
    const { selectedItem } = this.state;
    const { itemDisplayPrefix = '', itemDisplaySuffix = '' } = this.props;
    /*
     * Add prefix/suffix
     */
    const decoratedName = `${itemDisplayPrefix}${name}${itemDisplaySuffix}`;
    /*
     * Recursevly render nested children
     */
    const recursiveChildRender = () => {
      if (children && children.length) {
        return children.map((item: ConsumableItem) =>
          this.renderListItem(item, nestingCounter + 1),
        );
      }
      return null;
    };
    return (
      <Fragment key={nanoid(id)}>
        <li
          className={selectedItem === id ? styles.selectedItem : null}
          style={{
            paddingLeft: `${nestingCounter *
              parseInt(styles.paddingValue, 10)}px`,
          }}
        >
          <button
            type="button"
            className={styles.item}
            onClick={() => this.handleSelectItem(id)}
            title={decoratedName}
          >
            {decoratedName}
          </button>
        </li>
        {recursiveChildRender()}
      </Fragment>
    );
  };

  render() {
    const {
      state: { setItem: setItemId, listTouched },
      props: {
        list = [],
        collapsedList = [],
        children,
        itemDisplayPrefix = '',
        itemDisplaySuffix = '',
      },
      handleSetItem,
      renderListItem,
    } = this;
    const currentItem: ConsumableItem | void = list.find(
      ({ id }) => id === setItemId,
    );
    return (
      <div className={styles.main}>
        <Popover
          trigger="click"
          placement="bottom"
          onClose={this.handleCleanup}
          content={({ close }) => (
            <div className={styles.itemsWrapper}>
              <ul className={styles.itemList}>
                {collapsedList.map((item: ConsumableItem) =>
                  renderListItem(item),
                )}
              </ul>
              <div className={styles.controls}>
                <Button
                  appearance={{ theme: 'secondary' }}
                  text={{ id: 'button.cancel' }}
                  onClick={() => this.handleCleanup(close)}
                />
                <Button
                  appearance={{ theme: 'primary' }}
                  text={{ id: 'button.confirm' }}
                  disabled={!listTouched}
                  onClick={() => handleSetItem(close)}
                />
              </div>
            </div>
          )}
        >
          {children || (
            /*
             * @NOTE In case there wasn't a child passed in, we render a
             * fallback button
             */
            <Button
              appearance={{ theme: 'primary' }}
              text={MSG.fallbackListButton}
            />
          )}
        </Popover>
        {/*
          * @TODO This should be passed _somehow_ outside of this component, so
          * that displaying it has a bigger degree of customization.
          * (Consumers maybe?)
          */}
        <div
          className={styles.selectedItemDisplay}
          title={
            currentItem &&
            `${itemDisplayPrefix}${currentItem.name}${itemDisplaySuffix}`
          }
        >
          {currentItem &&
            `${itemDisplayPrefix}${currentItem.name}${itemDisplaySuffix}`}
        </div>
      </div>
    );
  }
}

export default ItemsList;
