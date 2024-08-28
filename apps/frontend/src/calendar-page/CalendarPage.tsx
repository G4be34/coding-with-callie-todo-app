import { Flex } from '@chakra-ui/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import './calendarpage.css';

export const CalendarPage = () => {
  return (
    <Flex flex={1} p={5}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        handleWindowResize
        events={[
          { title: 'event 1', date: '2024-08-01' },
          { title: 'event 2', date: '2024-08-02' },
        ]}
      />
    </Flex>
  )
}