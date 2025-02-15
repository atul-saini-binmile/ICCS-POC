export const getTaskWidths = (tasks: any) => {
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
  return widths;
};

const nodeWidth = 160;
const nodeHeight = 40;
const verticalSpacing = 100;

export const calculateNodePositions = (nodes: any[]) => {
  const positions: any = {};

  const calculatePosition = (
    nodeId: string | number,
    depth: number,
    xOffset: any
  ) => {
    const node = nodes.find((node: { id: any }) => node.id === nodeId);
    if (!node) return xOffset;

    const children = nodes.filter(
      (child: { parent: any }) => child.parent === nodeId
    );
    const xPosition = xOffset;

    positions[nodeId] = {
      x: xPosition * nodeWidth + 50 || 250,
      y: depth * (nodeHeight + verticalSpacing),
    };

    let nextXOffset = xOffset;

    children.forEach((child: { id: any }) => {
      nextXOffset = calculatePosition(child.id, depth + 1, nextXOffset);
    });

    if (children.length > 0) {
      const firstChildPosition: any = positions[children[0].id].x;
      const lastChildPosition: any =
        positions[children[children.length - 1].id].x;
      positions[nodeId].x = (firstChildPosition + lastChildPosition) / 2;
    }

    return nextXOffset + 1;
  };

  nodes
    .filter((node: { parent: any }) => !node.parent)
    .forEach((rootNode: { id: any }, index: any) => {
      calculatePosition(rootNode.id, 0, index);
    });

  return positions;
};
