import React from "react";
import styles from "./customButton.module.scss";
import { ICustomButtonProps } from "../../utils/interface";

const CustomButton: React.FC<ICustomButtonProps> = ({
  type = "button",
  onClick,
  children,
  disabled,
}) => {
  return (
    <button
      type={type}
      onClick={type === "button" ? onClick : undefined}
      className={`${styles.customButton} btn btn-primary`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default CustomButton;
