import React, {
  FunctionComponent,
  useEffect,
  useState,
  useCallback,
} from 'react';
import './Notification.css';

interface Props {
  text: string;
  time?: number;
}

const Notification: FunctionComponent<Props> = ({ text, time = 10 }) => {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (text) {
      setHidden(false);
      setOpen(true);
      const timeout = setTimeout(close, time * 1000);
      return () => clearTimeout(timeout);
    }
  }, [text]);

  useEffect(() => {
    if (!open && !hidden) {
      const timeout = setTimeout(() => setHidden(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [open, hidden]);

  if (hidden) {
    return null;
  }

  return (
    <div
      className={[
        'Notification-container',
        open ? 'Notification-show' : 'Notification-hide',
      ].join(' ')}
    >
      <div className="Notification-root" onClick={close}>
        {text}
      </div>
    </div>
  );
};

export default Notification;
