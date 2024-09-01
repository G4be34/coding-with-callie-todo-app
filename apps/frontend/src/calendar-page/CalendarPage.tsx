import { Flex, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useToast } from '@chakra-ui/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import axios from 'axios';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import './calendarpage.css';


type CalendarDataType = {
  title: string;
  date: string;
  description: string;
  priority: string;
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
    const { description, priority } = extendedProps;

    setSelectedEvent({ title, description, priority, date: info.event.date });
    setShowTaskModal(true);
  };


  return (
    <Flex flex={1} p={5}>
      {showTaskModal
        ? <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} isCentered size={"md"}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {selectedEvent?.title}
              </ModalHeader>
              <ModalBody>
                {selectedEvent?.priority}
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