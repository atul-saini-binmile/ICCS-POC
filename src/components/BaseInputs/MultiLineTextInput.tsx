import React, { useState } from "react";
import styles from "./index.module.scss";
import { IMultiLineInput } from "../../utils/interface";

const MultiLineInput: React.FC = (props: IMultiLineInput) => {
  const { onChange, placeholder = "", maxRows } = props;
  const [value, setValue] = useState("");

  const handleChange = (val: string) => {
    setValue(val);
    onChange && onChange(val);
  };

  return (
    <div className={styles.container}>
      <textarea
        className={`form-control ${styles.multiLineInput}`}
        value={value}
        onChange={(e) => handleChange(e?.target?.value)}
        placeholder={placeholder}
        rows={maxRows ?? 100}
        autoComplete="off"
      />
    </div>
  );
};

export default MultiLineInput;
