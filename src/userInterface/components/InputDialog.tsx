import React, {
  FunctionComponent,
  memo,
  useCallback,
  useState,
  ReactNode,
} from 'react';
import './InputDialog.scss';
import Button, { ButtonProps } from './Button';
import Dialog from './Dialog';
import TextInput from './TextInput';

interface Props extends ButtonProps {
  onInput?: (input: string) => void;
  message?: string;
  initialValue?: string;
  children?: ReactNode;
}

const InputDialog: FunctionComponent<Props> = props => {
  const {
    onInput = () => {},
    message = 'Input',
    initialValue,
    children,
    ...buttonProps
  } = props;

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(
    initialValue === undefined ? '' : initialValue
  );

  const handleOpen = useCallback(() => {
    setEditing(true);
  }, []);

  const handleClose = useCallback(() => {
    setEditing(false);
  }, []);

  const handleRename = useCallback(() => {
    handleClose();
    onInput(text);
  }, [text]);

  return (
    <>
      <Button {...buttonProps} onClick={handleOpen}>
        {children}
      </Button>
      <Dialog open={editing} onClose={handleClose}>
        <TextInput
          autoFocus
          label={message}
          onEnter={handleRename}
          onChange={setText}
          value={text}
        />
        <div className="InputDialog-buttons">
          <Button
            color="secondary"
            className="InputDialog-button"
            onClick={handleRename}
          >
            Confirm
          </Button>
          <Button className="InputDialog-button" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default memo(InputDialog);
