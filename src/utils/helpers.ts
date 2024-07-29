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
