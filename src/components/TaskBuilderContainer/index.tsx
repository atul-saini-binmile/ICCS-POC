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
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const navigate = useNavigate();

  const getStoredTasks = async () => {
    const storedTasks: any[] =
      (await localforage.getItem(StorageKeys.TASKS)) ?? [];
    const storedFlow: any[] =
      (await localforage.getItem(StorageKeys.FLOWS)) ?? [];
    setTasks(storedTasks);
    setFlow(storedFlow);
  };

  useEffect(() => {
    getStoredTasks();
  }, []);

  useEffect(() => {
    setWidths(getTaskWidths(flow));
  }, [flow]);

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

  const handleAddClick = (id: number | null) => {
    setCurrParent(id);
    setShow(true);
  };

  const handleTaskAddToFlow = (parentId: number | null, task: any) => {
    if (parentId === null) {
      const newFlow = [[{ ...task, parent: parentId, children: [] }]];
      setFlow(newFlow);
    } else {
      let pIndex: number = 0;
      flow?.forEach((level: any[], levelIndex: number) => {
        level?.forEach((parentTask) => {
          if (parentTask?.id === parentId) {
            pIndex = levelIndex;
          }
        });
      });
      let newFlow = [...flow];
      if (newFlow[pIndex + 1]?.length > 0) {
        newFlow[pIndex + 1] = [
          ...newFlow[pIndex + 1],
          {
            ...task,
            parent: [parentId],
            children: [],
          },
        ];
      } else {
        newFlow[pIndex + 1] = [{ ...task, parent: [parentId], children: [] }];
      }
      const parentIdx = newFlow[pIndex]?.findIndex(
        (i: any) => i?.id === parentId
      );
      newFlow[pIndex][parentIdx]?.children?.push(task?.id);
      setFlow(newFlow);
    }
    setAddType("");
  };

  const handleFlowSelectedTask = (task: any) => {
    setSelectedTask(task);
    console.log(task);
  };

  return (
    <div className="container">
      <div className={styles.container}>
        <div className={styles.canvas}>
          <div className={styles.selectedForm}>{selectedForm?.title}</div>
          <div className={styles.layoutContainer}>
            <div className={styles.taskFlowContainer}>
              {flow?.length > 0 ? (
                flow?.map((level: any[], levelIndex: number) => {
                  return (
                    <div key={levelIndex} className={styles.taskContainer}>
                      {level?.map((task, taskIndex) => {
                        return (
                          <div
                            key={taskIndex}
                            id={`level-task-${task?.id}`}
                            className={styles.task}
                            style={{
                              width: `${widths?.[task?.id]?.width}%`,
                            }}
                          >
                            <p
                              className={styles.taskItem}
                              onClick={() => handleFlowSelectedTask(task)}
                            >
                              {task?.taskName}
                            </p>
                            {task?.children?.length === 0 && (
                              <div
                                className={styles.addToForm}
                                onClick={() => handleAddClick(task?.id)}
                              >
                                <span className={styles.add}>+</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              ) : (
                <div
                  className={styles.addToForm}
                  onClick={() => handleAddClick(null)}
                >
                  <span className={styles.add}>+</span>
                </div>
              )}
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
              handleTaskAddToFlow={handleTaskAddToFlow}
            />
          ) : selectedTask ? (
            <>
              {Object?.keys(selectedTask)?.map((item) => (
                <div>
                  {item} : {`${selectedTask[item]}`}
                </div>
              ))}
            </>
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
