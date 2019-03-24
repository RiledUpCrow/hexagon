import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  memo,
  useCallback,
  RefObject,
} from 'react';
import useUniqueId from '../../logic/useUniqueId';
import './TextInput.css';

interface Props {
  value: string;
  label: string;
  type?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onChange: (value: string) => void;
  onEnter?: () => void;
  inputRef?: RefObject<HTMLInputElement>;
}

const TextInput: FunctionComponent<Props> = ({
  value,
  label,
  type,
  disabled = false,
  autoFocus = false,
  onChange,
  onEnter = () => undefined,
  inputRef,
}): JSX.Element => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );
  const handleKey = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onEnter();
      }
    },
    [onEnter]
  );
  const id = useUniqueId();

  return (
    <div className="TextInput-root">
      <label className="TextInput-label" htmlFor={id}>
        {label}
      </label>
      <input
        ref={inputRef}
        autoFocus={autoFocus}
        disabled={disabled}
        className="TextInput-input"
        id={id}
        value={value}
        type={type}
        onChange={handleChange}
        onKeyPress={handleKey}
      />
    </div>
  );
};

export default memo(TextInput);
