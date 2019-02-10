import React, {
  FunctionComponent,
  memo,
  useCallback,
  ChangeEvent,
} from 'react';
import useUniqueId from '../logic/useUniqueId';
import './TextInput.css';

interface Props {
  value: string;
  label: string;
  onChange: (value: string) => void;
}

const TextInput: FunctionComponent<Props> = ({
  value,
  label,
  onChange,
}): JSX.Element => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );
  const id = useUniqueId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input type="number" id={id} value={value} onChange={handleChange} />
    </div>
  );
};

export default memo(TextInput);
