import React, {
  HTMLAttributes,
  FunctionComponent,
  useRef,
  useState,
} from "react";
import { FaRegCopy } from "react-icons/fa";
import { Overlay, Tooltip } from "react-bootstrap";

import "./CopyIcon.scss";

interface CopyIconProps extends HTMLAttributes<HTMLElement> {
  value: string;
}

export const CopyIcon: FunctionComponent<CopyIconProps> = ({ value }) => {
  const target = useRef(null);
  const [showToolTip, setShowToolTip] = useState(false);

  const hideToolTip = () => setTimeout(() => setShowToolTip(false), 1000);

  const handleClick = () => {
    navigator.clipboard.writeText(value);
    setShowToolTip(true);
  };

  return (
    <>
      <span ref={target}>
        <FaRegCopy className="copy-icon" onClick={handleClick} />
      </span>
      <Overlay
        target={target.current}
        show={showToolTip}
        placement="bottom"
        onEntered={() => hideToolTip()}>
        {(props) => (
          <Tooltip id="tooltip" {...props}>
            Copied!
          </Tooltip>
        )}
      </Overlay>
    </>
  );
};
