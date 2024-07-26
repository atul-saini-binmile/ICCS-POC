import Dropdown from "./DropdownInput";
import styles from "./index.module.scss";

const options = [
  { id: 1, value: "option1", label: "Option 1" },
  { id: 2, value: "option2", label: "Option 2" },
  { id: 3, value: "option3", label: "Option 3" },
];

const DropdownInput = () => {
  return (
    <div className={styles.container}>
      <Dropdown
        options={options}
        isMulti={true}
        showFilter={true}
        placeholder="Select Option"
      />
      <Dropdown options={options} isMulti={false} />
    </div>
  );
};

export default DropdownInput;
