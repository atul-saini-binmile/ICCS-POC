import React from "react";
import styles from "./index.module.scss";

export interface ILineConnectorProps {
  from: { top: number; left: number };
  to: { top: number; left: number };
}

const LineConnector: React.FC<ILineConnectorProps> = ({ from, to }) => {
  const isVertical = from.left === to.left;
  const isHorizontal = from.top === to.top;

  const horizontalStart = isVertical ? from.left : Math.min(from.left, to.left);
  const verticalEnd = isHorizontal ? from.top : Math.max(from.top, to.top);

  return (
    <div className={styles.container}>
      <div className={styles.from} style={{ top: from.top, left: from.left }} />
      <div className={styles.to} style={{ top: to.top, left: to.left }} />
      <svg
        className={styles.line}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
      >
        <line
          x1={from.left}
          y1={from.top}
          x2={horizontalStart}
          y2={from.top}
          stroke="black"
          strokeWidth="2"
        />
        <line
          x1={horizontalStart}
          y1={from.top}
          x2={horizontalStart}
          y2={verticalEnd}
          stroke="black"
          strokeWidth="2"
        />
        <line
          x1={horizontalStart}
          y1={verticalEnd}
          x2={to.left}
          y2={verticalEnd}
          stroke="black"
          strokeWidth="2"
        />
        <line
          x1={to.left}
          y1={verticalEnd}
          x2={to.left}
          y2={to.top}
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default LineConnector;
