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

const FlowTask = (props: any) => {
  const { task, handleTaskSubmit } = props;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  useEffect(() => {
    setValue("taskName", task?.taskName);
    setValue("description", task?.description);
    setValue("timeline", task?.timeline);
    setValue("department", task?.department);
    setValue("assignee", task?.assignee);
    setValue("taskStatus", task?.taskStatus);
    setValue("approval", task?.isApproved ?? false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const onSubmit = async (data: any) => {
    handleTaskSubmit({
      ...task,
      assignee: data?.assignee ?? null,
      taskStatus: data?.taskStatus ?? null,
      isApproved: !!data?.approval,
    });
  };

  return (
    <div className={styles.container} key={task?.toString()}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`${styles.wrapper} ${styles.disabled}`}>
          <Controller
            name="taskName"
            control={control}
            render={({ field: { onChange } }) => (
              <TextInput
                onChange={onChange}
                placeholder="Enter Task Name"
                prevValue={task?.taskName}
              />
            )}
          />
        </div>
        <div className={`${styles.wrapper} ${styles.disabled}`}>
          <Controller
            name="description"
            control={control}
            render={({ field: { onChange } }) => (
              <MultiLineInput
                onChange={onChange}
                placeholder="Enter Task Description"
                prevValue={task?.description}
              />
            )}
          />
        </div>
        <div className={`${styles.wrapper} ${styles.disabled}`}>
          <Controller
            control={control}
            name="timeline"
            render={({ field: { onChange } }) => (
              <NumberInput
                placeholder="Enter time required in hours"
                onChange={onChange}
                prevValue={task?.timeline}
              />
            )}
          />
        </div>
        <div className={`${styles.wrapper} ${styles.disabled}`}>
          <Controller
            control={control}
            name="department"
            render={({ field: { onChange } }) => (
              <DropdownInput
                placeholder="Select Department"
                options={departmentOptions}
                handleChange={onChange}
                prevValue={task?.department}
              />
            )}
          />
        </div>
        <div className={styles.wrapper}>
          <Controller
            control={control}
            name="assignee"
            render={({ field: { onChange } }) => (
              <DropdownInput
                options={assigneeOptions}
                placeholder="Select Assignee"
                handleChange={onChange}
                prevValue={task?.assignee}
              />
            )}
          />
        </div>
        <div className={styles.wrapper}>
          <Controller
            control={control}
            name="taskStatus"
            rules={{
              required: "This field is required",
            }}
            render={({ field: { onChange } }) => (
              <DropdownInput
                options={taskStatusOptions}
                placeholder="Task Status"
                handleChange={onChange}
                prevValue={task?.taskStatus}
              />
            )}
          />
          {errors?.taskStatus?.message && (
            <p className={styles.error}>{`${errors?.taskStatus?.message}`}</p>
          )}
        </div>
        {task?.approval && (
          <div className={styles.wrapper}>
            <Controller
              control={control}
              name="approval"
              render={({ field: { onChange, value } }) => (
                <div className={styles.approvalWrapper}>
                  <p className={styles.approvalTitle}>Approve this task ?</p>
                  <div className={styles.checkboxWrapper}>
                    <CheckboxInput
                      placeholder="Yes"
                      handleChange={(val) => {
                        onChange(true);
                      }}
                      prevValue={value ?? task?.isApproved}
                    />
                    <CheckboxInput
                      placeholder="No"
                      handleChange={(val) => {
                        onChange(false);
                      }}
                      prevValue={!value ?? !task?.isApproved}
                    />
                  </div>
                </div>
              )}
            />
          </div>
        )}
        <div className={`${styles.wrapper}`}>
          <Controller
            name="remarks"
            control={control}
            render={({ field: { onChange } }) => (
              <MultiLineInput
                onChange={onChange}
                placeholder="Enter Remarks"
                prevValue={task?.remarks ?? ""}
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

export default FlowTask;
