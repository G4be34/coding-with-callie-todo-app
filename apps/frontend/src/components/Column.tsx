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
      <Editable defaultValue={column.title} textAlign={"center"}>
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
            minH={"100%"}
            minW={60}
            border={"1px solid black"}
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