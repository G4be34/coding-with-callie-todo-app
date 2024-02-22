import { Button, Card, CardBody, CardFooter, CardHeader, Flex, Select, Spacer, Text, Textarea, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import { TiDelete } from "react-icons/ti"
import { useTodos } from "../context/TodosProvider"

const options: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}

export const TaskItem = ({ task, index, deleteTodo, completeTodo }) => {
  const { setTodosData } = useTodos();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");


  const editTodo = () => {
    setTodosData(prevState => ({
      ...prevState,
      tasks: {
        ...prevState.tasks,
        [task.id]: {
          ...prevState.tasks[task.id],
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


  return (
    <Draggable draggableId={task.id} index={index}>
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
            <Text fontWeight={"bold"} fontSize={"sm"}>Added </Text>
            <Text fontSize={"sm"}>{new Date(task.date_added).toLocaleDateString('en-US', options)}</Text>
          </CardHeader>
          <Flex position={"absolute"} top={0} right={0} _hover={{ opacity: 0.5}}>
            <TiDelete size={30} cursor={"pointer"} onClick={() => deleteTodo(task.id)}/>
          </Flex>
          <CardBody>
            {editing
              ? <Textarea
                  defaultValue={task.content}
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
                    {task.content}
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
                  <Button size={"xs"} onClick={() => completeTodo(task.id)} bg={"green"} _hover={{ bg: "green.500" }} color={"white"} p={3}>Complete</Button>
                  <Spacer />
                  <Select
                    defaultValue={task.priority}
                    size={"xs"}
                    variant={"filled"}
                    bg={task.priority === "Normal" ? "gray" : task.priority === "High" ? "orange" : task.priority === "Highest" ? "red" : "gray"}
                    w={"35%"}
                    color={task.priority === "High" ? "black" : "white"}
                    borderRadius={10}
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