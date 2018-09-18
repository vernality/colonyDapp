/* @flow */
import type { MessageDescriptor } from 'react-intl';

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import 'core-js/fn/array/find-index';

import { getMainClasses } from '~utils/css';

import styles from './Select.css';

import Icon from '../../Icon';

import asField from '../asField';
import InputLabel from '../InputLabel';

import type { Appearance } from './types';

import SelectListBox from './SelectListBox.jsx';

import { DOWN, ENTER, ESC, SPACE, UP, TAB } from './keyTypes';

const MSG = defineMessages({
  expandIconHTMLTitle: {
    id: 'Select.expandIconHTMLTitle',
    defaultMessage: 'expand',
  },
});

type Props = {
  /** Available `option`s for the select */
  options: Array<{
    label: MessageDescriptor | string,
    value: string,
  }>,
  /** Appearance object */
  appearance: Appearance,
  /** Connect to form state (will inject `$value`, `$id`, `$error`, `$touched`), is `true` by default */
  connect?: boolean,
  /** Should `select` be disabled */
  disabled?: boolean,
  /** Just render the `<input>` element without label */
  elementOnly?: boolean,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: { [string]: string },
  /** Pass a ref to the `<input>` element */
  innerRef?: (ref: ?HTMLElement) => void,
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: { [string]: string },
  /** Input field name (form variable) */
  name: string,
  /** Placeholder for input */
  placeholder?: string,
  /** Will be injected by `asField`, or must be supplied if unconnected */
  $value: string,
  /** Will be injected by `asField`, or must be manually supplied if unconnected */
  setValue: (val: any) => void,
  /** @ignore Will be injected by `asField` */
  $id: string,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** @ignore Will be injected by `asField` */
  $touched?: boolean,
  /** @ignore Will be injected by `asField` */
  isSubmitting?: boolean,
  /** @ignore Will be injected by `asField` */
  'aria-labelledby': string,
  /** @ignore Will be injected by `asField` */
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: { [string]: string },
  ) => string,
  /** @ignore Will be injected by `asField` */
  setError: (val: any) => void,
  /** @ignore Standard input field property */
  onChange: (val: any) => void,
};

type State = {
  isOpen: boolean,
  selectedOption: number,
};

class Select extends Component<Props, State> {
  comboboxNode: ?HTMLElement;

  wrapperNode: ?HTMLElement;

  static displayName = 'Select';

  static defaultProps = {
    appearance: { alignOptions: 'left', theme: 'default' },
    options: [],
  };

  state = {
    isOpen: false,
    selectedOption: -1,
  };

  componentWillUnmount() {
    if (document.body) {
      document.body.removeEventListener('click', this.handleOutsideClick, true);
    }
  }

  getCheckedOption = () => {
    const { $value, options } = this.props;
    return options.findIndex(option => option.value === $value);
  };

  handleOutsideClick = (evt: MouseEvent) => {
    if (
      this.wrapperNode &&
      evt.target instanceof Node &&
      !this.wrapperNode.contains(evt.target)
    ) {
      this.close();
    }
  };

  open = () => {
    const { disabled } = this.props;
    if (disabled) return;
    this.setState({ isOpen: true });
    if (document.body) {
      document.body.addEventListener('click', this.handleOutsideClick, true);
    }
  };

  close = () => {
    this.setState({ isOpen: false, selectedOption: -1 });
    if (this.comboboxNode) {
      this.comboboxNode.focus();
    }
    if (document.body) {
      document.body.removeEventListener('click', this.handleOutsideClick, true);
    }
  };

  goUp = () => {
    const { selectedOption } = this.state;
    if (selectedOption > 0) {
      this.setState({ selectedOption: selectedOption - 1 });
    }
  };

  goDown = () => {
    const { options } = this.props;
    const { selectedOption } = this.state;
    if (selectedOption < options.length - 1) {
      this.setState({ selectedOption: selectedOption + 1 });
    }
  };

