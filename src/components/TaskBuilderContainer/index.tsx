import styles from "./index.module.scss";

const TaskBuilderContainer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.canvas}></div>
      <div className={styles.taskInputs}></div>
    </div>
  );
};

export default TaskBuilderContainer;
