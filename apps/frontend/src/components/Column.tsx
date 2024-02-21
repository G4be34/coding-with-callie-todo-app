import { Editable, EditableInput, EditablePreview, Flex } from "@chakra-ui/react";
import { Droppable } from "react-beautiful-dnd";
import { TaskItem } from "./TaskItem";

type Task = {
  id: string;
  content: string;
};

type ColumnData = {
  id: string;
  title: string;
  taskIds: string[];
};

export const Column = ({ column, tasks }: { column: ColumnData, tasks: Task[] }) => {
  return (
    <Flex flex={1} padding={2} alignItems={"center"} flexDir={"column"}>
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
            {tasks.map((task, index) => (
              <TaskItem key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </Flex>
  )
}