import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const onDragEnd = async (result: DropResult) => {
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
    const newTaskIds = Array.from(start.taskIds);

    if (start === finish) {
      // Reordering within the same column
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      let tasksToUpdate: {todo_id: string, position: number}[] = [];

      const updatedTasks = newTaskIds.map((taskId, index) => {
        tasksToUpdate = [...tasksToUpdate, {
          todo_id: taskId,
          position: index
        }];

        return {
          ...todosData.tasks[taskId],
          position: index,
        };
      });

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newTasks = Object.fromEntries(updatedTasks.map(task => [task.todo_id, task]));

      setTodosData(prevState => ({
        ...prevState,
        columns: {
          ...prevState.columns,
          [newColumn.column_id]: newColumn,
        },
        tasks: {
          ...prevState.tasks,
          ...newTasks,
        },
      }));

      try {
        await axios.patch('/api/todos/update-positions', {
          tasksToUpdate
        }, {
          headers: {
            Authorization: `Bearer ${loadedTodosData.access_token}`
          }
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
        });
      }

      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);

    let startTasksToUpdate: {todo_id: string, position: number}[] = [];
    let finishTasksToUpdate: {todo_id: string, position: number}[] = [];

    const updatedStartTasks = startTaskIds.map((taskId, index) => {
      startTasksToUpdate = [...startTasksToUpdate, {
        todo_id: taskId,
        position: index
      }];

      return {
        ...todosData.tasks[taskId],
        position: index,
      }
    });

    const updatedFinishTasks = finishTaskIds.map((taskId, index) => {
      finishTasksToUpdate = [...finishTasksToUpdate, {
        todo_id: taskId,
        position: index
      }];

      return {
        ...todosData.tasks[taskId],
        position: index,
      }
    });

    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newTasks = {
      ...Object.fromEntries(updatedStartTasks.map(task => [task.todo_id, task])),
      ...Object.fromEntries(updatedFinishTasks.map(task => [task.todo_id, task])),
      [draggableId]: {
        ...todosData.tasks[draggableId],
        groupId: finish.column_id,
        position: destination.index,
        date_completed: finish.column_id === 'column-1' ? new Date().getTime() : null,
      },
    };

    setTodosData(prevState => ({
      ...prevState,
      columns: {
        ...prevState.columns,
        [newStart.column_id]: newStart,
        [newFinish.column_id]: newFinish,
      },
      tasks: {
        ...prevState.tasks,
        ...newTasks,
      },
    }));

    try {
      await axios.patch('/api/todos/update-positions', {
        tasksToUpdate: [...startTasksToUpdate, ...finishTasksToUpdate]
      }, {
        headers: {
          Authorization: `Bearer ${loadedTodosData.access_token}`
        }
      });

      await axios.patch(`/api/todos/${draggableId}`, {
        groupId: finish.column_id,
        date_completed: finish.column_id === 'column-1' ? new Date().getTime().toString() : null,
      }, {
        headers: {
          Authorization: `Bearer ${loadedTodosData.access_token}`
        }
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
      });
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

      setShowConfirmModal(false);

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

    let tasksToUpdate: { todo_id: string; position: number }[] = [];

    const newCompletedTodos = [...selectedTodos, ...todosData.columns['column-1'].taskIds];

    const newTasks = newCompletedTodos.map((taskId, index) => {
      tasksToUpdate = [...tasksToUpdate, {
        todo_id: taskId,
        position: index
      }];

      const newTask = {
        ...todosData.tasks[taskId],
        position: index,
        date_completed: todosData.tasks[taskId].date_completed ? todosData.tasks[taskId].date_completed : currentDate,
        groupId: 'column-1'
      };

      return newTask
    });



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
      tasks: {
        ...prevState.tasks,
        ...Object.fromEntries(newTasks.map(task => [task.todo_id, task])),
      },
      columns: newColumns,
    }));

    try {
      await axios.patch('/api/todos', {
        ids: selectedTodos,
        dateCompleted: currentDate.toString()
      }, {
        headers: {
          Authorization: `Bearer ${loadedTodosData.access_token}`
        }
      });

      await axios.patch('/api/todos/update-positions', {
        tasksToUpdate
      }, {
        headers: {
          Authorization: `Bearer ${loadedTodosData.access_token}`
        }
      });

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
      {showConfirmModal
        ? <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} isCentered size={"sm"}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Are you sure you want to delete ({selectedTodos.length}) selected tasks?
              </ModalHeader>
              <ModalBody display={"flex"} justifyContent={"space-evenly"} marginBottom={4}>
                <Button onClick={deleteTodos} colorScheme="red">Yes</Button>
                <Button onClick={() => setShowConfirmModal(false)} colorScheme="blue">Cancel</Button>
              </ModalBody>
            </ModalContent>
          </Modal>
        : null}
      {selectedTodos.length > 0
        ? <Box display={"flex"} justifyContent={"center"} alignItems={"center"} p={4}>
            <Button bg={"green"} color={"white"} onClick={completeTodos} mr={4}>Complete selected Tasks</Button>
            <Button bg={"red"} color={"white"} onClick={() => setShowConfirmModal(true)}>Delete selected Tasks</Button>
          </Box>
        : null}
      <Flex flexDirection="row" alignItems="flex-start">
        <DragDropContext onDragEnd={onDragEnd}>
          <Flex gap={8} minH={"75%"}>
            {todosData.columnOrder.map((columnId) => {
              const column = todosData.columns[columnId];
              const tasks = column.taskIds.map((taskId: string) => todosData.tasks[taskId]);

              return (
                <Box key={column.id} minW={["250px", "250px", "300px"]} flexShrink={0} minH={"20%"} maxH={"80%"} overflowY={"auto"}>
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
        <Button mt={10} ml={8} leftIcon={<FaPlus size={20} />} minW={"auto"} onClick={addNewColumn} >
          Add a new column
        </Button>
      </Flex>
    </Flex>
  )
}