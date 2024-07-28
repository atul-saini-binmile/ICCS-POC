import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { IFormBuildStorageItem } from "../../utils/interface";
import localforage from "localforage";
import { FlowFieldType, StorageKeys } from "../../utils/enum";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Routes/RouteConstants";
import { CustomButton } from "../BaseInputs";
import CustomModal from "../CustomModal";
import LogicFormInput from "../LogicFormInput";
import TaskSelector from "../TaskSelector";
import { dummyFlow } from "../../utils/constants";

const getTaskWidths = (tasks: any) => {
  const widths: any = {};
  tasks?.forEach((level: any) => {
    level?.forEach((task: any) => {
      if (task?.parent?.length > 0) {
        const currTaskWidth =
          task?.parent?.reduce((accm: number, i: number) => {
            return accm + widths[i]?.width;
          }, 0) / level?.length;
        // const marginLeft = task?.parent?.reduce((accm: number, i: number) => {
        //   const currParent =
        //     document?.getElementById(`level-task-${i}`)?.offsetLeft ?? 1700;
        //   return Math.min(currParent, accm);
        // }, 1700);
        widths[task?.id] = {
          width: currTaskWidth,
          marginLeft: 0,
        };
      } else {
        widths[task?.id] = { width: 100 };
      }
    });
  });
  console.log(widths);
  return widths;
};

const TaskBuilderContainer = () => {
  const [selectedForm, setSelectedForm] =
    useState<IFormBuildStorageItem | null>(null);
  const [show, setShow] = useState(false);
  const [addType, setAddType] = useState<string>("");
  const [flow, setFlow] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [currParent, setCurrParent] = useState<number | null>(null);
  const [widths, setWidths] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setWidths(getTaskWidths(dummyFlow));
    setFlow(dummyFlow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dummyFlow]);

  const getStoredTasks = async () => {
    const storedTasks: any[] =
      (await localforage.getItem(StorageKeys.TASKS)) ?? [];
    setTasks(storedTasks);
  };

  useEffect(() => {
    getStoredTasks();
  }, []);

  const getSelectedForm = async () => {
    const form: IFormBuildStorageItem | null =
      (await localforage.getItem(StorageKeys.SELECTED_FORM)) ?? null;
    if (!form) {
      navigate(ROUTES.FLOW_BUILDER);
      return;
    }
    setSelectedForm(form);
  };

  useEffect(() => {
    getSelectedForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddClick = (id: number) => {
    setCurrParent(id);
    setShow(true);
  };

  return (
    <div className="container">
      <div className={styles.container}>
        <div className={styles.canvas}>
          <div className={styles.selectedForm}>{selectedForm?.title}</div>
          <div className={styles.layoutContainer}>
            <div className={styles.taskFlowContainer}>
              {flow?.map((level: any[], levelIndex: number) => {
                return (
                  <div key={levelIndex} className={styles.taskContainer}>
                    {level?.map((task) => {
                      return (
                        <div
                          key={task?.id}
                          id={`level-task-${task?.id}`}
                          className={styles.task}
                          style={{
                            width: `${widths?.[task?.id]?.width}%`,
                          }}
                        >
                          <p className={styles.taskItem}>{task?.taskName}</p>
                          <div
                            className={`${styles.addToForm} ${
                              addType ? styles.disabled : ""
                            }`}
                            onClick={() => handleAddClick(task?.id)}
                          >
                            <span className={styles.add}>+</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className={styles.taskInputs}>
          {addType === FlowFieldType.LOGIC ? (
            <LogicFormInput />
          ) : addType === FlowFieldType.TASK ? (
            <TaskSelector
              tasks={tasks}
              setTasks={setTasks}
              currParent={currParent}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <CustomModal
        show={show}
        onHide={() => setShow(false)}
        title="Add Task/Logic"
      >
        <div className={styles.modalContainer}>
          <div className={styles.modalButton}>
            <CustomButton
              onClick={() => {
                setAddType(FlowFieldType.TASK);
                setShow(false);
              }}
            >
              + Add Task
            </CustomButton>
            <CustomButton
              onClick={() => {
                setAddType(FlowFieldType.LOGIC);
                setShow(false);
              }}
            >
              + Add Logic
            </CustomButton>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default TaskBuilderContainer;
