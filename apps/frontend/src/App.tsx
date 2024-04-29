import { Flex, Spinner, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Outlet, RouterProvider, createBrowserRouter, useNavigate, useNavigation } from 'react-router-dom';
import './App.css';
import { ForgotPassword } from './auth/forgot-password-page/ForgotPassword';
import { LoginPage } from './auth/login-page/LoginPage';
import { SignUpPage } from './auth/signup-page/SignUpPage';
import { CalendarPage } from './calendar-page/CalendarPage';
import { Header } from './components/Header';
import { ProfileModal } from './components/ProfileModal';
import { GraphsPage } from './graphs-page/GraphsPage';
import { authenticateUser, getCalendarData, getGraphsData, getTodosData } from './loaderFunctions';
import { TodosPage } from './todos-page/TodosPage';


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      loader: authenticateUser,
      children: [
        {
          index: true,
          loader: getTodosData,
          element: <TodosPage />
        },
        {
          path: "data",
          loader: getGraphsData,
          element: <GraphsPage />
        },
        {
          path: "calendar",
          loader: getCalendarData,
          element: <CalendarPage />
        },
      ]
    },
    { path: "/login", element: <LoginPage /> },
    { path: "/sign-up", element: <SignUpPage /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

function Layout() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem('token');
  const stringId = localStorage.getItem('user_id');
  const userId = parseInt(stringId!, 10);
  const { access_token } = JSON.parse(token!);
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [user, setUser] = useState({});

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    setUser({});
    toast({
      title: 'Logged out',
      description: "Successfully logged out",
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top'
    })
    navigate('/login');
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userResponse = await axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        });

        const photoResponse = await axios.post('/api/image/s3_download', { user_id: userId }, {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        });
        const photo = photoResponse.data;
        const photoBase64 = `data:image/png;base64,${photo}`;

        setUser({_id: userId, ...userResponse.data.user, photo: photoBase64});

        toast({
          title: `Welcome ${userResponse.data.username}!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      } catch (error) {
        console.error("Error fetching user data in header: ", error);
        toast({
          title: 'Error',
          description: "Please try again",
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
      }
    }

    getUserData();
  }, [token]);

  if (navigation.state === "loading") {
    return <Spinner color="blue.500" size="xl" position={"fixed"} top={"50%"} left={"50%"} bottom={"50%"} right={"50%"} />;
  }

  return (
    <Flex flexDirection={"column"} minH={"100vh"} justifyContent={"space-between"}>
      {showModal && <ProfileModal setShowModal={setShowModal} showModal={showModal} user={user} setUser={setUser} token={token} logoutUser={logoutUser} />}
      <Header setShowModal={setShowModal} setShowOptions={setShowOptions} showOptions={showOptions} logoutUser={logoutUser} user={user} />
      <Outlet />
      <Flex as="footer" justifyContent={"center"} alignItems={"center"} p={4} borderTop={"1px solid black"}>
        © 2024 CWC Todo App. All rights reserved.
      </Flex>
    </Flex>
  );
}

export default App;
