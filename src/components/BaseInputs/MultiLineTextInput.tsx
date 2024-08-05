import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { IMultiLineInput } from "../../utils/interface";

const MultiLineInput: React.FC<IMultiLineInput> = (props: IMultiLineInput) => {
  const { onChange, placeholder = "", maxRows, prevValue = "" } = props;
  const [value, setValue] = useState(prevValue);

  const handleChange = (val: string) => {
    setValue(val);
    onChange && onChange(val);
  };

  useEffect(() => {
    setValue(prevValue);
  }, [prevValue]);

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
