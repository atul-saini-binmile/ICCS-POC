import { useState } from "react";
import styles from "./index.module.scss";
import { ITextInput } from "../../utils/interface";
import { TextInputType } from "../../utils/enum";

function TextInput(props: ITextInput) {
  const {
    type = "text",
    maxLen = null,
    onChange,
    placeholder = "",
    prevValue = "",
  } = props;

  const [value, setValue] = useState(prevValue);

  const handleChange = (val: string) => {
    let regex = /^[\s\S]*$/;
    switch (type) {
      case TextInputType.TEXT:
        regex = /^[A-Za-z\s.,!@#$%^&*)(+=._-]*$/;
        break;
      case TextInputType.EMAIL:
        regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        break;
      case TextInputType.ALPHA_NUMERIC:
        regex = /^[a-zA-Z0-9]*$/;
        break;
      default:
        regex = /^[\s\S]*$/;
        break;
    }

    if (regex.test(val) && (maxLen !== null ? val?.length <= maxLen : true)) {
      setValue(val);
      onChange && onChange(val);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <input
          type="text"
          className="form-control"
          id="textInput"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default TextInput;
