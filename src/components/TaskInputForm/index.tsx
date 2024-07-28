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

const TaskInputForm = (props: any) => {
  const { tasks, setTasks, currParent, setShow } = props;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

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
        parent: [currParent],
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
            render={({ field: { onChange } }) => (
              <TextInput onChange={onChange} placeholder="Enter Task Name" />
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
            render={({ field: { onChange } }) => (
              <DropdownInput
                placeholder="Select Department"
                options={departmentOptions}
                handleChange={onChange}
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
            render={({ field: { onChange } }) => (
              <DropdownInput
                options={assigneeOptions}
                placeholder="Select Assignee"
                handleChange={onChange}
              />
            )}
          />
        </div>
        <div className={styles.wrapper}>
          <Controller
            control={control}
            name="taskStatus"
            render={({ field: { onChange } }) => (
              <DropdownInput
                options={taskStatusOptions}
                placeholder="Task Status"
                handleChange={onChange}
              />
            )}
          />
        </div>
        <div className={styles.wrapper}>
          <Controller
            control={control}
            name="approval"
            render={({ field: { onChange } }) => (
              <CheckboxInput
                placeholder="is approval required"
                handleChange={onChange}
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
