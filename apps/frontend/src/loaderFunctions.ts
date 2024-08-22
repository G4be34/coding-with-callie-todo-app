import axios from "axios";
import { redirect } from "react-router-dom";

export const authenticateUser = async ({ request }: { request: Request }) => {
  const token = localStorage.getItem('token');
  if (token) {
    const { access_token, expiration_date } = JSON.parse(token);
    if (Date.now() < expiration_date) {
      return { access_token };
    } else {
      localStorage.removeItem('token');
      sessionStorage.setItem('redirect_after_login', new URL(request.url).pathname);
      return redirect('/login');
    }
  } else {
    sessionStorage.setItem('redirect_after_login', new URL(request.url).pathname);
    return redirect('/login');
  }
};

export const getTodosData = async () => {
  const token = localStorage.getItem('token');
  const preParsedId = localStorage.getItem('user_id');
  const userId = parseInt(preParsedId!, 10);
  const { access_token } = JSON.parse(token!);

  const response = await axios.get('/api/groups?user=' + userId, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const fetchedTodosData = response.data;

  return { access_token, userId, fetchedTodosData };
};

export const getGraphsData = async () => {
  const token = localStorage.getItem('token');
  const preParsedId = localStorage.getItem('user_id');
  const userId = parseInt(preParsedId!, 10);
  const { access_token } = JSON.parse(token!);
  let areaChartData;
  let scatterChartData;
  const priorityCounts = {};
  const stackedBarObj = {};

  const response = await axios.get(`/api/todos?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  });

  const sortedTasks = response.data.sort((a, b) => parseInt(a.date_completed) - parseInt(b.date_completed));

  const getWeekLabel = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const month = String(startOfWeek.getMonth() + 1).padStart(2, '0');
    const day = String(startOfWeek.getDate()).padStart(2, '0');
    return `${month}/${day}`;
  };

  const tasksByWeek = sortedTasks.reduce((acc, task) => {
    if (priorityCounts[task.priority]) {
      priorityCounts[task.priority]++;
    } else {
      priorityCounts[task.priority] = 1;
    }

    if (task.date_completed) {
      const weekLabel = getWeekLabel(task.date_completed);

      if (!acc[weekLabel]) {
        acc[weekLabel] = { completed: 0 };
      }

      acc[weekLabel].completed++;
    }

    const weekLabel = getWeekLabel(task.date_added);
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

  const unsortedStackedBarChartData = Object.entries(stackedBarObj).map(([week, priorities]) => ({
    week,
    ...priorities,
  }));

  const stackedBarChartData = unsortedStackedBarChartData.sort((a, b) => {
    const dateA = new Date(a.week);
    const dateB = new Date(b.week);
    return dateA.getTime() - dateB.getTime();
  });

  const pieChartData = Object.entries(priorityCounts).map(([priority, count]) => ({ name: priority, value: count }));

  const barChartData = Object.entries(tasksByWeek).map(([week, { completed, incomplete }]) => ({
    week,
    completed,
    incomplete,
  }));

  return { barChartData, pieChartData, stackedBarChartData };
};

export const getCalendarData = async () => {
  console.log("retrieving calendar data");

  return true;
};
