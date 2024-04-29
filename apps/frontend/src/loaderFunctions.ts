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


  return { access_token, userId };
};

export const getGraphsData = async () => {
  console.log("Retrieving graphs data");

  return true;
};

export const getCalendarData = async () => {
  console.log("retrieving calendar data");

  return true;
};
