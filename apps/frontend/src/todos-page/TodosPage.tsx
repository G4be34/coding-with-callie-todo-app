import { Button, Flex, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { FaPlus } from "react-icons/fa";
import { Column } from "../components/Column";
import { useTodos } from "../context/TodosProvider";


type TaskType = {
  id: string;
  content: string;
};

type ColumnDataType = {
  id: string;
  title: string;
  taskIds: string[];
};

type ColumnMapType = {
  [key: string]: ColumnDataType;
};

type InitialDataType = {
  tasks: {
    [key: string]: TaskType;
  };
  columns: ColumnMapType;
  columnOrder: string[];
};


export const TodosPage = () => {
  const { todosData } = useTodos();
  const [stateData, setStateData] = useState<InitialDataType>(todosData);

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

    const start = stateData.columns[source.droppableId];
    const finish = stateData.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setStateData(prevState => ({
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

    setStateData(prevState => ({
      ...prevState,
      columns: {
        ...prevState.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }));
  };

  const addNewColumn = () => {

  }


  return (
    <Flex flex={1} p={5}>
      <DragDropContext onDragEnd={onDragEnd}>
        <SimpleGrid columns={stateData.columnOrder.length} spacing={4} overflowX={"auto"}>
          {stateData.columnOrder.map((columnId) => {
            const column = stateData.columns[columnId];
            const tasks = column.taskIds.map((taskId: string) => stateData.tasks[taskId]);

            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </SimpleGrid>
        <Button mt={2} ml={4} leftIcon={<FaPlus size={20} />} onClick={addNewColumn} >
          Add a new column
        </Button>
      </DragDropContext>
    </Flex>
  )
}