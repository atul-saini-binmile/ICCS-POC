import { useState } from "react";
import CustomModal from "../CustomModal";
import TaskInputForm from "../TaskInputForm";
import styles from "./index.module.scss";

const TaskSelector = (props: any) => {
  const {
    tasks,
    setTasks,
    selectedTasks,
    currParent,
    handleTaskAddToFlow,
    coords,
  } = props;
  const [show, setShow] = useState(false);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Tasks List</h3>
      <div className={styles.create} onClick={() => setShow(true)}>
        + Create New Task
      </div>
      <div className={styles.wrapper}>
        {tasks.map((task: any) => {
          if (selectedTasks?.find((i: any) => i?.id === task?.id)) {
            return <></>;
          }
          return (
            <div
              className={styles.taskWrapper}
              key={task?.id}
              onClick={() => handleTaskAddToFlow(currParent, task, coords)}
            >
              {task?.taskName}
            </div>
          );
        })}
      </div>
      <CustomModal
        show={show}
        onHide={() => setShow(false)}
        title="Create New Task"
      >
        <div className={styles.modalContainer}>
          <div className={styles.modalButton}>
            <TaskInputForm
              tasks={tasks}
              setTasks={setTasks}
              setShow={setShow}
            />
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default TaskSelector;