  handleKeyOnOpen = (evt: SyntheticKeyboardEvent<*>) => {
    const { key } = evt;
    const { selectedOption } = this.state;
    const checkedOption = this.getCheckedOption();
    switch (key) {
      case SPACE: {
        // prevent page long-scroll when in view
        evt.preventDefault();
        this.close();
        break;
      }
      case UP: {
        // prevent page scroll when in view
        evt.preventDefault();
        this.goUp();
        break;
      }
      case DOWN: {
        // prevent page scroll when in view
        evt.preventDefault();
        this.goDown();
        break;
      }
      case TAB: {
        if (checkedOption === selectedOption || selectedOption === -1) {
          // no change
          this.close();
        }
        this.checkOption();
        break;
      }
      case ENTER: {
        // Do not submit form
        evt.preventDefault();
        this.checkOption();
        break;
      }
      default:
    }
  };

  handleKeyOnClosed = (evt: SyntheticKeyboardEvent<HTMLElement>) => {
    const { key } = evt;
    const checkedOption = this.getCheckedOption();
    if ([UP, DOWN, SPACE].indexOf(key) > -1) {
      evt.preventDefault();
      this.setState({ selectedOption: checkedOption });
      this.open();
    }
  };

  handleKeyUp = (evt: SyntheticKeyboardEvent<HTMLElement>) => {
    // Special keyUp handling for ESC (modals)
    const { isOpen } = this.state;
    const { key } = evt;
    if (isOpen && key === ESC) {
      evt.stopPropagation();
      this.close();
    }
  };

  handleKeyDown = (evt: SyntheticKeyboardEvent<HTMLElement>) => {
    const { isOpen } = this.state;
    if (isOpen) {
      this.handleKeyOnOpen(evt);
      return;
    }
    this.handleKeyOnClosed(evt);
  };

  toggle = () => {
    const { isOpen } = this.state;
    if (isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  checkOption = () => {
    const { setValue, options } = this.props;
    const { selectedOption } = this.state;
    const checkedOption = this.getCheckedOption();
    if (selectedOption === checkedOption || selectedOption === -1) {
      // No change
      return;
    }
    const { value } = options[selectedOption];
    setValue(value);
    this.close();
  };

  registerComboboxNode = (node: ?HTMLElement) => {
    this.comboboxNode = node;
  };

  registerWrapperNode = (node: ?HTMLElement) => {
    this.wrapperNode = node;
  };

  selectOption = (idx: number) => {
    this.setState({ selectedOption: idx });
  };

  render() {
    const {
      appearance,
      elementOnly,
      $error,
      help,
      disabled,
      $id,
      $value,
      $touched,
      formatIntl,
      label,
      options,
      placeholder,
      setValue,
      isSubmitting,
      setError,
      name,
      ...props
    } = this.props;
    const { isOpen, selectedOption } = this.state;
    const checkedOption = this.getCheckedOption();
    const activeOption = options[checkedOption];
    const listboxId = `select-listbox-${$id}`;
    const activeOptionLabel = formatIntl(activeOption && activeOption.label);
    const ariaLabelledby = props['aria-labelledby'];
    return (
      <div className={styles.main} ref={this.registerWrapperNode}>
        {!elementOnly && label ? (
          <InputLabel inputId={$id} label={label} error={$error} help={help} />
        ) : null}
        <button
          className={`${styles.select} ${getMainClasses(appearance, styles)}`}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-label={label}
          aria-labelledby={ariaLabelledby}
          aria-disabled={disabled}
          tabIndex="0"
          ref={this.registerComboboxNode}
          onClick={this.toggle}
          onKeyUp={this.handleKeyUp}
          onKeyDown={this.handleKeyDown}
          type="button"
          name={name}
          {...props}
        >
          <div className={styles.selectInner}>
            <div className={styles.activeOption}>
              <span>{activeOptionLabel || placeholder}</span>
            </div>
            <span className={styles.selectExpandContainer}>
              <Icon name="caret-down-small" title={MSG.expandIconHTMLTitle} />
            </span>
          </div>
        </button>
        {isOpen &&
          options.length && (
            <SelectListBox
              checkedOption={checkedOption}
              selectedOption={selectedOption}
              listboxId={listboxId}
              options={options}
              onSelect={this.selectOption}
              onClick={this.checkOption}
              formatIntl={formatIntl}
              appearance={appearance}
              ariaLabelledby={ariaLabelledby}
              name={name}
            />
          )}
      </div>
    );
  }
}

export default asField()(Select);