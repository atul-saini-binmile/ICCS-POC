import { useForm, Controller } from "react-hook-form";
import { FormType, TextInputType } from "../../../utils/enum";
import {
  TextInput,
  NumberInput,
  CheckboxInput,
  CustomButton,
} from "../../BaseInputs";
import styles from "./index.module.scss";
import { IFormInput } from "../../../utils/interface";

const EmailFormInput = (props: IFormInput) => {
  const { handleFormBuild } = props;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: any) => {
    handleFormBuild(FormType.EMAIL, {
      placeholder: data?.placeholder,
      maxLength: data?.maxLength ?? null,
      minLength: data?.minLength ?? null,
      required: !!data?.required,
    });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Email Input</h3>
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

export default EmailFormInput;
