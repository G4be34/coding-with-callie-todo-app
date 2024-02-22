import { Button, Editable, EditableInput, EditablePreview, Flex, Textarea, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { FaMinusCircle, FaPlus } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import { useTodos } from "../context/TodosProvider";
import { TaskItem } from "./TaskItem";

type Task = {
  id: string;
  content: string;
  date_added: number;
  date_completed: number | null;
};

type ColumnData = {
  id: string;
  title: string;
  taskIds: string[];
};

export const Column = ({ column, tasks }: { column: ColumnData, tasks: Task[] }) => {
  const { setTodosData, todosData } = useTodos();
  const toast = useToast();
  const [showDelete, setShowDelete] = useState(true);
  const [addTodo, setAddTodo] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  const deleteColumn = (columnId: string) => {
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
  };

  const addNewTodo = () => {
    if (newTodo.trim() === "") return;

    const newTaskId = `task-${uuid()}`;
    const currentDate = new Date();

    const newTask: Task = {
      id: newTaskId,
      content: newTodo.trim(),
      date_added: currentDate.getTime(),
      date_completed: null,
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


  return (
    <Flex flex={1} padding={2} alignItems={"center"} flexDir={"column"}>
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
      <Editable defaultValue={column.title} textAlign={"center"} border={"3px solid black"} borderBottom={"none"} borderRadius={10} width={"100%"} borderBottomLeftRadius={0} borderBottomRightRadius={0} fontSize={20} fontWeight={"bold"}>
        <EditablePreview />
        <EditableInput />
      </Editable>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Flex
            ref={provided.innerRef}
            {...provided.droppableProps}
            bg={snapshot.isDraggingOver ? "gray.200" : "white"}
            flexDir={"column"}
            minH={"90%"}
            minW={"100%"}
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
              ? <Textarea
                  w={"100%"}
                  onBlur={() => setAddTodo(false)}
                  autoFocus
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
              : null
              }
            {tasks.map((task, index) => (
              <TaskItem key={task.id} task={task} index={index} deleteTodo={deleteTodo} completeTodo={completeTodo} />
            ))}
            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </Flex>
  )
}