/* @flow */
import 'core-js/fn/array/find-index';
import React, { Component } from 'react';

import type { MessageDescriptor } from 'react-intl';
import type { SelectOptionType } from './types';

import asField from '../asField';
import Icon from '../../Icon';
import InputLabel from '../InputLabel';
import SelectListBox from './SelectListBox.jsx';

import styles from './Select.css';

import { DOWN, ENTER, ESC, SPACE, UP, TAB } from './keyTypes';

type Appearance = {
  align?: 'left' | 'center' | 'right',
};

type Props = {
  /** Available `option`s for the select */
  options: Array<SelectOptionType>,
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
  /** @ignore Will be injected by `asField` */
  $id: string,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** @ignore Will be injected by `asField` */
  $value?: string,
  /** @ignore Will be injected by `asField` */
  $touched?: boolean,
  /** @ignore Will be injected by `asField` */
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: { [string]: string },
  ) => string,
  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void,
  /** @ignore Will be injected by `asField` */
  setError: (val: any) => void,
  /** @ignore Standard input field property */
  onChange: Function,
};

type State = {
  isLoading: boolean,
  isOpen: boolean,
  checkedOption: number,
  selectedOption: number,
};

class Select extends Component<Props, State> {
  combobox: ?HTMLElement;

  wrapper: ?HTMLElement;

  static displayName = 'Select';

  static defaultProps = {
    appearance: { align: 'left' },
    options: [],
  };

  constructor(props: Props, context) {
    super(props, context);

    const { $value } = props;

    this.state = {
      isOpen: false,
      isLoading: false,
      checkedOption: this.getCheckedOption($value),
      selectedOption: -1,
    };
  }

  componentWillReceiveProps({ $value: nextValue }: Props) {
    const { $value } = this.props;
    if ($value !== nextValue) {
      this.setState({
        checkedOption: this.getCheckedOption(nextValue),
      });
    }
  }

  getCheckedOption = (value: string) => {
    const { options } = this.props;
    return options.findIndex(option => option.value === value);
  };

  handleOutsideClick = (evt: MouseEvent) => {
    if (this.wrapper && !this.wrapper.contains(evt.target)) {
      this.close();
    }
  };

  open = () => {
    const { disabled } = this.props;
    const { isLoading } = this.state;
    if (disabled || isLoading) {
      return;
    }
    this.setState({ isOpen: true });
    if (document.body) {
      document.body.addEventListener('click', this.handleOutsideClick, true);
    }
  };

  close = () => {
    this.setState({ isOpen: false, selectedOption: -1 });
    if (this.combobox) {
      this.combobox.focus();
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
    switch (key) {
      case SPACE:
        this.close();
        break;
      case UP:
        this.goUp();
        break;
      case DOWN:
        this.goDown();
        break;
      case TAB:
        this.checkOption();
        break;
      case ENTER: {
        // Do not submit form
        evt.preventDefault();
        this.checkOption();
        break;
      }
      default:
    }
  };

  handleKeyOnClosed = (evt: SyntheticKeyboardEvent<*>) => {
    const { key } = evt;
    const { checkedOption } = this.state;
    if ([UP, DOWN, SPACE].indexOf(key) > -1) {
      this.setState({ selectedOption: checkedOption });
      this.open();
    }
  };

  handleKeyUp = (evt: SyntheticKeyboardEvent<*>) => {
    // Special keyUp handling for ESC (modals)
    const { isOpen } = this.state;
    const { key } = evt;
    if (isOpen && key === ESC) {
      evt.stopPropagation();
      this.close();
    }
  };

  handleKeyDown = (evt: SyntheticKeyboardEvent<*>) => {
    const { isOpen } = this.state;
    if (isOpen) {
      this.handleKeyOnOpen(evt);
      return;
    }
    this.handleKeyOnClosed(evt);
  };

  toggle = () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  };

  checkOption = async () => {
    const { selectedOption, checkedOption } = this.state;
    if (selectedOption === checkedOption || selectedOption === -1) {
      // No change
      return;
    }
    const { onChange, options } = this.props;
    const { value } = options[selectedOption];
    this.setState({ isLoading: true });
    try {
      await onChange(value);
    } catch (e) {
      // Do nothing (error handling happens in the action creator)
    } finally {
      this.setState({ isLoading: false });
      this.close();
    }
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
      formatIntl,
      label,
      options,
      placeholder,
      setValue,
      setError,
      ...props
    } = this.props;
    const { isOpen, isLoading, checkedOption, selectedOption } = this.state;
    const activeOption = options[checkedOption];
    const listboxId = `select-listbox-${$id}`;
    const activeOptionLabel = formatIntl(activeOption && activeOption.label);
    return (
      <div
        className={styles.main}
        onKeyUp={this.handleKeyUp}
        onKeyDown={this.handleKeyDown}
        ref={e => {
          this.wrapper = e;
        }}
        role="presentation"
      >
        {!elementOnly && label ? (
          <InputLabel id={$id} label={label} error={$error} help={help} />
        ) : null}
        <div
          className={styles.select}
          role="combobox"
          aria-controls={$id}
          aria-owns={listboxId}
          aria-expanded={isOpen}
          aria-label={elementOnly ? label : null}
          aria-labelledby={!elementOnly ? `${$id}_label` : null}
          aria-disabled={disabled}
          aria-busy={isLoading}
          tabIndex="0"
          onClick={this.toggle}
          onKeyDown={this.toggle}
          ref={e => {
            this.combobox = e;
          }}
          id={$id}
          {...props}
        >
          <div className={styles.activeOption}>
            <span>{activeOptionLabel || placeholder}</span>
          </div>
          <span className={styles.loadingContainer}>
            {isLoading ? (
              <span className={styles.loading} />
            ) : (
              <Icon
                name="arrow-down-small"
                title="expand"
                role="presentation"
                size="small"
              />
            )}
          </span>
        </div>
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
            />
          )}
      </div>
    );
  }
}

export default asField()(Select);
