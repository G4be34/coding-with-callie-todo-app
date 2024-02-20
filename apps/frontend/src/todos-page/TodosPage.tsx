import { Flex, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Column } from "../components/Column";

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Take out the garbage' },
    'task-2': { id: 'task-2', content: 'Watch my favorite show' },
    'task-3': { id: 'task-3', content: 'Charge my phone' },
    'task-4': { id: 'task-4', content: 'Cook dinner' },
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


  return (
    <Flex flex={1} overflow={"auto"} p={10}>
      <DragDropContext onDragEnd={onDragEnd}>
        <SimpleGrid columns={stateData.columnOrder.length} spacing={4}>
          {stateData.columnOrder.map((columnId) => {
            const column = stateData.columns[columnId];
            const tasks = column.taskIds.map((taskId: string) => stateData.tasks[taskId]);

            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </SimpleGrid>
      </DragDropContext>
    </Flex>
  )
}