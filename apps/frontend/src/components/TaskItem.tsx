import { Button, Card, CardBody, CardFooter, CardHeader, Flex, Text, Textarea } from "@chakra-ui/react"
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

export const TaskItem = ({ task, index, deleteTodo }) => {
  const { setTodosData } = useTodos();
  const [editing, setEditing] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");

  const completeTask = () => {
    const currentDate = new Date();

    setTodosData(prevState => ({
      ...prevState,
      tasks: {
        ...prevState.tasks,
        [task.id]: {
          ...prevState.tasks[task.id],
          date_completed: currentDate.getTime(),
        },
      },
    }));
  };

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
              : <Button size={"xs"} onClick={completeTask} bg={"green"} _hover={{ bg: "green.500" }} color={"white"} p={3}>Mark as Completed</Button>}
          </CardFooter>
        </Card>
      )}
    </Draggable>
  )
}