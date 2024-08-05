import { Controller, useForm } from "react-hook-form";
import {
  CheckboxInput,
  CustomButton,
  DropdownInput,
  MultiLineInput,
  NumberInput,
  TextInput,
} from "../BaseInputs";
import styles from "./index.module.scss";
import {
  assigneeOptions,
  departmentOptions,
  taskStatusOptions,
} from "../../utils/constants";
import { useEffect } from "react";

const TaskInputForm = (props: any) => {
  const { setShow, onAddNode, prevValues, onUpdateNode } = props;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  useEffect(() => {
    if (prevValues) {
      setValue("taskName", prevValues?.taskName);
      setValue("description", prevValues?.description);
      setValue("timeline", prevValues?.timeline);
      setValue("department", prevValues?.department);
      setValue("assignee", prevValues?.assignee);
      setValue("taskStatus", prevValues?.taskStatus);
      setValue("approval", prevValues?.approval);
    }
    console.log(prevValues, "11111");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevValues]);

  const onSubmit = async (data: any) => {
    prevValues
      ? onUpdateNode({
          ...prevValues,
          taskName: data?.taskName,
          description: data?.description,
          timeline: data?.timeline,
          department: data?.department,
          assignee: data?.assignee ?? null,
          taskStatus: data?.taskStatus ?? null,
          approval: !!data?.approval,
        })
      : onAddNode({
          taskName: data?.taskName,
          description: data?.description,
          timeline: data?.timeline,
          department: data?.department,
          assignee: data?.assignee ?? null,
          taskStatus: data?.taskStatus ?? null,
          approval: !!data?.approval,
        });
    setShow && setShow(false);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.wrapper} key={prevValues?.toString()}>
          <Controller
            name="taskName"
            control={control}
            rules={{
              required: "This field is required",
            }}
            render={({ field: { onChange } }) => (
              <TextInput
                onChange={onChange}
                placeholder="Enter Task Name"
                prevValue={prevValues?.taskName}
              />
            )}
          />
          {errors?.taskName?.message && (
            <p className={styles.error}>{`${errors?.taskName?.message}`}</p>
          )}
        </div>
        <div className={styles.wrapper}>
          <Controller
            name="description"
            control={control}
            rules={{
              required: "This field is required",
            }}
            render={({ field: { onChange } }) => (
              <MultiLineInput
                onChange={onChange}
                placeholder="Enter Task Description"
                prevValue={prevValues?.description}
              />
            )}
          />
          {errors?.description?.message && (
            <p className={styles.error}>{`${errors?.description?.message}`}</p>
          )}
        </div>
        <div className={styles.wrapper}>
          <Controller
            control={control}
            name="timeline"
            rules={{
              required: "This field is required",
            }}
            render={({ field: { onChange } }) => (
              <NumberInput
                placeholder="Enter time required in hours"
                onChange={onChange}
                prevValue={prevValues?.timeline}
              />
            )}
          />
          {errors?.timeline?.message && (
            <p className={styles.error}>{`${errors?.timeline?.message}`}</p>
          )}
        </div>
        <div className={styles.wrapper}>
          <Controller
            control={control}
            name="department"
            rules={{
              required: "This field is required",
            }}
            render={({ field: { onChange, value } }) => (
              <DropdownInput
                placeholder="Select Department"
                options={departmentOptions}
                handleChange={onChange}
                prevValue={prevValues?.department}
              />
            )}
          />
          {errors?.department?.message && (
            <p className={styles.error}>{`${errors?.department?.message}`}</p>
          )}
        </div>
        <div className={styles.wrapper}>
          <Controller
            control={control}
            name="assignee"
            render={({ field: { onChange, value } }) => (
              <DropdownInput
                options={assigneeOptions}
                placeholder="Select Assignee"
                handleChange={onChange}
                prevValue={prevValues?.assignee}
              />
            )}
          />
        </div>
        <div className={styles.wrapper}>
          <Controller
            control={control}
            name="taskStatus"
            render={({ field: { onChange, value } }) => (
              <DropdownInput
                options={taskStatusOptions}
                placeholder="Task Status"
                handleChange={onChange}
                prevValue={prevValues?.taskStatus}
              />
            )}
          />
        </div>
        <div className={styles.wrapper}>
          <Controller
            control={control}
            name="approval"
            render={({ field: { onChange, value } }) => (
              <CheckboxInput
                placeholder="is approval required"
                handleChange={onChange}
                prevValue={prevValues?.approval}
              />
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

export default TaskInputForm;
