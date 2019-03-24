import React, { FunctionComponent, memo, useCallback } from 'react';
import './NumberPicker.css';
import Button from './Button';
import between from '../../logic/between';
import { Icon } from 'react-icons-kit';
import { stepBackward } from 'react-icons-kit/fa/stepBackward';
import { stepForward } from 'react-icons-kit/fa/stepForward';
import { plus } from 'react-icons-kit/fa/plus';
import { minus } from 'react-icons-kit/fa/minus';

interface Props {
  value: number;
  label: string;
  step?: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

const NumberPicker: FunctionComponent<Props> = ({
  value,
  label,
  onChange,
  step = 1,
  min,
  max,
}): JSX.Element => {
  const incement = useCallback(() => {
    onChange(between(value + step, min, max));
  }, [value, step, min, max]);
  const decrement = useCallback(() => {
    onChange(between(value - step, min, max));
  }, [value, step, min, max]);
  const toMax = useCallback(() => {
    if (max === undefined) {
      return;
    }
    onChange(between(max, min, max));
  }, [value, step, min, max]);
  const toMin = useCallback(() => {
    if (min === undefined) {
      return;
    }
    onChange(between(min, min, max));
  }, [value, step, min, max]);

  return (
    <div className="NumberPicker-root">
      <p className="NumberPicker-label">{label}</p>
      {min !== undefined && (
        <Button size="small" onClick={toMin} disabled={value === min}>
          <Icon icon={stepBackward} />
        </Button>
      )}
      <Button size="small" onClick={decrement} disabled={value === min}>
        <Icon icon={minus} />
      </Button>
      <p className="NumberPicker-value">{value}</p>
      <Button size="small" onClick={incement} disabled={value === max}>
        <Icon icon={plus} />
      </Button>
      {max !== undefined && (
        <Button size="small" onClick={toMax} disabled={value === max}>
          <Icon icon={stepForward} />
        </Button>
      )}
    </div>
  );
};

export default memo(NumberPicker);
