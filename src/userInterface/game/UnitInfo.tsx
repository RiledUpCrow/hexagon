import React, { FunctionComponent, memo } from 'react';
import Unit from '../../data/Unit';
import { UnitType } from '../../data/UnitType';
import './UnitInfo.css';

interface Props {
  unit: Unit;
}

const names: { [type in UnitType]: string } = {
  WARRIOR: 'Warrior',
};

const UnitInfo: FunctionComponent<Props> = ({ unit }): JSX.Element => {
  const name = names[unit.type];
  return (
    <div className="UnitInfo-root">
      <h1 className="UnitInfo-title">{name}</h1>
      <p className="UnitInfo-position">
        {unit.position.x}, {unit.position.y}
      </p>
    </div>
  );
};

export default memo(UnitInfo);
