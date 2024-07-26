import { Controller, useForm } from "react-hook-form";
import { CheckboxInput, CustomButton, TextInput } from "../../BaseInputs";
import styles from "./index.module.scss";
import { FormType, TextInputType } from "../../../utils/enum";
import { IFormInput } from "../../../utils/interface";

const CheckboxFormInput = (props: IFormInput) => {
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
    handleFormBuild(FormType.CHECKBOX, {
      label: data?.label,
      required: !!data?.required,
    });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Checkbox Input</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.wrapper}>
          <Controller
            name="label"
            control={control}
            rules={{
              required: "This field is required",
            }}
            render={({ field: { onChange } }) => (
              <TextInput
                type={TextInputType.TEXT}
                onChange={onChange}
                placeholder="Enter Label"
              />
            )}
          />
          {errors?.label?.message && (
            <p className={styles.error}>{`${errors?.label?.message}`}</p>
          )}
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

export default CheckboxFormInput;
