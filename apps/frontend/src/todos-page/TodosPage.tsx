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
  id: string | number | undefined
  description: string
  date_added: number | string
  date_completed: number | string | null
  priority: string
  due_date: number | string
  groupId: string
  position: number
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
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);

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
          await axios.patch(`/api/todos/${taskId}`, { date_completed: (date ? date.toString() : null), groupId: finish.column_id }, {
            headers: {
              Authorization: `Bearer ${loadedTodosData.access_token}`,
            },
          });
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

      if (start === finish) {
        const newTaskIds = Array.from(start.taskIds);

        const newPosition = todosData.tasks[newTaskIds[destination.index]].position;
        const newTask = { ...todosData.tasks[draggableId], position: newPosition };

        const tasksToUpdate = newTaskIds.slice(destination.index);
        const updatedTasks = tasksToUpdate.map((taskId) => {
          todosData.tasks[taskId].position += 1;
          return [taskId, todosData.tasks[taskId]];
        });

        const joinedTasks = [...updatedTasks, [draggableId, newTask]];
        const arrayToObjectTasks = Object.fromEntries(joinedTasks);

        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);


        const newColumn = {
          ...start,
          taskIds: newTaskIds,
        };

        await axios.patch('/api/todos/update-positions', {
          ids: tasksToUpdate
        }, {
          headers: {
            Authorization: `Bearer ${loadedTodosData.access_token}`
          }
        });

        await axios.patch(`/api/todos/${draggableId}`, {
          position: newPosition
        }, {
          headers: {
            Authorization: `Bearer ${loadedTodosData.access_token}`
          }
        });

        setTodosData(prevState => ({
          ...prevState,
          columns: {
            ...prevState.columns,
            [newColumn.column_id]: newColumn,
          },
          tasks: {
            ...prevState.tasks,
            ...arrayToObjectTasks
          }
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
      let newPosition = 0;
      let arrayToObjectTasks: { [key: string]: TaskType } = {};

      // If the destination column is empty, initialize its taskIds array
      if (finish.taskIds.length === 0) {
        arrayToObjectTasks = {
          [draggableId]: {
            ...todosData.tasks[draggableId],
            position: newPosition
          }
        };

        newFinish = {
          ...finish,
          taskIds: [draggableId], // Add the dragged task to the destination column
        };
      } else {
        const finishTaskIds = Array.from(finish.taskIds);

        if (destination.index >= finishTaskIds.length) {
          newPosition = todosData.tasks[finishTaskIds[finishTaskIds.length - 1]].position + 1;
        } else {
          newPosition = todosData.tasks[finishTaskIds[destination.index]].position;
        }

        const newTask = { ...todosData.tasks[draggableId], position: newPosition };

        const tasksToUpdate = finishTaskIds.slice(destination.index);
        const updatedTasks = tasksToUpdate.map((taskId) => {
          todosData.tasks[taskId].position += 1;
          return [taskId, todosData.tasks[taskId]];
        });

        const joinedTasks = [...updatedTasks, [draggableId, newTask]];
        arrayToObjectTasks = Object.fromEntries(joinedTasks);

        finishTaskIds.splice(destination.index, 0, draggableId);

        await axios.patch('/api/todos/update-positions', {
          ids: tasksToUpdate
        }, {
          headers: {
            Authorization: `Bearer ${loadedTodosData.access_token}`
          }
        });

        newFinish = {
          ...finish,
          taskIds: finishTaskIds,
        };
      }

      if (finish.column_id === 'column-1') {
        const currentDate = new Date().getTime();
        await updateDateCompleted(draggableId, currentDate);
        arrayToObjectTasks[draggableId].date_completed = currentDate;
      } else if (start.column_id === 'column-1') {
        await updateDateCompleted(draggableId, null);
        arrayToObjectTasks[draggableId].date_completed = null;
      }

      setTodosData(prevState => ({
        ...prevState,
        columns: {
          ...prevState.columns,
          [newStart.column_id]: newStart,
          [newFinish.column_id]: newFinish,
        },
        tasks: {
          ...prevState.tasks,
          ...arrayToObjectTasks
        }
      }));

      await axios.patch(`/api/todos/${draggableId}`, {
        groupId: newFinish.column_id,
        position: newPosition
      }, {
        headers: {
          Authorization: `Bearer ${loadedTodosData.access_token}`,
        },
      });
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

  const deleteTodos = async () => {
    try {
      await axios.delete('/api/todos', {
        params: {
          ids: selectedTodos
        },
        headers: {
          Authorization: `Bearer ${loadedTodosData.access_token}`
        }
      });

      const newTasks = Object.fromEntries(
        Object.entries(todosData.tasks).filter(([taskId]) => !selectedTodos.includes(taskId))
      );

      const newColumns = Object.fromEntries(
        Object.entries(todosData.columns).map(([columnId, column]) => [
          columnId,
          {
            ...column,
            taskIds: column.taskIds.filter((taskId) => !selectedTodos.includes(taskId)),
          },
        ])
      );

      setSelectedTodos([]);

      setTodosData((prevState) => ({
        ...prevState,
        tasks: newTasks,
        columns: newColumns,
      }));

      toast({
        title: "Success",
        status: "success",
        description: "Todos successfully deleted",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
    } catch (error) {
      console.error("Error deleting todos: ", error);
      toast({
        title: "Error deleting todos",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
    }
  };

  const completeTodos = async () => {
    const currentDate = new Date().getTime();

    try {
      await axios.patch('/api/todos', {
          ids: selectedTodos,
          dateCompleted: currentDate.toString()
        }, {
          headers: {
            Authorization: `Bearer ${loadedTodosData.access_token}`
          }
        });

      const newTasks = Object.fromEntries(
        Object.entries(todosData.tasks).map(([taskId, task]) => {
          if (selectedTodos.includes(taskId)) {
            return [taskId, {
              ...task,
              date_completed: currentDate,
              groupId: 'column-1'
            }]
          }

          return [taskId, task];
        })
      );

      const newColumns = Object.fromEntries(
        Object.entries(todosData.columns).map(([columnId, column]) => {
          if (column.column_id === 'column-1') {
            return [columnId, {
              ...column,
              taskIds: [...selectedTodos, ...column.taskIds],
            }]
          }

          if (column.taskIds.some((taskId) => selectedTodos.includes(taskId))) {
            return [columnId, {
              ...column,
              taskIds: column.taskIds.filter((taskId) => !selectedTodos.includes(taskId)),
            }];
          }

          return [columnId, column];
        })
      );

      setSelectedTodos([]);

      setTodosData((prevState) => ({
        ...prevState,
        tasks: newTasks,
        columns: newColumns,
      }));

      toast({
        title: "Success",
        status: "success",
        description: "Todos successfully completed",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error("Error completing todos: ", error);
      toast({
        title: "Error completing todos",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Flex flex={1} px={5} overflowX={"auto"} direction="column">
      {selectedTodos.length > 0
        ? <Box display={"flex"} justifyContent={"center"} alignItems={"center"} p={4}>
            <Button bg={"green"} color={"white"} onClick={completeTodos} mr={4}>Complete selected Tasks</Button>
            <Button bg={"red"} color={"white"} onClick={deleteTodos}>Delete selected Tasks</Button>
          </Box>
        : null}
      <Flex flexDirection="row" alignItems="flex-start">
        <DragDropContext onDragEnd={onDragEnd}>
          <Flex gap={8} minH={"75%"}>
            {todosData.columnOrder.map((columnId) => {
              const column = todosData.columns[columnId];
              const tasks = column.taskIds.map((taskId: string) => todosData.tasks[taskId]);

              return (
                <Box key={column.id} minW={"300px"} flexShrink={0} minH={"60%"}>
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    setTodosData={setTodosData}
                    todosData={todosData}
                    setSelectedTodos={setSelectedTodos}
                    />
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