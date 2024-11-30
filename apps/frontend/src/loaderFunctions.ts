import axios from "axios";
import { redirect } from "react-router-dom";
import { validateToken } from "./utils";


type TaskType = {
  todo_id: string
  id: string | number | undefined
  description: string
  date_added: number | string
  date_completed: number | string | null
  priority: string
  due_date: number
  groupId: string
  position: number
};

export const getTodosData = async ({ request }: { request: Request }) => {
  try {
    const tokenValidation = await validateToken({ request });

    if (tokenValidation === null) {
      return redirect("/login");
    }

    const { access_token } = tokenValidation;
    const preParsedId = localStorage.getItem('user_id');
    const userId = parseInt(preParsedId!, 10);

    const response = await axios.get('/api/groups?user=' + userId, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const fetchedTodosData = response.data;

    return { access_token, userId, fetchedTodosData };
  } catch (error) {
    console.error("Error fetching todos data: ");
  }
};

export const getGraphsData = async ({ request }: { request: Request }) => {
  try {
    const tokenValidation = await validateToken({ request });

    if (tokenValidation === null) {
      return redirect("/login");
    }

    const { access_token } = tokenValidation;
    const preParsedId = localStorage.getItem('user_id');
    const userId = parseInt(preParsedId!, 10);
    const priorityCounts: { [key: string]: number } = {};
    const stackedBarObj: { [key: string]: { [key: string]: number }} = {};
    const areaChartObj: { [key: string]: { [key: string]: number[] | number }} = {};
    const currentDate = new Date().getTime();
    let numOfIncomplete = 0;
    let numOfOverdue = 0;

    const response = await axios.get(`/api/todos?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });

    const sortedTasks: TaskType[] = response.data.sort((a: TaskType, b: TaskType) => {
      const aDate = a.date_completed?.toString() ?? '0';
      const bDate = b.date_completed?.toString() ?? '0';
      return parseInt(aDate) - parseInt(bDate);
    });

    const getWeekLabel = (timestamp: string) => {
      const date = new Date(parseInt(timestamp));
      const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
      const month = String(startOfWeek.getMonth() + 1).padStart(2, '0');
      const day = String(startOfWeek.getDate()).padStart(2, '0');
      return `${month}/${day}`;
    };

    const tasksByWeek = sortedTasks.reduce((acc: { [key: string]: { completed: number } }, task) => {
      if (!task.date_completed) {
        numOfIncomplete++;
      }

      if (task.due_date < currentDate && !task.date_completed) {
        numOfOverdue++;
      }

      if (priorityCounts[task.priority]) {
        priorityCounts[task.priority]++;
      } else {
        priorityCounts[task.priority] = 1;
      }

      if (task.date_completed) {
        const weekLabel = getWeekLabel(task.date_completed.toString());
        const timeToComplete = parseInt(task.date_completed.toString()) - parseInt(task.date_added.toString());
        const hoursToComplete = Math.floor(timeToComplete / (1000 * 60 * 60));

        if (!areaChartObj[weekLabel]) {
          areaChartObj[weekLabel] = {
            Normal: [],
            High: [],
            Highest: [],
          };
        }

        (areaChartObj[weekLabel][task.priority] as number[]).push(hoursToComplete);

        if (!acc[weekLabel]) {
          acc[weekLabel] = { completed: 0 };
        }

        acc[weekLabel].completed++;
      }

      const weekLabel = getWeekLabel(task.date_added.toString());

      if (stackedBarObj[weekLabel]) {
        if (!stackedBarObj[weekLabel][task.priority]) {
          stackedBarObj[weekLabel][task.priority] = 1;
        } else {
          stackedBarObj[weekLabel][task.priority]++;
        }
      } else {
        stackedBarObj[weekLabel] = { [task.priority]: 1 };
      }

      return acc;
    }, {});

    for (const week in areaChartObj) {
      if (Array.isArray(areaChartObj[week].Normal) && areaChartObj[week].Normal.length > 0) {
        areaChartObj[week].Normal = Math.floor(areaChartObj[week].Normal.reduce((acc, val) => acc + val, 0) / areaChartObj[week].Normal.length);
      } else {
        areaChartObj[week].Normal = 0;
      }

      if (Array.isArray(areaChartObj[week].High) && areaChartObj[week].High.length > 0) {
        areaChartObj[week].High = Math.floor(areaChartObj[week].High.reduce((acc, val) => acc + val, 0) / areaChartObj[week].High.length);
      } else {
        areaChartObj[week].High = 0;
      }

      if (Array.isArray(areaChartObj[week].Highest) && areaChartObj[week].Highest.length > 0) {
        areaChartObj[week].Highest = Math.floor(areaChartObj[week].Highest.reduce((acc, val) => acc + val, 0) / areaChartObj[week].Highest.length);
      } else {
        areaChartObj[week].Highest = 0;
      }
    }

    const unsortedAreaChartData = Object.entries(areaChartObj).map(([week, priorities]) => ({
      week,
      ...priorities,
    }));

    const unsortedStackedBarChartData = Object.entries(stackedBarObj).map(([week, priorities]) => ({
      week,
      ...priorities,
    }));

    const areaChartData = unsortedAreaChartData.sort((a, b) => {
      const dateA = new Date(a.week);
      const dateB = new Date(b.week);
      return dateA.getTime() - dateB.getTime();
    })

    const stackedBarChartData = unsortedStackedBarChartData.sort((a, b) => {
      const dateA = new Date(a.week);
      const dateB = new Date(b.week);
      return dateA.getTime() - dateB.getTime();
    });

    const unsortedPieChartData: { name: string; value: number }[] = Object.entries(priorityCounts).map(([priority, count]) => ({ name: priority, value: count }));
    const pieChartData = unsortedPieChartData.sort((a, b) => b.name.localeCompare(a.name));

    const barChartData = Object.entries(tasksByWeek).map(([week, { completed }]) => ({
      week,
      completed,
    }));

    return { barChartData, pieChartData, stackedBarChartData, areaChartData, numOfIncomplete, numOfOverdue };
  } catch (error) {
    console.error("Error fetching graphs data");
  }
};

export const getCalendarData = async ({ request }: { request: Request }) => {
  try {
    const tokenValidation = await validateToken({ request });

    if (tokenValidation === null) {
      return redirect("/login");
    }

    const { access_token } = tokenValidation;
    const preParsedId = localStorage.getItem('user_id');
    const userId = parseInt(preParsedId!, 10);

    const response = await axios.get(`/api/todos/calendar-todos/${userId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });

    const { calendarData, completedTodos } = response.data;

    return { calendarData, access_token, completedTodos };
  } catch (error) {
    console.error("Error fetching calendar data: ");
  }
};
