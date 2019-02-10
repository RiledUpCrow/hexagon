import React, {
  FunctionComponent,
  memo,
  useCallback,
  ChangeEvent,
} from 'react';
import useUniqueId from '../logic/useUniqueId';

interface Props {
  value: number;
  label: string;
  onChange: (value: number) => void;
}

const Input: FunctionComponent<Props> = ({
  value,
  label,
  onChange,
}): JSX.Element => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(Number(event.target.value));
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

export default memo(Input);
