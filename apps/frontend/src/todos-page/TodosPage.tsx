import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import axios from "axios";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useLoaderData } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { Column } from "../components/Column";


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

  const onDragEnd = async (result: DropResult) => {
    try {
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

      const updateDateCompleted = async (taskId: string, date: number | null) => {
        try {
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
          await axios.patch(`/api/todos/${taskId}`, { date_completed: date?.toString(), groupId: taskId }, {
            headers: {
              Authorization: `Bearer ${loadedTodosData.access_token}`,
            },
          });
          console.log("Date completed updated successfully");
        } catch (error) {
          console.error("Error updating date completed: ", error);
          toast({
            title: 'Error updating date completed',
            description: "Please try again",
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top'
          });
        }
      };

      if (finish.column_id === 'column-1') {
        const currentDate = new Date().getTime();
        updateDateCompleted(draggableId, currentDate);
      } else if (start.column_id === 'column-1') {
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
        console.log('This is new column: ', newColumn);

        setTodosData(prevState => ({
          ...prevState,
          columns: {
            ...prevState.columns,
            [newColumn.column_id]: newColumn,
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

      await axios.patch(`/api/todos/${draggableId}`, { groupId: newFinish.column_id }, {
        headers: {
          Authorization: `Bearer ${loadedTodosData.access_token}`,
        },
      });
      console.log("Moved task: ", draggableId);
    } catch (error) {
      console.error("Error updating todo: ", error);
      toast({
        title: "Error updating todo",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
    }
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

      const response = await axios.post('/api/groups', apiColumn);

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
      console.error('Error adding new column: ', error);
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
              console.log("This is tasks: ", tasks);

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