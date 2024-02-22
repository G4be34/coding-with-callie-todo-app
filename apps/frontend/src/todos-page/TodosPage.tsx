import { Box, Button, Flex } from "@chakra-ui/react";
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { FaPlus } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';
import { Column } from "../components/Column";
import { useTodos } from "../context/TodosProvider";



export const TodosPage = () => {
  const { todosData, setTodosData } = useTodos();

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = todosData.columns[source.droppableId];
    const finish = todosData.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setTodosData(prevState => ({
        ...prevState,
        columns: {
          ...prevState.columns,
          [newColumn.id]: newColumn,
        },
      }));
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);

    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    let newFinish = finish;

    // If the destination column is empty, initialize its taskIds array
    if (finish.taskIds.length === 0) {
      newFinish = {
        ...finish,
        taskIds: [draggableId], // Add the dragged task to the destination column
      };
    } else {
      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };
    }

    setTodosData(prevState => ({
      ...prevState,
      columns: {
        ...prevState.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }));
  };

  const addNewColumn = () => {
    const newColumn = {
      id: `column-${uuidv4()}`,
      title: "Title",
      taskIds: [],
    };

    setTodosData(prevState => ({
      ...prevState,
      columns: {
        ...prevState.columns,
        [newColumn.id]: newColumn,
      },
      columnOrder: [...prevState.columnOrder, newColumn.id],
    }));
  };



  return (
    <Flex flex={1} px={5} overflowX={"auto"}>
      <Flex flexDirection="row" alignItems="flex-start">
        <DragDropContext onDragEnd={onDragEnd}>
          <Flex gap={8} overflowX={"auto"}>
            {todosData.columnOrder.map((columnId) => {
              const column = todosData.columns[columnId];
              const tasks = column.taskIds.map((taskId: string) => todosData.tasks[taskId]);

              return (
                <Box key={column.id} minW={"300px"} flexShrink={0}>
                  <Column key={column.id} column={column} tasks={tasks} />
                </Box>
              );
            })}
          </Flex>
        </DragDropContext>
        <Button mt={10} ml={8} leftIcon={<FaPlus size={20} />} onClick={addNewColumn} >
          Add a new column
        </Button>
      </Flex>
    </Flex>
  )
}