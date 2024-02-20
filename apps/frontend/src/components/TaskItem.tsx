import { Card } from "@chakra-ui/react"
import { Draggable } from "react-beautiful-dnd"

export const TaskItem = ({ task, index }) => {

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          bg={snapshot.isDragging ? "green" : "white"}
          border={"1px solid black"}
          >
          {task.content}
        </Card>
      )}
    </Draggable>
  )
}