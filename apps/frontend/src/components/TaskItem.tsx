import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Select, Spacer, Text, Textarea, useToast, useToken } from "@chakra-ui/react"
import { Draggable } from "@hello-pangea/dnd"
import axios from "axios"
import { useState } from "react"
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md"
import { RxHamburgerMenu } from "react-icons/rx"
import { TiDelete } from "react-icons/ti"
import { useLoaderData } from "react-router-dom"
import { InitialDataType, LoadedTodosDataType, TaskType } from "../types"


// type Task = {
//   todo_id: string;
//   id: string | number | undefined;
//   description: string;
//   date_added: number;
//   date_completed: string | null;
//   priority: string;
//   due_date: string;
//   groupId: string;
// };

type TaskItemPropsType = {
  task: TaskType;
  index: number;
  deleteTodo: (todo_id: string) => void;
  completeTodo: (todo_id: string) => void;
  setTodosData: React.Dispatch<React.SetStateAction<InitialDataType>>;
  setSelectedTodos: React.Dispatch<React.SetStateAction<string[]>>
}

const options: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}

export const TaskItem = ({ task, index, deleteTodo, completeTodo, setTodosData, setSelectedTodos }: TaskItemPropsType) => {
  const fetchedTodosData = useLoaderData() as LoadedTodosDataType;
  const [iconColor] = useToken("colors", ["taskItemHeaderIcons"]);
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [editDueDate, setEditDueDate] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [dueDate, setDueDate] = useState(task.due_date);
  const [priority, setPriority] = useState(task.priority);
  const [checked, setChecked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  const editTodo = async () => {
    try {
      await axios.patch(`/api/todos/${task.todo_id}`, {
        description: newTaskContent
      }, {
        headers: { Authorization: `Bearer ${fetchedTodosData.access_token}` }
      });

      setTodosData(prevState => ({
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [task.todo_id]: {
            ...prevState.tasks[task.todo_id],
            description: newTaskContent,
          },
        },
      }))

      toast({
        title: "Task has been edited",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error editing task description",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleEnterKey = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      editTodo();
      setEditing(false);
    }
  };

  const changePriority = async (priority: string) => {
    try {
      await axios.patch(`/api/todos/${task.todo_id}`, {
        priority
      }, {
        headers: { Authorization: `Bearer ${fetchedTodosData.access_token}` }
      })

      setTodosData(prevState => ({
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [task.todo_id]: {
            ...prevState.tasks[task.todo_id],
            priority,
          },
        },
      }));

      setPriority(priority);

      toast({
        title: "Priority has been updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error changing priority",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const changeDueDate = async (date: Date) => {
    try {
      await axios.patch(`/api/todos/${task.todo_id}`, {
        due_date: date.getTime().toString()
      }, {
        headers: { Authorization: `Bearer ${fetchedTodosData.access_token}` }
      });

      setDueDate(date.getTime().toString());

      setTodosData(prevState => ({
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [task.todo_id]: {
            ...prevState.tasks[task.todo_id],
            due_date: date.getTime().toString(),
          },
        },
      }));

      setEditDueDate(false);

      toast({
        title: "Due date has been updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error changing due date",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const selectTodo = () => {
    if (!checked) {
      setChecked(true);
      setSelectedTodos(prevState => [...prevState, task.todo_id]);
    } else {
      setChecked(false);
      setSelectedTodos(prevState => prevState.filter(id => id !== task.todo_id));
    }
  };

  const openDatePicker = () => {
    if (task.groupId === "column-1") {
      toast({
        title: "Error",
        description: "Due date cannot be edited for completed tasks",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return
    }

    setEditDueDate(true);
  };

  const openDescriptionEditor = () => {
    if (task.groupId === "column-1") {
      toast({
        title: "Error",
        description: "Task description cannot be edited for completed tasks",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return
    }

    setEditing(true);
  };


  return (
    <Draggable draggableId={task.todo_id} index={index}>
      {(provided, snapshot) => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          bg={snapshot.isDragging ? "dragBg" : "todoBody"}
          border={"1px solid black"}
          w={["250px", "250px", "300px"]}
          size={"sm"}
          mb={2}
          boxShadow={"0px 2px 6px rgba(0, 0, 0, 0.3)"}
          pos={"relative"}
          borderRadius={10}
          >
          <Box borderBottom={"1px solid black"} borderTopRadius={9} bgColor={"todoHeader"} p={1} display={"flex"} flexDir={"row"} justifyContent={"space-between"} alignItems={"center"}>
            {checked
              ? <MdCheckBox onClick={selectTodo} size={20} cursor={"pointer"} color={iconColor} />
              : <MdCheckBoxOutlineBlank onClick={selectTodo} size={20} cursor={"pointer"} color={iconColor} />}
            <RxHamburgerMenu size={20} color={iconColor} />
            {isDeleting
              ? <Button
                  autoFocus
                  onBlur={() => setIsDeleting(false)}
                  bg={"red"} color={"white"} size={"xs"}
                  onClick={() => deleteTodo(task.todo_id)}
                  marginY={1}
                  aria-label="Confirm task deletion"
                  >
                    Delete Task?
                  </Button>
              : <TiDelete size={30} cursor={"pointer"} onClick={() => setIsDeleting(true)} color={iconColor} aria-label="Delete Task" />
              }
          </Box>
          <CardHeader flexDir={"column"} cursor={"pointer"}>
            {editDueDate
              ? <DatePicker
                  onBlur={() => setEditDueDate(false)}
                  selected={new Date(Number(task.due_date))}
                  openToDate={new Date(Number(task.due_date))}
                  onChange={(date: Date) => changeDueDate(date)}
                  fixedHeight
                  showIcon
                  />
              : <>
                  <Text fontWeight={"bold"} fontSize={"sm"} color={"todoFontColor"}>Due</Text>
                  <Text color={"todoFontColor"} onClick={openDatePicker} fontSize={"sm"}>{new Date(Number(dueDate)).toLocaleDateString('en-US', options)}</Text>
                </>
              }
          </CardHeader>
          <CardBody>
            {editing
              ? <Textarea
                  defaultValue={task.description}
                  onBlur={() => setEditing(false)}
                  onChange={(e) => setNewTaskContent(e.target.value)}
                  onKeyDown={handleEnterKey}
                  autoFocus
                  resize={"none"}
                  width={"100%"}
                  color={"todoFontColor"}
                  />
              : <Text
                  onClick={openDescriptionEditor}
                  _hover={{ cursor: "pointer" }}
                  color={"todoFontColor"}
                  >
                    {task.description}
                  </Text>
                }
          </CardBody>
          <CardFooter>
            {task.date_completed
              ? <Flex flexDir={"column"}>
                  <Text fontWeight={"bold"} fontSize={"sm"} color={"todoFontColor"}>Completed </Text>
                  <Text fontSize={"sm"} color={"todoFontColor"}>{new Date(Number(task.date_completed)).toLocaleDateString('en-US', options)}</Text>
                </Flex>
              : <Flex w={"100%"} alignItems={"center"}>
                  <Button
                    size={"xs"}
                    onClick={() => completeTodo(task.todo_id)}
                    bg={"green"} _hover={{ bg: "green.500" }}
                    color={"white"}
                    aria-label="Mark task as complete"
                    p={3}
                    >
                      Complete
                    </Button>
                  <Spacer />
                  <Select
                    defaultValue={priority}
                    size={"xs"}
                    variant={"filled"}
                    bg={priority === "Normal" ? "gray" : priority === "High" ? "orange" : priority === "Highest" ? "red" : "gray"}
                    w={["40%", "40%", "35%"]}
                    color={priority === "High" ? "black" : "white"}
                    borderRadius={10}
                    onChange={(e) => changePriority(e.target.value)}
                    _hover={{ opacity: 0.70 }}
                    cursor={"pointer"}
                    _focus={{ backgroundColor: priority === "Normal" ? "gray" : priority === "High" ? "orange" : priority === "Highest" ? "red" : "gray" }}
                    >
                    <option value={"Normal"}>Normal</option>
                    <option value={"High"}>High</option>
                    <option value={"Highest"}>Highest</option>
                  </Select>
                </Flex>
              }
          </CardFooter>
        </Card>
      )}
    </Draggable>
  )
}