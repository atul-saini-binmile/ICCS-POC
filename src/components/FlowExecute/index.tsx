import localforage from "localforage";
import { useEffect, useState } from "react";
import { StorageKeys, TaskStatus } from "../../utils/enum";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Routes/RouteConstants";
import styles from "./index.module.scss";
import { getTaskWidths } from "../../utils/helpers";
import FlowTask from "../FlowTask";
import { nullTask } from "../../utils/constants";

const FlowExecute = () => {
  const [selectedFlow, setSelectedFlow] = useState<any>(null);
  const [flow, setFlow] = useState<any[]>([]);
  const [widths, setWidths] = useState<any>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const navigate = useNavigate();

  const getSelectedFlow = async () => {
    const flow: any =
      (await localforage.getItem(StorageKeys.SELECTED_FLOW)) ?? null;
    if (!flow) {
      navigate(ROUTES.SELECT_FLOW);
      return;
    }
    const ongoingFlow: any[] =
      (await localforage.getItem(StorageKeys.ONGOING_FLOW)) ?? [];
    setSelectedFlow(flow);
    setFlow(ongoingFlow?.length > 0 ? ongoingFlow : [flow?.flow?.[0]]);
  };

  const handleOngoingFlowSave = async () => {
    const ongoingFlow: any[] =
      (await localforage.getItem(StorageKeys.ONGOING_FLOW)) ?? [];
    ongoingFlow?.length < flow?.length &&
      (await localforage.setItem(StorageKeys.ONGOING_FLOW, flow));
  };

  useEffect(() => {
    getSelectedFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleOngoingFlowSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow]);

  useEffect(() => {
    setWidths(getTaskWidths(flow));
  }, [flow]);

  const handleTaskSubmit = (data: any) => {
    if (data?.taskStatus?.[0]?.value !== TaskStatus.DONE) {
      const newFlow = [...flow]?.map((level: any) => {
        return level?.map((task: any) => {
          if (task?.id === data?.id) {
            return data;
          }
          return task;
        });
      });
      setFlow(newFlow);
      setSelectedTask(null);
      return;
    }
    const newFlow = [...flow]?.map((level: any) => {
      return level?.map((task: any) => {
        if (task?.id === data?.id) {
          return data;
        }
        return task;
      });
    });
    const childrenIds = data?.children;
    const children: any[] = [];

    if (childrenIds?.length === 0) {
      newFlow?.push([{ ...nullTask, isEnd: true, parent: [data?.id] }]);
      setTimeout(() => {
        window.alert("Flow Completed!");
      }, 1000);
    } else {
      selectedFlow?.flow?.forEach((level: any) => {
        level?.forEach((task: any) => {
          if (childrenIds?.includes(task?.id)) {
            children?.push(task);
          }
        });
      });
      if (data?.approval) {
        if (data?.isApproved) {
          const nextTask = children?.find((i) => i?.id === childrenIds[0]);
          newFlow?.push([nextTask]);
        } else {
          newFlow?.push([{ ...nullTask, isEnd: true, parent: [data?.id] }]);
          setTimeout(() => {
            window.alert("Flow Completed!");
          }, 1000);
        }
      } else {
        const nextTask = children?.find((i) => i?.id === childrenIds[0]);
        newFlow?.push([nextTask]);
        setTimeout(() => {
          window.alert("Flow Completed!");
        }, 1000);
      }
    }
    setFlow(newFlow);
    setSelectedTask(null);
  };

  return (
    <div className="container">
      <div className={styles.container}>
        <div className={styles.canvas}>
          <div className={styles.selectedForm}>
            {selectedFlow?.selectedForm}
          </div>
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
                                className={`${styles.taskItem} ${
                                  selectedTask?.id === task?.id
                                    ? styles.active
                                    : null
                                }
                                ${
                                  task?.taskStatus?.[0]?.value ===
                                  TaskStatus.DONE
                                    ? styles.disabled
                                    : null
                                }`}
                                onClick={() => {
                                  setSelectedTask(task);
                                }}
                              >
                                {task?.taskName}
                              </p>
                            ) : task?.isEnd ? (
                              <div className={styles.endFlow}>End</div>
                            ) : (
                              <></>
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
        <div className={styles.taskInputs} key={selectedTask?.id}>
          {selectedTask && (
            <FlowTask task={selectedTask} handleTaskSubmit={handleTaskSubmit} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowExecute;
