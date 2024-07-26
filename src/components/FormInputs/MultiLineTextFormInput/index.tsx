import { Controller, useForm } from "react-hook-form";
import {
  CheckboxInput,
  CustomButton,
  NumberInput,
  TextInput,
} from "../../BaseInputs";
import styles from "./index.module.scss";
import { FormType, TextInputType } from "../../../utils/enum";
import { IFormInput } from "../../../utils/interface";

const MultiLineFormInput = (props: IFormInput) => {
  const { handleFormBuild } = props;
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: any) => {
    handleFormBuild(FormType.MULTI_LINE_TEXT, {
      placeholder: data?.placeholder,
      maxLength: data?.maxLength ?? null,
      minLength: data?.minLength ?? null,
      required: !!data?.required,
      rows: data?.maxRows ?? null,
    });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Multi Line Input</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            name="maxRows"
            control={control}
            render={({ field: { onChange } }) => (
              <NumberInput onChange={onChange} placeholder="Max Rows" />
            )}
          />
        </div>
        <div className={styles.wrapper}>
          <Controller
            name="maxLength"
            control={control}
            render={({ field: { onChange } }) => (
              <NumberInput onChange={onChange} placeholder="Max length" />
            )}
          />
        </div>
        <div className={styles.wrapper}>
          <Controller
            name="minLength"
            control={control}
            render={({ field: { onChange } }) => (
              <NumberInput onChange={onChange} placeholder="Min Length" />
            )}
          />
        </div>
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
          <CustomButton type="submit">Submit</CustomButton>
        </div>
      </form>
    </div>
  );
};

export default MultiLineFormInput;
