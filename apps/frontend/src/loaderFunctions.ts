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
  const priorityCounts = {};
  const stackedBarObj = {};
  const areaChartObj = {};
  const currentDate = new Date().getTime();
  let numOfIncomplete = 0;
  let numOfOverdue = 0;

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
      const weekLabel = getWeekLabel(task.date_completed);
      const timeToComplete = parseInt(task.date_completed) - parseInt(task.date_added);
      const hoursToComplete = Math.floor(timeToComplete / (1000 * 60 * 60));

      if (!areaChartObj[weekLabel]) {
        areaChartObj[weekLabel] = {
          Normal: [],
          High: [],
          Highest: [],
        };
      }

      areaChartObj[weekLabel][task.priority].push(hoursToComplete);

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

  for (const week in areaChartObj) {
    if (areaChartObj[week].Normal.length > 0) {
      areaChartObj[week].Normal = Math.floor(areaChartObj[week].Normal.reduce((acc, val) => acc + val, 0) / areaChartObj[week].Normal.length);
    } else {
      areaChartObj[week].Normal = 0; // or handle it as needed
    }

    if (areaChartObj[week].High.length > 0) {
      areaChartObj[week].High = Math.floor(areaChartObj[week].High.reduce((acc, val) => acc + val, 0) / areaChartObj[week].High.length);
    } else {
      areaChartObj[week].High = 0; // or handle it as needed
    }

    if (areaChartObj[week].Highest.length > 0) {
      areaChartObj[week].Highest = Math.floor(areaChartObj[week].Highest.reduce((acc, val) => acc + val, 0) / areaChartObj[week].Highest.length);
    } else {
      areaChartObj[week].Highest = 0; // or handle it as needed
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

  const unsortedPieChartData = Object.entries(priorityCounts).map(([priority, count]) => ({ name: priority, value: count }));
  const pieChartData = unsortedPieChartData.sort((a, b) => b.name - a.name);
  console.log("pie chart data", pieChartData);

  const barChartData = Object.entries(tasksByWeek).map(([week, { completed, incomplete }]) => ({
    week,
    completed,
    incomplete,
  }));

  return { barChartData, pieChartData, stackedBarChartData, areaChartData, numOfIncomplete, numOfOverdue };
};

export const getCalendarData = async () => {
  console.log("retrieving calendar data");

  return true;
};
