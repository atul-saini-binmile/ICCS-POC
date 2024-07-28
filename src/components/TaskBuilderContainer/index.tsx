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
import { nullTask } from "../../utils/constants";

const getTaskWidths = (tasks: any) => {
  const widths: any = {};
  tasks?.forEach((level: any, levelIndex: number) => {
    level?.forEach((task: any, taskIndex: number) => {
      if (task?.parent?.length > 0 && task?.parent?.[0]) {
        const parentIndex = tasks?.[levelIndex - 1]?.findIndex(
          (p: any) => p?.id === task?.parent?.[0]
        );
        const levelLength = level?.filter(
          (i: any) => i?.parent?.[0] === task?.parent?.[0]
        )?.length;
        const currTaskWidth =
          widths[`${levelIndex - 1}-${parentIndex}-${task?.parent?.[0]}`]
            ?.width / levelLength;
        // const marginLeft = task?.parent?.reduce((accm: number, i: number) => {
        //   const currParent =
        //     document?.getElementById(`level-task-${i}`)?.offsetLeft ?? 1700;
        //   return Math.min(currParent, accm);
        // }, 1700);
        widths[`${levelIndex}-${taskIndex}-${task?.id}`] = {
          width: currTaskWidth,
          marginLeft: 0,
        };
      } else {
        widths[`${levelIndex}-${taskIndex}-${task?.id}`] = { width: 100 };
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
  const [taskCoords, setTaskCoords] = useState<any>(null);
  const [widths, setWidths] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const navigate = useNavigate();

  const getStoredTasks = async () => {
    const storedTasks: any[] =
      (await localforage.getItem(StorageKeys.TASKS)) ?? [];
    const storedFlow: any[] = (await localforage.getItem(
      StorageKeys.FLOWS
    )) ?? [[nullTask]];
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

  const handleAddClick = (
    id: number | null,
    levelIndex: number,
    taskIndex: number
  ) => {
    setCurrParent(id);
    setShow(true);
    setTaskCoords({ levelIndex, taskIndex });
  };

  const handleTaskAddToFlow = (
    parentId: number | null,
    task: any,
    coords: { levelIndex: number; taskIndex: number }
  ) => {
    if (parentId === null) {
      const newFlow = [
        [{ ...task, isTask: true, parent: parentId, children: [] }],
      ];
      newFlow?.push([{ ...nullTask, parent: [task?.id] }]);
      setFlow(newFlow);
    } else {
      const newFlow = [...flow];
      newFlow[coords?.levelIndex][coords?.taskIndex] = {
        ...newFlow[coords?.levelIndex][coords?.taskIndex],
        ...task,
        isTask: true,
        children: [],
      };
      const parentIndex =
        newFlow?.[coords?.levelIndex - 1]?.findIndex(
          (p: any) => p?.id === currParent
        ) || -1;
      parentIndex !== -1 &&
        newFlow[coords?.levelIndex - 1][parentIndex].children?.push(task?.id);
      if (newFlow?.length > coords?.levelIndex + 1) {
        if (newFlow[coords?.levelIndex + 1]?.length > 0) {
          newFlow[coords?.levelIndex + 1]?.push({
            ...nullTask,
            parent: [task?.id],
          });
        } else {
          newFlow[coords?.levelIndex + 1] = [
            { ...nullTask, parent: [task?.id] },
          ];
        }
      } else {
        newFlow?.push([{ ...nullTask, parent: [task?.id] }]);
      }
      setFlow(newFlow);
    }
    setAddType("");
  };

  const handleFlowSelectedTask = (task: any) => {
    setSelectedTask(task);
  };

  const handleAddLogic = (num: number) => {
    const { levelIndex, taskIndex } = taskCoords;
    const newFlow = [...flow];
    const arrToBeInserted: any[] = [];
    for (let i = 0; i < num; i++) {
      arrToBeInserted?.push({
        ...nullTask,
        parent: [newFlow[levelIndex][taskIndex]?.parent?.[0] ?? null],
      });
    }
    const numberOfElementsWithSameCurrParent = newFlow[levelIndex]?.filter(
      (i: any) => i?.parent?.[0] === currParent || i?.parent === currParent
    )?.length;
    newFlow[levelIndex].splice(
      taskIndex,
      numberOfElementsWithSameCurrParent,
      ...arrToBeInserted
    );
    setFlow(newFlow);
    setAddType("");
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
                            id={`level-task-${task?.id}-${taskIndex}`}
                            className={styles.task}
                            style={{
                              width: `${
                                widths?.[
                                  `${levelIndex}-${taskIndex}-${task?.id}`
                                ]?.width
                              }%`,
                            }}
                          >
                            {task?.isTask ? (
                              <p
                                className={styles.taskItem}
                                onClick={() => handleFlowSelectedTask(task)}
                              >
                                {task?.taskName}
                              </p>
                            ) : (
                              <div
                                className={styles.addToForm}
                                onClick={() =>
                                  handleAddClick(
                                    task?.parent?.[0] ?? null,
                                    levelIndex,
                                    taskIndex
                                  )
                                }
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
                <></>
              )}
            </div>
          </div>
        </div>
        <div className={styles.taskInputs}>
          {addType === FlowFieldType.LOGIC ? (
            <LogicFormInput handleAddLogic={handleAddLogic} />
          ) : addType === FlowFieldType.TASK ? (
            <TaskSelector
              tasks={tasks}
              setTasks={setTasks}
              currParent={currParent}
              coords={taskCoords}
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
