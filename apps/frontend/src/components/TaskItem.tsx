import { Button, Card, CardBody, CardFooter, CardHeader, Flex, Select, Spacer, Text, Textarea, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { TiDelete } from "react-icons/ti"

const options: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}

export const TaskItem = ({ task, index, deleteTodo, completeTodo, setTodosData }) => {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [editDueDate, setEditDueDate] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");


  const editTodo = () => {
    setTodosData(prevState => ({
      ...prevState,
      tasks: {
        ...prevState.tasks,
        [task.todo_id]: {
          ...prevState.tasks[task.todo_id],
          content: newTaskContent,
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
  };

  const handleEnterKey = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      editTodo();
      setEditing(false);
    }
  };

  const changePriority = (priority: string) => {
    setTodosData(prevState => ({
      ...prevState,
      tasks: {
        ...prevState.tasks,
        [task.id]: {
          ...prevState.tasks[task.id],
          priority,
        },
      },
    }));

    toast({
      title: "Priority has been updated",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  const changeDueDate = (date: Date) => {
    setTodosData(prevState => ({
      ...prevState,
      tasks: {
        ...prevState.tasks,
        [task.id]: {
          ...prevState.tasks[task.id],
          due_date: date.getTime(),
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
  };


  return (
    <Draggable draggableId={task.todo_id} index={index}>
      {(provided, snapshot) => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          bg={snapshot.isDragging ? "green.200" : "white"}
          border={"1px solid black"}
          w={300}
          size={"sm"}
          mb={2}
          boxShadow={"0px 2px 6px rgba(0, 0, 0, 0.3)"}
          pos={"relative"}
          borderRadius={10}
          >
          <CardHeader flexDir={"column"}>
            {editDueDate
              ? <DatePicker
                  onBlur={() => setEditDueDate(false)}
                  selected={new Date(task.due_date)}
                  openToDate={new Date(task.due_date)}
                  onChange={(date: Date) => changeDueDate(date)}
                  fixedHeight
                  showIcon
                  />
              : <>
                  <Text fontWeight={"bold"} fontSize={"sm"}>Due</Text>
                  <Text onClick={() => setEditDueDate(true)} fontSize={"sm"}>{new Date(parseInt(task.due_date)).toLocaleDateString('en-US', options)}</Text>
                </>
              }

          </CardHeader>
          <Flex position={"absolute"} top={0} right={0} _hover={{ opacity: 0.5}}>
            <TiDelete size={30} cursor={"pointer"} onClick={() => deleteTodo(task.id)}/>
          </Flex>
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
                  />
              : <Text
                  onClick={() => setEditing(true)}
                  _hover={{ cursor: "pointer" }}
                  >
                    {task.description}
                  </Text>
                }
          </CardBody>
          <CardFooter>
            {task.date_completed
              ? <Flex flexDir={"column"}>
                  <Text fontWeight={"bold"} fontSize={"sm"}>Completed </Text>
                  <Text fontSize={"sm"}>{new Date(task.date_completed).toLocaleDateString('en-US', options)}</Text>
                </Flex>
              : <Flex w={"100%"} alignItems={"center"}>
                  <Button size={"xs"} onClick={() => completeTodo(task.todo_id)} bg={"green"} _hover={{ bg: "green.500" }} color={"white"} p={3}>Complete</Button>
                  <Spacer />
                  <Select
                    defaultValue={task.priority}
                    size={"xs"}
                    variant={"filled"}
                    bg={task.priority === "Normal" ? "gray" : task.priority === "High" ? "orange" : task.priority === "Highest" ? "red" : "gray"}
                    w={"35%"}
                    color={task.priority === "High" ? "black" : "white"}
                    borderRadius={10}
                    onChange={(e) => changePriority(e.target.value)}
                    _hover={{ opacity: 0.70 }}
                    cursor={"pointer"}
                    _focus={{ backgroundColor: task.priority === "Normal" ? "gray" : task.priority === "High" ? "orange" : task.priority === "Highest" ? "red" : "gray" }}
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