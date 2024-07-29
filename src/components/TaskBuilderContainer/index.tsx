import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { IFormBuildStorageItem } from "../../utils/interface";
import localforage from "localforage";
import { FlowFieldType, StorageKeys, TextInputType } from "../../utils/enum";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Routes/RouteConstants";
import { CustomButton, TextInput } from "../BaseInputs";
import CustomModal from "../CustomModal";
import LogicFormInput from "../LogicFormInput";
import TaskSelector from "../TaskSelector";
import { nullTask } from "../../utils/constants";
import { getTaskWidths } from "../../utils/helpers";

const TaskBuilderContainer = () => {
  const [selectedForm, setSelectedForm] =
    useState<IFormBuildStorageItem | null>(null);
  const [show, setShow] = useState(false);
  const [addType, setAddType] = useState<string>("");
  const [flow, setFlow] = useState<any>([[nullTask]]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<any[]>([]);
  const [currParent, setCurrParent] = useState<number | null>(null);
  const [taskCoords, setTaskCoords] = useState<any>(null);
  const [widths, setWidths] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [formTitle, setFormTitle] = useState<string>("");
  const [showTitle, setShowTitle] = useState(false);
  const navigate = useNavigate();

  const getStoredTasks = async () => {
    const storedTasks: any[] =
      (await localforage.getItem(StorageKeys.TASKS)) ?? [];
    setTasks(storedTasks);
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

  const handleApprovalTask = (newFlow: any, task: any) => {
    const { levelIndex, taskIndex } = taskCoords;
    const arrToBeInserted: any[] = [];
    for (let i = 0; i < 2; i++) {
      arrToBeInserted?.push({
        ...nullTask,
        parent: [task?.id ?? null],
      });
    }
    if (newFlow?.[levelIndex + 1]?.length > 0) {
      const numberOfElementsWithSameCurrParent = newFlow[
        levelIndex + 1
      ]?.filter(
        (i: any) => i?.parent?.[0] === currParent || i?.parent === currParent
      )?.length;
      newFlow[levelIndex + 1].splice(
        taskIndex,
        numberOfElementsWithSameCurrParent,
        ...arrToBeInserted
      );
    } else {
      newFlow[levelIndex + 1] = [...arrToBeInserted];
    }
    return newFlow;
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
      if (task?.approval) {
        handleApprovalTask(newFlow, task);
      } else {
        newFlow?.push([{ ...nullTask, parent: [task?.id ?? null] }]);
      }
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
        ) ?? -1;

      parentIndex !== -1 &&
        newFlow[coords?.levelIndex - 1][parentIndex].children?.push(task?.id);
      if (newFlow?.length > coords?.levelIndex + 1) {
        if (newFlow[coords?.levelIndex + 1]?.length > 0) {
          if (task?.approval) {
            handleApprovalTask(newFlow, task);
          } else {
            newFlow[coords?.levelIndex + 1]?.push({
              ...nullTask,
              parent: [task?.id],
            });
          }
        } else {
          if (task?.approval) {
            handleApprovalTask(newFlow, task);
          } else {
            newFlow[coords?.levelIndex + 1] = [
              { ...nullTask, parent: [task?.id] },
            ];
          }
        }
      } else {
        if (task?.approval) {
          handleApprovalTask(newFlow, task);
        } else {
          newFlow?.push([{ ...nullTask, parent: [task?.id] }]);
        }
      }
      setFlow(newFlow);
    }
    setSelectedTasks([...selectedTasks, task]);
    setAddType("");
  };

  const handleFlowSelectedTask = (task: any) => {
    setSelectedTask(task);
  };

  const handleEndFlow = () => {
    const { levelIndex, taskIndex } = taskCoords;
    const newFlow = [...flow];
    newFlow[levelIndex][taskIndex] = {
      ...newFlow[levelIndex][taskIndex],
      isEnd: true,
      isTask: false,
    };
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

  const handleSaveFlow = () => {
    setShowTitle(true);
  };

  const handleFormSave = async () => {
    const existingFlows: any[] =
      (await localforage.getItem(StorageKeys.FLOWS)) ?? [];
    if (existingFlows?.find((i) => i?.title === formTitle)) {
      window.alert("This title is already in use!");
      return;
    }
    const currFlow = flow
      ?.map((level: any[]) => {
        return level?.map((task) => {
          if (!task?.isTask && !task?.isEnd) {
            return {
              ...task,
              isEnd: true,
            };
          }
          return task;
        });
      })
      ?.filter((i: any[]) => i?.length > 0);
    const newFlows =
      existingFlows?.length > 0
        ? [
            ...existingFlows,
            {
              flow: currFlow,
              title: formTitle,
              id: existingFlows?.length + 1,
              selectedForm: selectedForm?.title,
            },
          ]
        : [
            {
              flow: currFlow,
              title: formTitle,
              id: 1,
              selectedForm: selectedForm?.title,
            },
          ];
    await localforage.setItem(StorageKeys.FLOWS, newFlows);
    setShowTitle(false);
    navigate(ROUTES.SELECT_FLOW);
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
                            ) : task?.isEnd ? (
                              <div className={styles.endFlow}>End</div>
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
          <div className={styles.saveContainer}>
            <CustomButton onClick={handleSaveFlow}>Save Flow</CustomButton>
          </div>
        </div>
        <div className={styles.taskInputs}>
          {addType === FlowFieldType.LOGIC ? (
            <LogicFormInput handleAddLogic={handleAddLogic} />
          ) : addType === FlowFieldType.TASK ? (
            <TaskSelector
              tasks={tasks}
              setTasks={setTasks}
              selectedTasks={selectedTasks}
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
            <CustomButton
              disabled={!flow?.[0]?.[0]?.isTask}
              onClick={() => {
                handleEndFlow();
                setShow(false);
              }}
            >
              End Flow
            </CustomButton>
          </div>
        </div>
      </CustomModal>
      <CustomModal
        show={showTitle}
        onHide={() => setShowTitle(false)}
        title="Form Title"
      >
        <div className={styles.modalContainer}>
          <TextInput
            placeholder="Enter Form Title"
            onChange={(val) => setFormTitle(val)}
            prevValue={formTitle}
            type={TextInputType.ALPHA_NUMERIC}
          />
          <div className={styles.modalButton}>
            <CustomButton onClick={handleFormSave} disabled={!formTitle}>
              Save
            </CustomButton>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default TaskBuilderContainer;
