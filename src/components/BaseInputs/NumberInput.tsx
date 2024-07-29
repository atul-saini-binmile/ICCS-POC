import { useState } from "react";
import styles from "./index.module.scss";
import { INumberInput } from "../../utils/interface";

const NumberInput = (props: INumberInput) => {
  const { maxLen = null, onChange, placeholder = "", prevValue = "" } = props;
  const [value, setValue] = useState<number | string>(prevValue);

  const handleChange = (val: string) => {
    if (val === "") {
      setValue("");
    }
    if (/^\d*$/.test(val) && (maxLen !== null ? val?.length <= maxLen : true)) {
      setValue(val);
      onChange && onChange(val);
    }
  };

  return (
    <div className={styles.container}>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          id="numberInput"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default NumberInput;
