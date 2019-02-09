import React, {
  FunctionComponent,
  memo,
  useCallback,
  ChangeEvent,
} from 'react';
import useUniqueId from '../useUniqueId';

interface Props {
  value: string;
  label: string;
  onChange: (value: string) => void;
}

const Input: FunctionComponent<Props> = ({
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
      <input id={id} value={value} onChange={handleChange} />
    </div>
  );
};

export default memo(Input);
