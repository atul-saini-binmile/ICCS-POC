import { Controller, useForm } from "react-hook-form";
import styles from "./index.module.scss";
import { CustomButton, DropdownInput } from "../BaseInputs";
import { logicOptions } from "../../utils/constants";

const LogicFormInput = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Add new Logic</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.wrapper}>
          <Controller
            control={control}
            name="logic"
            rules={{
              required: "This field is required",
            }}
            render={({ field: { onChange } }) => (
              <DropdownInput
                options={logicOptions}
                placeholder="Select Logic"
                handleChange={onChange}
              />
            )}
          />
          {errors?.logic?.message && (
            <p className={styles.error}>{`${errors?.logic?.message}`}</p>
          )}
        </div>
        <div className={styles.wrapper}>
          <CustomButton type="submit">Submit</CustomButton>
        </div>
      </form>
    </div>
  );
};

export default LogicFormInput;
