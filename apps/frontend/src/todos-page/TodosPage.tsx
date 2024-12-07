import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import axios from "axios";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { Column } from "../components/Column";
import { LoadedTodosDataType } from "../types";


export const TodosPage = () => {
  const loadedTodosData = useLoaderData() as LoadedTodosDataType;
  const { user } = useOutletContext() as { user: { background: string }};
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

    // Initialize columns the task starts in and ends in
    const start = todosData.columns[source.droppableId];
    const finish = todosData.columns[destination.droppableId];
    // Create an array of task ids from the start column
    const newTaskIds = Array.from(start.taskIds);

    // Reordering within the same column
    if (start === finish) {
      // Remove the task from its original place within the column
      newTaskIds.splice(source.index, 1);
      // Add the task to its new place within the column
      newTaskIds.splice(destination.index, 0, draggableId);

      // Initialize array of tasks whose positions need to be updated
      let tasksToUpdate: {todo_id: string, position: number}[] = [];

      // Update the position of each task while creating an array of task objects
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

      // Create a new column with the updated task ids
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      // Create a new object with the updated task objects
      const newTasks = Object.fromEntries(updatedTasks.map(task => [task.todo_id, task]));

      // Update the state with the new column and task order
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
        // Update the position of each task in the database
        await axios.patch('/api/todos/update-positions', {
          tasksToUpdate
        }, {
          headers: {
            Authorization: `Bearer ${loadedTodosData.access_token}`
          }
        });
      } catch (error) {
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

    // Create an array of task ids from the start column
    const startTaskIds = Array.from(start.taskIds);
    // Remove the task from its original place within the column
    startTaskIds.splice(source.index, 1);

    // Create an array of task ids from the finish column
    const finishTaskIds = Array.from(finish.taskIds);
    // Add the task to its new place within the new column
    finishTaskIds.splice(destination.index, 0, draggableId);

    // Initialize array of tasks whose positions need to be updated
    let startTasksToUpdate: {todo_id: string, position: number}[] = [];
    let finishTasksToUpdate: {todo_id: string, position: number}[] = [];

    // Update the position of each task while creating an array of task objects
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

    // Update the position of each task while creating an array of task objects
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

    // Create a new start column with the updated task ids
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    // Create a new finish column with the updated task ids
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    // Create a new object with the updated task objects
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

    // Update the state with the new column and task order
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
      // Update the position of each task in the database
      await axios.patch('/api/todos/update-positions', {
        tasksToUpdate: [...startTasksToUpdate, ...finishTasksToUpdate]
      }, {
        headers: {
          Authorization: `Bearer ${loadedTodosData.access_token}`
        }
      });

      // Update the group id of the task that was moved
      await axios.patch(`/api/todos/${draggableId}`, {
        groupId: finish.column_id,
        date_completed: finish.column_id === 'column-1' ? new Date().getTime().toString() : null,
      }, {
        headers: {
          Authorization: `Bearer ${loadedTodosData.access_token}`
        }
      });
    } catch (error) {
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
      });
    } catch (error) {
      toast({
        title: "Error deleting todos",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
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
    <Flex flex={1} px={5} overflowX={"auto"} direction="column" bgImg={`url(/${user.background})`} bgPos="center" bgSize="cover" bgRepeat="no-repeat">
      {showConfirmModal
        ? <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} isCentered size={"sm"}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Are you sure you want to delete ({selectedTodos.length}) selected tasks?
              </ModalHeader>
              <ModalBody display={"flex"} justifyContent={"space-evenly"} marginBottom={4}>
                <Button onClick={deleteTodos} aria-label="Confirm deletion" colorScheme="red">Yes</Button>
                <Button onClick={() => setShowConfirmModal(false)} aria-label="Cancel deletion" colorScheme="blue">Cancel</Button>
              </ModalBody>
            </ModalContent>
          </Modal>
        : null}
      {selectedTodos.length > 0
        ? <Box display={"flex"} justifyContent={"center"} alignItems={"center"} p={4}>
            <Button bg={"green"} color={"white"} aria-label="Complete selected tasks" onClick={completeTodos} mr={4}>Complete selected Tasks</Button>
            <Button bg={"red"} color={"white"} aria-label="Delete selected tasks" onClick={() => setShowConfirmModal(true)}>Delete selected Tasks</Button>
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
        <Button
          mt={10}
          ml={8}
          leftIcon={<FaPlus size={20} />}
          minW={"auto"}
          _hover={{ bgColor: "hoverColor" }}
          bgColor={"buttonBg"}
          color={"btnFontColor"}
          aria-label="Add a new column"
          onClick={addNewColumn}
          >
          Add a new column
        </Button>
      </Flex>
    </Flex>
  )
}