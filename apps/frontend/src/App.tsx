import { Flex, Spinner } from '@chakra-ui/react';
import { useState } from 'react';
import { Outlet, RouterProvider, createBrowserRouter, useNavigation } from 'react-router-dom';
import './App.css';
import { ForgotPassword } from './auth/forgot-password-page/ForgotPassword';
import { LoginPage } from './auth/login-page/LoginPage';
import { SignUpPage } from './auth/signup-page/SignUpPage';
import { CalendarPage } from './calendar-page/CalendarPage';
import { Header } from './components/Header';
import { ProfileModal } from './components/ProfileModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import AuthProvider from './context/AuthProvider';
import TodosProvider from './context/TodosProvider';
import { GraphsPage } from './graphs-page/GraphsPage';
import { authenticateUser, getCalendarData, getGraphsData, getTodosData } from './loaderFunctions';
import { TodosPage } from './todos-page/TodosPage';


function App() {



  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
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
    <AuthProvider>
      <TodosProvider>
        <RouterProvider router={router} />
      </TodosProvider>
    </AuthProvider>
  );
}

function Layout() {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  if (navigation.state === "loading") {
    return <Spinner color="blue.500" size="xl" position={"fixed"} top={"50%"} left={"50%"} bottom={"50%"} right={"50%"} />;
  }

  return (
    <Flex flexDirection={"column"} minH={"100vh"} justifyContent={"space-between"}>
      {showModal && <ProfileModal setShowModal={setShowModal} showModal={showModal} />}
      <Header setShowModal={setShowModal} setShowOptions={setShowOptions} showOptions={showOptions} />
      <Outlet />
      <Flex as="footer" justifyContent={"center"} alignItems={"center"} p={4} borderTop={"1px solid black"}>
        © 2024 CWC Todo App. All rights reserved.
      </Flex>
    </Flex>
  );
}

export default App;
