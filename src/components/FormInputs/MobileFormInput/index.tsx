import { Controller, useForm } from "react-hook-form";
import { countryCodes } from "../../../utils/constants";
import { FormType, TextInputType } from "../../../utils/enum";
import {
  CheckboxInput,
  CustomButton,
  DropdownInput,
  TextInput,
} from "../../BaseInputs";
import styles from "./index.module.scss";
import { IFormInput } from "../../../utils/interface";

const countryDropdownOptions = countryCodes?.map((item) => ({
  id: item?.countryCode,
  label: `${item?.countryName} (${item?.countryMobileExtension})`,
  value: `${item?.lengthOfMobileNumber}`,
}));

const MobileFormInput = (props: IFormInput) => {
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
    handleFormBuild(FormType.MOBILE, {
      placeholder: data?.placeholder,
      countryCode: data?.countryCode ?? null,
      required: !!data?.required,
    });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Mobile Input</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.wrapper}>
          <Controller
            control={control}
            name="countryCode"
            rules={{
              required: "This field is Required",
            }}
            render={({ field: { onChange } }) => (
              <DropdownInput
                options={countryDropdownOptions}
                showFilter
                placeholder="Select Country"
                filterPlaceholder="Search"
                handleChange={onChange}
              />
            )}
          />
          {errors?.countryCode?.message && (
            <p className={styles.error}>{`${errors?.countryCode?.message}`}</p>
          )}
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

export default MobileFormInput;
