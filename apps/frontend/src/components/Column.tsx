import { Button, Editable, EditableInput, EditablePreview, Flex, Select, Spacer, Text, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaMinusCircle, FaPlus } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import { useAuth } from "../context/AuthProvider";
import { useTodos } from "../context/TodosProvider";
import { TaskItem } from "./TaskItem";


type Task = {
  id: string;
  content: string;
  date_added: number;
  date_completed: number | null;
  priority: string;
  due_date: number | null;
};

type ColumnData = {
  id: string;
  title: string;
  taskIds: string[];
};

export const Column = ({ column, tasks }: { column: ColumnData, tasks: Task[] }) => {
  const { setTodosData, todosData } = useTodos();
  const { token, user } = useAuth();
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

    setTodosData(prevState => ({
      ...prevState,
      tasks: Object.fromEntries(Object.entries(prevState.tasks).filter(([taskId, _]) => !taskIdsToDelete.includes(taskId))),
      columns: Object.fromEntries(Object.entries(prevState.columns).filter(([columnIdToDelete, _]) => columnIdToDelete !== columnId)),
      columnOrder: updatedColumnOrder,
    }));

    toast({
      title: `Column ${column.title} has been deleted`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });

    try {
      await axios.delete(`/api/groups/${columnId}`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to delete column",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const addNewTodo = () => {
    if (newTodo.trim() === "") return;

    const newTaskId = uuid();
    const currentDate = new Date();

    const newTask: Task = {
      id: newTaskId,
      content: newTodo.trim(),
      date_added: currentDate.getTime(),
      date_completed: null,
      priority,
      due_date: dueDate.getTime(),
    };

    setTodosData(prevState => ({
      ...prevState,
      tasks: {
        ...prevState.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...prevState.columns,
        [column.id]: {
          ...prevState.columns[column.id],
          taskIds: [newTaskId, ...prevState.columns[column.id].taskIds],
        },
      },
    }));

    setNewTodo("");
    setDueDate(new Date());
    setPriority("Normal");
    setAddTodo(false);

    toast({
      title: "Task added",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  const deleteTodo = (taskIdToDelete: string) => {
    const updatedTasks = Object.entries(todosData.tasks).filter(([taskId, _]) => taskId !== taskIdToDelete);
    const updatedColumnTaskIds = todosData.columns[column.id].taskIds.filter((id) => id !== taskIdToDelete);

    setTodosData(prevState => ({
      ...prevState,
      tasks: Object.fromEntries(updatedTasks),
      columns: {
        ...prevState.columns,
        [column.id]: {
          ...prevState.columns[column.id],
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
  };

  const completeTodo = (taskId: string) => {
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
        [column.id]: {
          ...prevState.columns[column.id],
          taskIds: prevState.columns[column.id].taskIds.filter(id => id !== taskId),
        },
      },
    }));

    toast({
      title: "Task completed",
      description: "Great work!",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  const sortTasks = (sortValue: string) => {
    if (sortValue === "Sort") return;

    let sortedTasks: Task[] = [];

    switch (sortValue) {
      case "Newest":
        sortedTasks = [...tasks].sort((a, b) => b.date_added - a.date_added);
        break;
      case "Oldest":
        sortedTasks = [...tasks].sort((a, b) => a.date_added - b.date_added);
        break;
      case "Due":
        sortedTasks = [...tasks].sort((a, b) => (a.due_date || Infinity) - (b.due_date || Infinity));
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
        [column.id]: {
          ...prevState.columns[column.id],
          taskIds: sortedTasks.map(task => task.id),
        },
      },
    }));
  }


  return (
    <Flex flex={1} padding={2} alignItems={"center"} flexDir={"column"} minH={"100%"} w={"100%"}>
      {showDelete
        ? <Flex mb={2} _hover={{ opacity: 0.5}}>
            <FaMinusCircle size={24} onClick={() => setShowDelete(false)} cursor={"pointer"}/>
          </Flex>
        : <Button
            autoFocus
            size={"xs"}
            onClick={() => deleteColumn(column.id)}
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
        <Editable defaultValue={column.title} cursor={"pointer"} textAlign={"center"} fontSize={20} fontWeight={"bold"} w={"100%"}>
          <EditablePreview />
          <EditableInput />
        </Editable>
      </Flex>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Flex
            ref={provided.innerRef}
            {...provided.droppableProps}
            bg={snapshot.isDraggingOver ? "gray.200" : "white"}
            flexDir={"column"}
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
              <TaskItem key={task.id} task={task} index={index} deleteTodo={deleteTodo} completeTodo={completeTodo} />
            )) : <Text my={2} textAlign={"center"}>Empty</Text>}
            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </Flex>
  )
}