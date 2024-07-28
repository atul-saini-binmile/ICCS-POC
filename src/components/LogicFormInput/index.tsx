import { Controller, useForm } from "react-hook-form";
import styles from "./index.module.scss";
import { CustomButton, DropdownInput } from "../BaseInputs";
import { logicColOptions, logicOptions } from "../../utils/constants";

const LogicFormInput = (props: any) => {
  const { handleAddLogic } = props;
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  const onSubmit = (data: any) => {
    handleAddLogic(parseInt(data?.cols?.[0]?.value));
    console.log(data?.cols?.[0]?.value);
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
        {watch("logic") && (
          <div className={styles.wrapper}>
            <Controller
              control={control}
              name="cols"
              rules={{
                required: "This field is required",
              }}
              render={({ field: { onChange } }) => (
                <DropdownInput
                  options={logicColOptions}
                  placeholder="Select Number of Tasks"
                  handleChange={onChange}
                />
              )}
            />
            {errors?.cols?.message && (
              <p className={styles.error}>{`${errors?.cols?.message}`}</p>
            )}
          </div>
        )}
        <div className={styles.wrapper}>
          <CustomButton type="submit">Submit</CustomButton>
        </div>
      </form>
    </div>
  );
};

export default LogicFormInput;
