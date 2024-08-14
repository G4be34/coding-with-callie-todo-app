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
  let pieChartData;
  let lineChartData;
  let areaChartData;
  let scatterChartData;

  const response = await axios.get(`/api/todos?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  });

  const barSortedTasks = response.data.sort((a, b) => parseInt(a.date_completed) - parseInt(b.date_completed));

  const getWeekLabel = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const month = String(startOfWeek.getMonth() + 1).padStart(2, '0');
    const day = String(startOfWeek.getDate()).padStart(2, '0');
    return `${month}/${day}`;
  };

  const tasksByWeek = barSortedTasks.reduce((acc, task) => {
    if (task.date_completed) {
      const weekLabel = getWeekLabel(task.date_completed);
      if (!acc[weekLabel]) {
        acc[weekLabel] = 0;
      }
      acc[weekLabel]++;
    }
    return acc;
  }, {});

  const barChartData = Object.entries(tasksByWeek).map(([week, completed]) => ({
    week,
    completed,
  }));

  return { barChartData };
};

export const getCalendarData = async () => {
  console.log("retrieving calendar data");

  return true;
};
