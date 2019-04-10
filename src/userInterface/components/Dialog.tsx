import cn from 'classnames';
import React, {
  FunctionComponent,
  memo,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import usePrevious from '../../logic/usePrevious';
import './Dialog.css';
import Panel from './Panel';

const ANIMATION_DURATION = 150;

const root = document.getElementById('root')!;

interface Props {
  open: boolean;
  onClose: () => void;
  closeable?: boolean;
  children: ReactNode;
}

const Dialog: FunctionComponent<Props> = props => {
  const { open, onClose, closeable = true, children } = props;

  const [actuallyOpen, setActuallyOpen] = useState(open);
  const [closing, setClosing] = useState(false);

  const prevOpen = usePrevious(open);

  // `actuallyOpen` controls the open state in sync with `closing` - without it
  // there would be one rerender where `actuallyOpen` and `closing` are not synced
  // and `null` would be rendered - this causes all content to render from scratch
  // for the closing animation duration
  useEffect(() => {
    if (prevOpen && !open) {
      setActuallyOpen(false);
      setClosing(true);
    }
    if (!prevOpen && open) {
      setActuallyOpen(true);
    }
  }, [open]);

  const wrapper = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (closeable && wrapper.current!.isSameNode(event.target as any)) {
        onClose();
      }
    },
    [closeable, onClose]
  );

  useEffect(() => {
    if (!actuallyOpen) {
      const timeout = setTimeout(() => {
        setClosing(false);
      }, ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [actuallyOpen]);

  if (!actuallyOpen && !closing) {
    return null;
  }

  const result = (
    <div
      ref={wrapper}
      className={cn(
        'Dialog-root',
        closing ? 'Dialog-closing' : 'Dialog-opening'
      )}
      onClick={handleClose}
    >
      <Panel>{children}</Panel>
    </div>
  );

  return ReactDOM.createPortal(result, root);
};

export default memo(Dialog);
