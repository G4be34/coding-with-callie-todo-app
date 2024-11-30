import { Box, Button, Editable, EditableInput, EditablePreview, Flex, Select, Spacer, Text, Textarea, useToast } from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import axios from "axios";
import { useState } from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaMinusCircle, FaPlus } from "react-icons/fa";
import { useLoaderData } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { TaskItem } from "./TaskItem";


type InitialDataType = {
  tasks: {
    [key: string]: Task
  };
  columns: {
    [key: string]: ColumnData
  };
  columnOrder: string[];
};

type Task = {
  todo_id: string;
  id: string | number | undefined;
  description: string;
  date_added: number | string;
  date_completed: number | string | null;
  priority: string;
  due_date: number | string;
  position: number;
  groupId: string;
};

type ColumnData = {
  id: string;
  column_id: string;
  title: string;
  taskIds: string[];
};

type ColumnProps = {
  column: ColumnData;
  tasks: Task[];
  setTodosData: React.Dispatch<React.SetStateAction<InitialDataType>>;
  todosData: InitialDataType;
  setSelectedTodos: React.Dispatch<React.SetStateAction<string[]>>
};

type LoadedTodosDataType = {
  fetchedTodosData: InitialDataType
  access_token: string
  userId: string
};


export const Column = ({ column, tasks, setTodosData, todosData, setSelectedTodos }: ColumnProps) => {
  const fetchedTodosData = useLoaderData() as LoadedTodosDataType;
  const toast = useToast();
  const [showDelete, setShowDelete] = useState(true);
  const [addTodo, setAddTodo] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [priority, setPriority] = useState("Normal");

  const deleteColumn = async (columnId: string) => {
    if (column.title === "Completed") {
      toast({
        title: "Cannot delete Completed column",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const taskIdsToDelete = todosData.columns[columnId].taskIds;
    const updatedColumnOrder = todosData.columnOrder.filter(columnIdToDelete => columnIdToDelete !== columnId);
    try {
      await axios.delete(`/api/groups/${columnId}`, { headers: { Authorization: `Bearer ${fetchedTodosData.access_token}` } });

      setTodosData(prevState => ({
        ...prevState,
        tasks: Object.fromEntries(Object.entries(prevState.tasks).filter(([taskId]) => !taskIdsToDelete.includes(taskId))),
        columns: Object.fromEntries(Object.entries(prevState.columns).filter(([columnIdToDelete]) => columnIdToDelete !== columnId)),
        columnOrder: updatedColumnOrder,
      }));

      toast({
        title: `Column ${column.title} has been deleted`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Failed to delete column",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const addNewTodo = async () => {
    if (newTodo.trim() === "") return;

    const currentDate = new Date();
    try {
      let newTask: Task = {
        todo_id: uuid(),
        description: newTodo.trim(),
        date_added: (currentDate.getTime()).toString(),
        date_completed: null,
        priority,
        position: 0,
        due_date: (dueDate.getTime()).toString(),
        groupId: column.column_id,
        id: undefined
      };

      let tasksToUpdate: { todo_id: string; position: number }[] = [];

      const updatedTasks = tasks.map((task, index) => {
        tasksToUpdate = [...tasksToUpdate, { todo_id: task.todo_id, position: index + 1 }];

        return {
          ...task,
          position: index + 1
        }
      });

      if (updatedTasks.length > 0) {
        await axios.patch('/api/todos/update-positions', {
          tasksToUpdate
        }, {
          headers: { Authorization: `Bearer ${fetchedTodosData.access_token}` }
        });
      }

      const response = await axios.post('/api/todos', newTask, { headers: { Authorization: `Bearer ${fetchedTodosData.access_token}` } });

      const newTaskId = response.data.id;

      newTask = {
        ...newTask,
        date_added: currentDate.getTime(),
        due_date: dueDate.getTime(),
        id: newTaskId
      };

      setTodosData(prevState => ({
        ...prevState,
        tasks: {
          ...prevState.tasks,
          ...Object.fromEntries(updatedTasks.map(task => [task.todo_id, task])),
          [newTask.todo_id]: newTask,
        },
        columns: {
          ...prevState.columns,
          [column.column_id]: {
            ...prevState.columns[column.column_id],
            taskIds: [newTask.todo_id, ...prevState.columns[column.column_id].taskIds],
          },
        },
      }));

      toast({
        title: "Task added",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Failed to add task",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setNewTodo("");
      setDueDate(new Date());
      setPriority("Normal");
      setAddTodo(false);
    }
  };

  const deleteTodo = async (taskIdToDelete: string) => {
    const updatedTasks = Object.entries(todosData.tasks).filter(([taskId]) => taskId !== taskIdToDelete);
    const updatedColumnTaskIds = todosData.columns[column.column_id].taskIds.filter((id) => id !== taskIdToDelete);

    try {
      await axios.delete(`/api/todos/${taskIdToDelete}`, { headers: { Authorization: `Bearer ${fetchedTodosData.access_token}` } });

      setTodosData(prevState => ({
        ...prevState,
        tasks: Object.fromEntries(updatedTasks),
        columns: {
          ...prevState.columns,
          [column.column_id]: {
            ...prevState.columns[column.column_id],
            taskIds: updatedColumnTaskIds,
          },
        },
      }));

      toast({
        title: "Task deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Failed to delete task",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const completeTodo = async (taskId: string) => {
    try {
      const currentDate = new Date();

      const startTaskIds = Array.from(todosData.columns[column.column_id].taskIds);
      startTaskIds.splice(startTaskIds.indexOf(taskId), 1);

      const finishTaskIds = todosData.columns['column-1'].taskIds ? todosData.columns['column-1'].taskIds : [];
      finishTaskIds.splice(0, 0, taskId);

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

      const newTasks = {
        ...Object.fromEntries(updatedStartTasks.map(task => [task.todo_id, task])),
        ...Object.fromEntries(updatedFinishTasks.map(task => [task.todo_id, task])),
        [taskId]: {
          ...todosData.tasks[taskId],
          groupId: 'column-1',
          position: 0,
          date_completed: currentDate.getTime()
        }
      }

      setTodosData(prevState => ({
        ...prevState,
        tasks: {
          ...prevState.tasks,
          ...newTasks,
        },
        columns: {
          ...prevState.columns,
          [column.column_id]: {
            ...prevState.columns[column.column_id],
            taskIds: startTaskIds,
          },
          'column-1': {
            ...prevState.columns['column-1'],
            taskIds: finishTaskIds,
          },
        },
      }));

      await axios.patch('api/todos/update-positions', {
        tasksToUpdate: [...startTasksToUpdate, ...finishTasksToUpdate]
      }, {
        headers: { Authorization: `Bearer ${fetchedTodosData.access_token}` }
      });

      await axios.patch(`/api/todos/${taskId}`, {
        date_completed: currentDate.getTime().toString(),
        groupId: 'column-1',
      }, {
        headers: { Authorization: `Bearer ${fetchedTodosData.access_token}` }
      });

      toast({
        title: "Task completed",
        description: "Great work!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Failed to complete task",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const sortTasks = (sortValue: string) => {
    if (sortValue === "Sort") return;

    let sortedTasks: Task[] = [];

    switch (sortValue) {
      case "Newest":
        sortedTasks = [...tasks].sort((a, b) => parseInt(b.date_added.toString()) - parseInt(a.date_added.toString()));
        break;
      case "Oldest":
        sortedTasks = [...tasks].sort((a, b) => parseInt(a.date_added.toString()) - parseInt(b.date_added.toString()));
        break;
      case "Due":
        sortedTasks = [...tasks].sort((a, b) => (parseInt(a.due_date.toString())) - (parseInt(b.due_date.toString())));
        break;
      case "Priority":
        sortedTasks = [...tasks].sort((a, b) => {
          const priorityOrder: { [key: string]: number } = { "Normal": 0, "High": 1, "Highest": 2 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        break;
      case "Date Completed":
        sortedTasks = [...tasks].sort((a, b) => parseInt(b.date_completed!.toString()) - parseInt(a.date_completed!.toString()));
        break;
      default:
        sortedTasks = tasks;
        break;
    }

    setTodosData(prevState => ({
      ...prevState,
      columns: {
        ...prevState.columns,
        [column.column_id]: {
          ...prevState.columns[column.column_id],
          taskIds: sortedTasks.map(task => task.todo_id),
        },
      },
    }));
  };

  const changeTitle = async (newTitle: string) => {
    try {
      await axios.patch(`/api/groups/${column.id}`, {title: newTitle});

      toast({
        title: "Column title updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error updating column title",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };


  return (
    <Flex flex={1} padding={2} alignItems={"center"} flexDir={"column"} minH={"20%"} maxH={"100%"} w={"100%"} overflowY={"auto"}>
      {showDelete
        ? <Flex mb={2} _hover={{ opacity: 0.5}}>
            <FaMinusCircle size={24} onClick={() => setShowDelete(false)} cursor={"pointer"} color="white"/>
          </Flex>
        : <Button
            autoFocus
            size={"xs"}
            onClick={() => deleteColumn(column.column_id)}
            mb={2}
            onBlur={() => setShowDelete(true)}
            bg={"red.400"}
            color={"white"}
            _hover={{ bg: "red.500" }}
            >
              Delete Column
            </Button>
        }
      <Flex flexDir={"column"} border={"3px solid"} borderColor={"borderColor"} bgColor={"rgba(255, 255, 255, 0.05)"} backdropFilter={"blur(10px)"} borderRadius={10} borderBottomLeftRadius={0} borderBottomRightRadius={0} w={"100%"} alignItems={"center"} borderBottom={"none"}>
        <Select placeholder="Sort" size={"xs"} borderRadius={10} bgColor={"buttonBg"} color={"btnFontColor"} cursor={"pointer"} maxW={"100px"} flex={1} variant={"filled"} ml={"auto"} mr={2} mt={2} onChange={(e) => sortTasks(e.target.value)}>
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="Due">Due Date</option>
          <option value="Priority">Priority</option>
          {column.column_id === "column-1" ? <option value={"Date Completed"}>Date Completed</option> : null}
        </Select>
        <Editable defaultValue={column.title} cursor={"pointer"} color={"white"} textAlign={"center"} fontSize={20} fontWeight={"bold"} w={"100%"} onSubmit={changeTitle}>
          <EditablePreview />
          <EditableInput />
        </Editable>
      </Flex>
      <Droppable droppableId={column.column_id}>
        {(provided, snapshot) => (
          <Flex
            pos={"relative"}
            ref={provided.innerRef}
            {...provided.droppableProps}
            bg={snapshot.isDraggingOver ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.05)"}
            flexDir={"column"}
            minH={"500px"}
            h={"100%"}
            minW={"100%"}
            flex={1}
            border={"3px solid"}
            borderColor={"borderColor"}
            borderRadius={10}
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            p={4}
            overflowY={"auto"}
            maxH={"900px"}
            sx={{
              /* Custom scrollbar styles */
              '::-webkit-scrollbar': {
                width: '8px',
              },
              '::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.05)',
              },
              '::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: '10px',
              },
              '::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555',
              },
            }}
            >
            <Box pos={"absolute"} top={0} left={0} right={0} bottom={0} bg={"rgba(255, 255, 255, 0.05)"} backdropFilter={"blur(10px)"} borderRadius={10}></Box>
            {column.title !== "Completed"
              ? <Button w={"100%"} minH={10} mb={4} bgColor={"buttonBg"} _hover={{ bgColor: "hoverColor" }} onClick={() => setAddTodo(true)}>
                  <FaPlus color="white" />
                </Button>
              : null}
            {addTodo
              ? <Flex w={"100%"} flexDir={"column"} mb={4}>
                  <Flex mb={2} alignItems={"center"}>
                    <Flex flexDir={"column"} zIndex={100}>
                      <Text fontSize={"sm"} color={"todoFontColor"}>Due Date:</Text>
                      <DatePicker
                        openToDate={new Date()}
                        onChange={(date: Date) => setDueDate(date)}
                        selected={new Date(dueDate)}
                        fixedHeight
                        showIcon
                        toggleCalendarOnIconClick
                        />
                    </Flex>
                    <Spacer />
                    <Flex flexDir={"column"} ml={2}>
                      <Text fontSize={"sm"} color={"todoFontColor"} zIndex={100}>Priority:</Text>
                      <Select onChange={(e) => setPriority(e.target.value)} size={"xs"}>
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Highest">Highest</option>
                      </Select>
                    </Flex>
                  </Flex>
                  <Textarea
                    w={"100%"}
                    color={"white"}
                    resize={"none" }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addNewTodo();
                        setAddTodo(false);
                      }
                    }}
                    onChange={(e) => setNewTodo(e.target.value)}
                    h={150}
                    mb={4}
                    borderColor={"borderColor"}
                    value={newTodo}
                    />
                  <Flex w={"100%"}>
                    <Button size={"xs"} onClick={addNewTodo} bgColor={"green"} _hover={{ bg: "green.500" }} color={"white"}>Add</Button>
                    <Spacer />
                    <Button size={"xs"} onClick={() => setAddTodo(false)}>Cancel</Button>
                  </Flex>
                </Flex>
              : null
              }
            {tasks.length > 0 ? tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                deleteTodo={deleteTodo}
                completeTodo={completeTodo}
                setTodosData={setTodosData}
                setSelectedTodos={setSelectedTodos}
                />
            )) : <Text my={2} textAlign={"center"} color={"white"}>Empty</Text>}
            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </Flex>
  )
}