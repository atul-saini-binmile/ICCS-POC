import {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  ReactFlow,
  BackgroundVariant,
  ConnectionLineType,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import styles from "./index.module.scss";
import "@xyflow/react/dist/style.css";
import CustomModal from "../CustomModal";
import TaskInputForm from "../TaskInputForm";
import localforage from "localforage";
import { StorageKeys } from "../../utils/enum";
import { Link, useNavigate } from "react-router-dom";
import { calculateNodePositions } from "../../utils/helpers";
import { CustomButton } from "../BaseInputs";

const FlowBuildTest = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [storedData, setStoredData] = useState<any[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [show, setShow] = useState<boolean>(false);
  const navigate = useNavigate();

  const getStoredData = async () => {
    const data: any[] =
      (await localforage.getItem(StorageKeys.TEST_FLOW)) || [];
    setStoredData(data);
    const nodesPositions = calculateNodePositions(data);
    const nodesData = data?.map((item) => ({
      id: item?.id,
      position: nodesPositions?.[item?.id],
      data: {
        label: item?.taskName,
        props: item,
      },
    }));
    const edgesData: any[] = [];
    data?.forEach((item) => {
      if (item?.parent) {
        edgesData.push({
          id: `el${item?.id}-${item?.parent}`,
          source: item?.parent,
          target: item?.id,
          type: ConnectionLineType.SmoothStep,
        });
      }
    });
    setNodes(nodesData);
    setEdges(edgesData);
  };

  const updateStoredData = async () => {
    storedData?.length > 0 &&
      (await localforage.setItem(StorageKeys.TEST_FLOW, storedData));
  };

  useEffect(() => {
    getStoredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds: any) => {
        const targetNode = nodes?.find((i) => i?.id === params?.target);
        onUpdateNode({ ...targetNode?.data?.props, parent: params?.source });
        return addEdge({ ...params, type: ConnectionLineType.SmoothStep }, eds);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setEdges, nodes]
  );

  const onNodeClick = (event: any, node: any) => {
    setSelectedTask(node);
  };

  const onAddNode = (data: any) => {
    setNodes((nds: any[]) => {
      setStoredData([...storedData, { ...data, id: `${nds?.length + 1}` }]);
      return nds.concat({
        id: `${nds?.length + 1}`,
        data: {
          label: data?.taskName,
          props: { ...data, id: `${nds?.length + 1}` },
        },
        position: {
          x: 0,
          y: 0,
        },
      });
    });
  };

  const onUpdateNode = (data: any) => {
    const updatedData = [...storedData];
    setNodes((nds: any[]) =>
      nds.map((node: { id: any; data: any }, index: number) => {
        if (node.id === data?.id) {
          updatedData[index] = data;
          console.log(updatedData);
          setStoredData(updatedData);
          return {
            ...node,
            data: {
              ...node?.data,
              label: data?.taskName,
              props: {
                ...data,
              },
            },
          };
        }

        return node;
      })
    );
    setSelectedTask(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.canvas}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          zoomOnScroll={false}
          onNodeClick={onNodeClick}
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
      <div className={styles.taskInputs}>
        <CustomButton
          onClick={() => {
            updateStoredData();
            navigate(-1);
          }}
        >
          Save Flow
        </CustomButton>
        <h3>Task Details</h3>
        <div
          className={styles.create}
          onClick={() => {
            setShow(true);
            setSelectedTask(null);
          }}
        >
          + Create New Task
        </div>
        <div
          className={styles.taskDetailsContainer}
          key={selectedTask?.toString()}
        >
          {selectedTask && (
            <TaskInputForm
              onUpdateNode={onUpdateNode}
              prevValues={selectedTask?.data?.props}
            />
          )}
        </div>
        <Link to="/">Lets go</Link>
      </div>
      <CustomModal
        show={show}
        onHide={() => setShow(false)}
        title="Create New Task"
      >
        <div className={styles.modalContainer}>
          <div className={styles.modalButton}>
            <TaskInputForm setShow={setShow} onAddNode={onAddNode} />
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default FlowBuildTest;
