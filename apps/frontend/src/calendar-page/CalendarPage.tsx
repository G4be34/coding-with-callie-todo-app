import { Flex, useToast } from '@chakra-ui/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';
import './calendarpage.css';


type CalendarDataType = {
  title: string;
  date: string;
};

type LoaderDataType = {
  calendarData: CalendarDataType[];
  access_token: string;
}

export const CalendarPage = () => {
  const { calendarData, access_token } = useLoaderData() as LoaderDataType;
  const toast = useToast();

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

  return (
    <Flex flex={1} p={5}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        handleWindowResize
        events={calendarData}
        editable
        eventDrop={updateDueDate}
      />
    </Flex>
  )
}