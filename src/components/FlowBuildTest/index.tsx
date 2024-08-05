import {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  ReactFlow,
  BackgroundVariant,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import styles from "./index.module.scss";
import "@xyflow/react/dist/style.css";
import CustomModal from "../CustomModal";
import TaskInputForm from "../TaskInputForm";

const initialNodes = [
  {
    id: "1",
    position: { x: 350, y: 100 },
    data: {
      label: "Task A",
      props: {
        id: "1",
        taskName: "Task A",
        description: "do this",
        timeline: "24",
      },
    },
  },
  {
    id: "2",
    position: { x: 350, y: 200 },
    data: {
      label: "Task B",
      props: {
        id: "2",
        taskName: "Task B",
        description: "do this",
        timeline: "24",
      },
    },
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const FlowBuildTest = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(initialEdges);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [show, setShow] = useState<boolean>(false);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = (event: any, node: any) => {
    setSelectedTask(node);
  };

  const onAddNode = (data: any) => {
    setNodes((nds) =>
      nds.concat({
        id: `${nds?.length + 1}`,
        data: {
          label: data?.taskName,
          props: { ...data, id: `${nds?.length + 1}` },
        },
        position: {
          x: 0,
          y: 0,
        },
      })
    );
  };

  const onUpdateNode = (data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === data?.id) {
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
        <div key={selectedTask?.toString()}>
          {selectedTask && (
            <TaskInputForm
              onUpdateNode={onUpdateNode}
              prevValues={selectedTask?.data?.props}
            />
          )}
        </div>
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
