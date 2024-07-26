import { Controller, useForm } from "react-hook-form";
import { CheckboxInput, CustomButton, TextInput } from "../../BaseInputs";
import styles from "./index.module.scss";
import { DeleteIcon } from "../../../assets/DeleteIcon";
import { useEffect, useState } from "react";
import { IDropdownOption, IFormInput, IOption } from "../../../utils/interface";
import { FormType, TextInputType } from "../../../utils/enum";

const DropdownOption = (props: IDropdownOption) => {
  const { onDelete, id, handleChange, prevValue = "", prevLabel = "" } = props;
  const [label, setLabel] = useState(prevLabel);
  const [value, setValue] = useState(prevValue);

  useEffect(() => {
    handleChange && handleChange(label, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, value]);

  return (
    <div className={styles.option}>
      <p className={styles.optionHeading}>{`Option ${id}`}</p>
      <div className={styles.optionContainer}>
        <div className={styles.optionInput}>
          <div className={styles.optionWrapper}>
            <TextInput
              placeholder="Enter Label"
              onChange={(val) => setLabel(val)}
              prevValue={label}
            />
          </div>
          <div className={styles.optionWrapper}>
            <TextInput
              placeholder="Enter Value"
              onChange={(val) => setValue(val)}
              prevValue={value}
            />
          </div>
        </div>
        <div className={styles.optionIcon} onClick={onDelete}>
          <DeleteIcon />
        </div>
      </div>
    </div>
  );
};

const DropdownFormInput = (props: IFormInput) => {
  const { handleFormBuild } = props;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [options, setOptions] = useState<IOption[]>([
    { id: 1, label: "", value: "" },
  ]);

  const onSubmit = (data: any) => {
    handleFormBuild(FormType.DROPDOWN, {
      options: data?.options,
      placeholder: data?.placeholder,
      required: !!data?.required,
    });
  };

  const handleOptionDelete = (id: number | string) => {
    const updatedOptions = options?.filter((i) => i?.id !== id);
    setOptions(updatedOptions);
  };

  const handleOptionChange = (
    onChange: { (...event: any[]): void; (arg0: IOption[]): void },
    id: number | string,
    label: string,
    value: string
  ) => {
    const option = options?.find((i) => i?.id === id);
    const updatedOptions = options?.filter((i) => i?.id !== id);
    if (option) {
      option.label = label;
      option.value = value;
      updatedOptions?.push(option);
    }
    setOptions(updatedOptions);
    onChange(updatedOptions);
  };

  const handleOptionsValidation = () => {
    if (options?.length === 0) {
      return "Please add atleast one option";
    }
    const option = options?.find((i) => !i?.label || !i?.value);
    if (option) {
      return "This field is required";
    }
    return true;
  };

  const addOption = () => {
    setOptions([...options, { id: options?.length + 1, label: "", value: "" }]);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Dropdown Input</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.wrapper}>
          <Controller
            control={control}
            name="required"
            render={({ field: { onChange } }) => (
              <CheckboxInput placeholder="Required" handleChange={onChange} />
            )}
          />
        </div>
        <div className={styles.wrapper}>
          <Controller
            name="placeholder"
            control={control}
            rules={{
              required: "This field is required",
            }}
            render={({ field: { onChange } }) => (
              <TextInput
                type={TextInputType.TEXT}
                onChange={onChange}
                placeholder="Enter Placeholder"
              />
            )}
          />
          {errors?.placeholder?.message && (
            <p className={styles.error}>{`${errors?.placeholder?.message}`}</p>
          )}
        </div>
        <div className={styles.wrapper}>
          <Controller
            control={control}
            rules={{
              required: "This field is required",
              validate: handleOptionsValidation,
            }}
            name="options"
            render={({ field: { onChange } }) => (
              <>
                {options?.map((option, index) => (
                  <DropdownOption
                    key={option?.id}
                    id={index + 1}
                    onDelete={() => handleOptionDelete(option?.id)}
                    handleChange={(label, value) =>
                      handleOptionChange(onChange, option?.id, label, value)
                    }
                  />
                ))}
              </>
            )}
          />
          {errors?.options?.message && (
            <p className={styles.error}>{`${errors?.options?.message}`}</p>
          )}
          <div className={styles.addOption} onClick={addOption}>
            + Add Option
          </div>
        </div>
        <div className={styles.wrapper}>
          <CustomButton type="submit">Submit</CustomButton>
        </div>
      </form>
    </div>
  );
};

export default DropdownFormInput;
