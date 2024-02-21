import { Button, Flex, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { FaPlus } from "react-icons/fa";
import { Column } from "../components/Column";

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Take out the garbage', date_added: 1581744000000, date_completed: null },
    'task-2': { id: 'task-2', content: 'Watch my favorite show and drink some soda and play with my dog', date_added: 1630972800000, date_completed: null },
    'task-3': { id: 'task-3', content: 'Charge my phone', date_added: 1655731200000, date_completed: 1678102400000 },
    'task-4': { id: 'task-4', content: 'Cook dinner', date_added: 1670073600000, date_completed: null },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

type Task = {
  id: string;
  content: string;
};

type ColumnData = {
  id: string;
  title: string;
  taskIds: string[];
};

type ColumnMap = {
  [key: string]: ColumnData;
};

type InitialData = {
  tasks: {
    [key: string]: Task;
  };
  columns: ColumnMap;
  columnOrder: string[];
};


export const TodosPage = () => {
  const [stateData, setStateData] = useState<InitialData>(initialData);

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