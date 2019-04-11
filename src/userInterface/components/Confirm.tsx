import React, { FunctionComponent, memo, ReactNode, useState } from 'react';
import './Confirm.scss';
import Button, { ButtonProps } from './Button';
import Dialog from './Dialog';

interface Props extends ButtonProps {
  confirm: string;
  onClick: () => void;
  children?: ReactNode;
}

const Confirm: FunctionComponent<Props> = props => {
  const { confirm, onClick, children, ...buttonProps } = props;

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button {...buttonProps} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <p>{confirm}</p>
        <div className="Confirm-buttons">
          <Button
            color="secondary"
            className="Confirm-button"
            onClick={() => {
              setOpen(false);
              onClick();
            }}
          >
            Confirm
          </Button>
          <Button className="Confirm-button" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default memo(Confirm);
