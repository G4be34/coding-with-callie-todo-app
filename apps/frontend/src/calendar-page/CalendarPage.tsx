import { Button, Editable, EditablePreview, EditableTextarea, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Select, Text, useToast, useToken } from '@chakra-ui/react';
import { EventClickArg, EventDropArg } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import { TiDelete } from 'react-icons/ti';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import { TaskType } from '../types';
import './calendarpage.css';


type CalendarDataType = {
  title: string;
  priority: string;
  id: string;
  date?: string;
};

type LoaderDataType = {
  calendarData: CalendarDataType[];
  access_token: string;
  completedTodos: TaskType[]
}

export const CalendarPage = () => {
  const { calendarData, access_token, completedTodos } = useLoaderData() as LoaderDataType;
  const { user } = useOutletContext() as { user: { background: string }};
  const [iconColor] = useToken("colors", ["taskItemHeaderIcons"]);
  const calendarRef = useRef<FullCalendar | null>(null);
  const toast = useToast();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarDataType | null>(null);
  const [filterType, setFilterType] = useState('All');
  const [stateCalendarData, setStateCalendarData] = useState(calendarData);


  const filterCalendarData = (priority: string) => {
    if (priority === 'All') {
      setFilterType('All');
      setStateCalendarData(calendarData);
    } else if (priority === 'Highest') {
      setFilterType('Highest');
      setStateCalendarData(calendarData.filter((task) => task.priority === 'Highest'));
    } else if (priority === 'High') {
      setFilterType('High');
      setStateCalendarData(calendarData.filter((task) => task.priority === 'High'));
    } else if (priority === 'Normal') {
      setFilterType('Normal');
      setStateCalendarData(calendarData.filter((task) => task.priority === 'Normal'));
    }

    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.refetchEvents();
  };

  const updateDueDate = async (info: EventDropArg) => {
    const date = new Date(info.event.start!);
    const newDate = date.getTime();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const id = info.event.id;

    calendarData.forEach((task) => {
      if (task.id === id) {
        task.date = formattedDate;
      }
    });

    try {
      await axios.patch(`/api/todos/${id}`, { due_date: newDate }, { headers: { Authorization: `Bearer ${access_token}` } });

      toast({
        title: 'Updated due date',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      toast({
        title: 'Error updating due date',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleEventClick = (info: EventClickArg) => {
    const { title, extendedProps } = info.event;
    const { priority } = extendedProps;
    const { id } = info.event;

    setSelectedEvent({ title, priority, id });
    setShowTaskModal(true);
  };

  const changeDescription = async (description: string) => {
    if (description === selectedEvent?.title) return;
    try {
      await axios.patch(`/api/todos/${selectedEvent?.id}`, { description }, { headers: { Authorization: `Bearer ${access_token}` } });

      setSelectedEvent((prev) => prev ? { ...prev, title: description } : prev);
      calendarData.forEach((task) => {
        if (task.id === selectedEvent?.id) {
          task.title = description;
        }
      });

      const calendarApi = calendarRef.current?.getApi();
      if (selectedEvent) {
        const calendarEvent = calendarApi?.getEventById(selectedEvent.id);
        if (calendarEvent) {
          calendarEvent.setProp('title', description);
        }
      }

      toast({
        title: "Description has been updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error changing description",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const changePriority = async (priority: string) => {
    try {
      if (priority === selectedEvent?.priority) return;
      await axios.patch(`/api/todos/${selectedEvent?.id}`, { priority }, { headers: { Authorization: `Bearer ${access_token}` } });

      setSelectedEvent((prev) => prev ? { ...prev, priority } : prev);
      calendarData.forEach((task) => {
        if (task.id === selectedEvent?.id) {
          task.priority = priority;
        }
      });

      const calendarApi = calendarRef.current?.getApi();
      if (selectedEvent) {
        const calendarEvent = calendarApi?.getEventById(selectedEvent.id);
        if (calendarEvent) {
          calendarEvent.setExtendedProp('priority', priority);
        }
      }

      if (filterType !== "All") {
        setStateCalendarData((prev) => prev.filter((task) => task.priority === filterType));
      }

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

  const completeTask = async (id: string) => {
    const currentDate = new Date().getTime();

    const unfinishedTasksToUpdate = completedTodos.map((todo) => ({
      todo_id: todo.todo_id,
      position: todo.position + 1,
    }));

    const tasksToUpdate = [{ todo_id: id, position: 0 }, ...unfinishedTasksToUpdate];

    try {
      await axios.patch('/api/todos/update-positions', { tasksToUpdate }, { headers: { Authorization: `Bearer ${access_token}` } });

      await axios.patch(`/api/todos/${id}`, {
        date_completed: currentDate.toString(),
        groupId: 'column-1'
      },
      { headers: { Authorization: `Bearer ${access_token}` } });

      setStateCalendarData((prev) => {
        return prev.filter((task) => task.id !== id);
      });

      setShowTaskModal(false);
      setSelectedEvent(null);

      toast({
        title: "Task completed",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error completing task",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };


  return (
    <Flex p={5} flexDir={"column"} w={"100%"} bgImg={`url(/${user.background})`} bgPos="center" bgSize="cover" bgRepeat="no-repeat">
      {showTaskModal
        ? <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} isCentered size={"lg"}>
            <ModalOverlay />
            <ModalContent bgColor={"todoHeader"}>
              <ModalBody pos={"relative"} >
                <TiDelete
                  style={{ position: "absolute", top: 2, right: 2, cursor: "pointer" }}
                  size={30}
                  onClick={() => setShowTaskModal(false)}
                  color={iconColor}
                  />
                <Flex m={5}>
                  <Text pt={1} fontWeight={"bold"} color={"todoFontColor"}>Description: </Text>
                  <Editable
                    textAlign="left"
                    h={120}
                    cursor={"pointer"}
                    w={"100%"}
                    submitOnBlur
                    onSubmit={changeDescription}
                    defaultValue={selectedEvent?.title}
                    pl={4}
                  >
                    <EditablePreview color={"todoFontColor"} />
                    <EditableTextarea color={"todoFontColor"} />
                  </Editable>
                </Flex>
                <Flex w={"100%"} m={5}>
                  <Text fontWeight={"bold"} color={"todoFontColor"}>Priority: </Text>
                  <Select
                    cursor={"pointer"}
                    w={120}
                    mx={"auto"}
                    borderRadius={10}
                    bg={selectedEvent?.priority === 'Highest' ? 'red' : selectedEvent?.priority === 'High' ? 'orange' : 'gray'}
                    color={selectedEvent?.priority === 'High' ? 'black' : 'white'}
                    _focus={{ backgroundColor: selectedEvent?.priority === 'Highest' ? 'red' : selectedEvent?.priority === 'High' ? 'orange' : 'gray' }}
                    size={"s"}
                    variant={"filled"}
                    onChange={(e) => changePriority(e.target.value)}
                    defaultValue={selectedEvent?.priority}
                    textIndent="0.5em"
                  >
                    <option value="Highest">Highest</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                  </Select>
                </Flex>
                <Flex justifyContent={"center"} alignItems={"center"} mt={"70px"} mb={5}>
                  <Button
                    size={"sm"}
                    onClick={() => completeTask(selectedEvent!.id)}
                    bg={"green"}
                    _hover={{ bg: "green.500" }}
                    color={"white"}
                    p={3}
                  >
                    Complete Task
                  </Button>
                </Flex>
              </ModalBody>
            </ModalContent>
          </Modal>
        : null
      }
      <Flex justifyContent={"flex-end"} w={"100%"} mb={5} alignItems={"center"}>
        <Text fontWeight={"bold"} fontSize={"lg"} mr={4} color={"#FFFFFF"}>Filter by priority:</Text>
        <Select
          cursor={"pointer"}
          w={120}
          borderRadius={10}
          bg={filterType === 'Highest' ? 'red' : filterType === 'High' ? 'orange' : 'gray'}
          color={filterType === 'High' ? 'black' : 'white'}
          _focus={{ backgroundColor: filterType === 'Highest' ? 'red' : filterType === 'High' ? 'orange' : 'gray' }}
          size={"s"}
          textIndent={"0.5em"}
          variant={"filled"}
          defaultValue={"All"}
          onChange={(e) => filterCalendarData(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Highest">Highest</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
        </Select>
      </Flex>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          handleWindowResize
          height={"100%"}
          events={stateCalendarData}
          editable
          ref={calendarRef}
          eventDrop={updateDueDate}
          eventClick={handleEventClick}
          eventClassNames={(arg) => {
            if (arg.event.extendedProps.priority === 'Highest') {
              return 'highest-priority';
            } else if (arg.event.extendedProps.priority === 'High') {
              return 'high-priority';
            } else if (arg.event.extendedProps.priority === 'Normal') {
              return 'normal-priority';
            }
            return '';
          }}
        />

    </Flex>
  )
}