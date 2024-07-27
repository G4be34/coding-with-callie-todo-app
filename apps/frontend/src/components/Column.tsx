import { Button, Editable, EditableInput, EditablePreview, Flex, Select, Spacer, Text, Textarea, useToast } from "@chakra-ui/react";
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
      console.error("Failed to delete column", error);
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

      const updatedTasks = tasks.map(task => ({
        ...task,
        position: task.position + 1
      }));

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
      console.error("Error adding task: ", error);
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
      console.error("Failed to delete task: ", error);
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

      setTodosData(prevState => ({
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [taskId]: {
            ...prevState.tasks[taskId],
            date_completed: currentDate.getTime(),
          },
        },
        columns: {
          ...prevState.columns,
          [prevState.columnOrder[0]]: {
            ...prevState.columns[prevState.columnOrder[0]],
            taskIds: [taskId, ...prevState.columns[prevState.columnOrder[0]].taskIds],
          },
          [column.column_id]: {
            ...prevState.columns[column.column_id],
            taskIds: prevState.columns[column.column_id].taskIds.filter(id => id !== taskId),
          },
        },
      }));

      await axios.patch(`/api/todos/${taskId}`, { date_completed: currentDate.getTime().toString(), groupId: 'column-1' }, { headers: { Authorization: `Bearer ${fetchedTodosData.access_token}` } });
      toast({
        title: "Task completed",
        description: "Great work!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error("Error completing task: ", error);
      toast({
        title: "Failed to complete task",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
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
      })
    } catch (error) {
      console.error("Error updating column title:", error);
      toast({
        title: "Error updating column title",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
    }
  };


  return (
    <Flex flex={1} padding={2} alignItems={"center"} flexDir={"column"} minH={"100%"} w={"100%"}>
      {showDelete
        ? <Flex mb={2} _hover={{ opacity: 0.5}}>
            <FaMinusCircle size={24} onClick={() => setShowDelete(false)} cursor={"pointer"}/>
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
      <Flex flexDir={"column"} border={"3px solid black"} borderRadius={10} borderBottomLeftRadius={0} borderBottomRightRadius={0} w={"100%"} alignItems={"center"} borderBottom={"none"}>
        <Select placeholder="Sort" size={"xs"} borderRadius={10} cursor={"pointer"} maxW={"100px"} flex={1} variant={"filled"} ml={"auto"} mr={2} mt={2} onChange={(e) => sortTasks(e.target.value)}>
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="Due">Due Date</option>
          <option value="Priority">Priority</option>
        </Select>
        <Editable defaultValue={column.title} cursor={"pointer"} textAlign={"center"} fontSize={20} fontWeight={"bold"} w={"100%"} onSubmit={changeTitle}>
          <EditablePreview />
          <EditableInput />
        </Editable>
      </Flex>
      <Droppable droppableId={column.column_id}>
        {(provided, snapshot) => (
          <Flex
            ref={provided.innerRef}
            {...provided.droppableProps}
            bg={snapshot.isDraggingOver ? "gray.200" : "white"}
            flexDir={"column"}
            minH={"500px"}
            h={"100%"}
            minW={"100%"}
            flex={1}
            border={"3px solid black"}
            borderRadius={10}
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            p={4}
            overflow={"auto"}
            >
            {column.title !== "Completed"
              ? <Button w={"100%"} mb={4} onClick={() => setAddTodo(true)}>
                  <FaPlus />
                </Button>
              : null}
            {addTodo
              ? <Flex w={"100%"} flexDir={"column"} mb={4}>
                  <Flex mb={2} alignItems={"center"}>
                    <Flex flexDir={"column"} zIndex={100}>
                      <Text fontSize={"sm"}>Due Date:</Text>
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
                      <Text fontSize={"sm"}>Priority:</Text>
                      <Select onChange={(e) => setPriority(e.target.value)} size={"xs"}>
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Highest">Highest</option>
                      </Select>
                    </Flex>
                  </Flex>
                  <Textarea
                    w={"100%"}
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
            )) : <Text my={2} textAlign={"center"}>Empty</Text>}
            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </Flex>
  )
}