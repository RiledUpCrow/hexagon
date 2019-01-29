import React, { FunctionComponent, memo, useState, useCallback } from "react";
import "./UI.css";

const UI: FunctionComponent = () => {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), [setOpen]);

  return (
    <div className="ui">
      {open && (
        <div className="paper">
          <h1 className="title">This is UI</h1>
          <button onClick={close}>Click</button>
        </div>
      )}
    </div>
  );
};

export default memo(UI);
