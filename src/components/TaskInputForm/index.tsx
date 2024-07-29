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
import localforage from "localforage";
import { StorageKeys } from "../../utils/enum";
import { useEffect } from "react";

const TaskInputForm = (props: any) => {
  const { tasks, setTasks, setShow, prevValues } = props;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  useEffect(() => {
    setValue("taskName", prevValues?.taskName);
    setValue("description", prevValues?.description);
    setValue("timeline", prevValues?.timeline);
    setValue("department", prevValues?.department);
    setValue("assignee", prevValues?.assignee);
    setValue("taskStatus", prevValues?.taskStatus);
    setValue("approval", prevValues?.approval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevValues]);

  const onSubmit = async (data: any) => {
    const newTasks = [
      ...tasks,
      {
        id: tasks?.length + 1,
        taskName: data?.taskName,
        description: data?.description,
        timeline: data?.timeline,
        department: data?.department,
        assignee: data?.assignee ?? null,
        taskStatus: data?.taskStatus ?? null,
        approval: !!data?.approval,
      },
    ];
    setTasks(newTasks);
    await localforage.setItem(StorageKeys.TASKS, newTasks);
    setShow(false);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.wrapper}>
          <Controller
            name="taskName"
            control={control}
            rules={{
              required: "This field is required",
            }}
            render={({ field: { onChange, value = "" } }) => (
              <TextInput
                onChange={onChange}
                placeholder="Enter Task Name"
                prevValue={value}
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
            render={({ field: { onChange, value = "" } }) => (
              <MultiLineInput
                onChange={onChange}
                placeholder="Enter Task Description"
                prevValue={value}
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
            render={({ field: { onChange, value = "" } }) => (
              <NumberInput
                placeholder="Enter time required in hours"
                onChange={onChange}
                prevValue={value}
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
                prevValue={value}
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
                prevValue={value}
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
                prevValue={value}
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
                prevValue={value}
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
