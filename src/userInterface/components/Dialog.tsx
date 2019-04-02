import React, {
  FunctionComponent,
  memo,
  MouseEvent,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import ReactDOM from 'react-dom';
import './Dialog.css';
import Panel from './Panel';

const root = document.getElementById('root')!;

interface Props {
  open: boolean;
  onClose: () => void;
  closeable?: boolean;
  children: ReactNode;
}

const Dialog: FunctionComponent<Props> = props => {
  const { open, onClose, closeable = true, children } = props;

  const wrapper = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (closeable && wrapper.current!.isSameNode(event.target as any)) {
        onClose();
      }
    },
    [onClose]
  );

  if (!open) {
    return null;
  }

  const result = (
    <div ref={wrapper} className="Dialog-root" onClick={handleClose}>
      <Panel>{children}</Panel>
    </div>
  );

  return ReactDOM.createPortal(result, root);
};

export default memo(Dialog);
