import { Editable, EditableInput, EditablePreview, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Select, Text, useToast } from '@chakra-ui/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import './calendarpage.css';


type CalendarDataType = {
  title: string;
  date: string;
  priority: string;
  id: string;
};

type LoaderDataType = {
  calendarData: CalendarDataType[];
  access_token: string;
}

export const CalendarPage = () => {
  const { calendarData, access_token } = useLoaderData() as LoaderDataType;
  const toast = useToast();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarDataType | null>(null);
  const calendarRef = useRef<FullCalendar | null>(null);

  const updateDueDate = async (info) => {
    const newDate = new Date(info.event.start).getTime();
    const id = info.event.id;

    try {
      await axios.patch(`/api/todos/${id}`, { due_date: newDate }, { headers: { Authorization: `Bearer ${access_token}` } });

      toast({
        title: 'Updated due date',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
    } catch (error) {
      console.error("Error updating due date:", error);
      toast({
        title: 'Error updating due date',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
    }
  };

  const handleEventClick = (info) => {
    const { title, extendedProps } = info.event;
    const { priority } = extendedProps;
    const { id } = info.event;
    const { date } = info.event;

    setSelectedEvent({ title, priority, date, id });
    setShowTaskModal(true);
  };

  const changeDescription = async (description: string) => {
    try {
      await axios.patch(`/api/todos/${selectedEvent?.id}`, { description }, { headers: { Authorization: `Bearer ${access_token}` } });

      setSelectedEvent((prev) => prev ? { ...prev, title: description } : prev);

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
      console.error("Error changing description:", error);
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

  };


  return (
    <Flex flex={1} p={5}>
      {showTaskModal
        ? <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} isCentered size={"md"}>
            <ModalOverlay />
            <ModalContent>
              <ModalBody>
                <Flex>
                  <Text>Description: </Text>
                  <Editable
                    textAlign="center"
                    cursor={"pointer"}
                    w={"100%"}
                    onSubmit={changeDescription}
                    defaultValue={selectedEvent?.title}
                  >
                    <EditablePreview />
                    <EditableInput />
                  </Editable>
                </Flex>
                <Flex>
                  <Text>Priority: </Text>
                  <Select
                    cursor={"pointer"}
                    size={"sm"}
                    defaultValue={selectedEvent?.priority}
                    bg={selectedEvent?.priority === 'Highest' ? 'red' : selectedEvent?.priority === 'High' ? 'orange' : 'gray'}
                    color={selectedEvent?.priority === 'High' ? 'black' : 'white'}
                    variant={"filled"}
                    onChange={(e) => changePriority(e.target.value)}
                  >
                    <option value="Highest">Highest</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                  </Select>
                </Flex>
              </ModalBody>
            </ModalContent>
          </Modal>
        : null
      }
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        handleWindowResize
        events={calendarData}
        editable
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