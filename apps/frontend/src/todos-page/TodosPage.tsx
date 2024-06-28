import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { FaPlus } from "react-icons/fa";
import { useLoaderData } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { Column } from "../components/Column";


// const initialData = {
//   tasks: {},
//   columns: {
//     'column-1': {  initial state
//       id: 'column-1',
//       title: 'Completed',
//       taskIds: [],
//     },
//     'column-2': {
//       id: 'column-2',
//       title: 'Title',
//       taskIds: [],
//     },
//   },
//   // Facilitate reordering of the columns
//   columnOrder: ['column-1', 'column-2'],
// };

type TaskType = {
  todo_id: string
  id: string
  description: string
  date_added: number
  date_completed: number | null
  priority: string
  due_date: number | null
  groupId: string
};

type ColumnType = {
  column_id: string
  id: string
  title: string
  taskIds: string[]
};

type InitialDataType = {
  tasks: {
    [key: string]: TaskType
  };
  columns: {
    [key: string]: ColumnType
  };
  columnOrder: string[];
};

type LoadedTodosDataType = {
  fetchedTodosData: InitialDataType
  access_token: string
  userId: string
};

export const TodosPage = () => {
  const loadedTodosData = useLoaderData() as LoadedTodosDataType;
  const toast = useToast();
  const [todosData, setTodosData] = useState(loadedTodosData.fetchedTodosData);

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

    const updateDateCompleted = (taskId: string, date: number | null) => {
      setTodosData((prevState) => ({
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [taskId]: {
            ...prevState.tasks[taskId],
            date_completed: date,
          },
        },
      }));
    };

    if (finish.id === 'column-1') {
      const currentDate = new Date().getTime();
      updateDateCompleted(draggableId, currentDate);
    } else if (start.id === 'column-1') {
      updateDateCompleted(draggableId, null);
    }

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
        [newStart.column_id]: newStart,
        [newFinish.column_id]: newFinish,
      },
    }));
  };

  const addNewColumn = async () => {
    try {
      const columnId = uuidv4();

      const apiColumn = {
        column_id: columnId,
        title: "Title",
        position: todosData.columnOrder.length,
        userId: loadedTodosData.userId
      };

      const response = await axios.post('/api/groups', apiColumn, { headers: { Authorization: `Bearer ${loadedTodosData.access_token}` } });

      const newColumn = {
        id: response.data.id,
        column_id: columnId,
        title: "Title",
        taskIds: [],
      };

      setTodosData(prevState => ({
        ...prevState,
        columns: {
          ...prevState.columns,
          [newColumn.column_id]: newColumn,
        },
        columnOrder: [...prevState.columnOrder, newColumn.column_id],
      }));

      toast({
        title: "New column added",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to add new column",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };


  return (
    <Flex flex={1} px={5} overflowX={"auto"}>
      <Flex flexDirection="row" alignItems="flex-start">
        <DragDropContext onDragEnd={onDragEnd}>
          <Flex gap={8} minH={"75%"}>
            {todosData.columnOrder.map((columnId) => {
              const column = todosData.columns[columnId];
              console.log("This is column: ", column);
              const tasks = column.taskIds.map((taskId: string) => todosData.tasks[taskId]);

              return (
                <Box key={column.id} minW={"300px"} flexShrink={0} minH={"60%"}>
                  <Column key={column.id} column={column} tasks={tasks} setTodosData={setTodosData} todosData={todosData} />
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