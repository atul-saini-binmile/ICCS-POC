import React, { useState } from "react";
import styles from "./index.module.scss";
import { ICheckboxInput } from "../../utils/interface";

const CheckboxInput: React.FC<ICheckboxInput> = (props) => {
  const { placeholder, handleChange } = props;
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    handleChange && handleChange(e.target.checked);
  };

  return (
    <div className={`${styles.container} ${styles.formContainer}`}>
      <input
        type="checkbox"
        className={`form-check-input ${styles.checkboxInput}`}
        id="acceptTerms"
        checked={checked}
        onChange={handleCheckboxChange}
        autoComplete="off"
      />
      <label
        className={`form-check-label ${styles.checkboxLabel}`}
        htmlFor="acceptTerms"
      >
        {placeholder}
      </label>
    </div>
  );
};

export default CheckboxInput;
