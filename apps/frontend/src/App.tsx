import { Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { ForgotPassword } from './auth/forgot-password-page/ForgotPassword';
import { LoginPage } from './auth/login-page/LoginPage';
import { SignUpPage } from './auth/signup-page/SignUpPage';
import { CalendarPage } from './calendar-page/CalendarPage';
import { Header } from './components/Header';
import { GraphsPage } from './graphs-page/GraphsPage';
import { ProfilePage } from './profile-page/ProfilePage';
import { TodosPage } from './todos-page/TodosPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <Flex flexDirection={"column"} minH={"100vh"} justifyContent={"space-between"}>
      { isLoggedIn ?
        <>
          <Header />
          <Routes>
            <Route path="/" element={<TodosPage />}/>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/data" element={<GraphsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
          <Flex as="footer" justifyContent={"center"} alignItems={"center"} p={4} borderTop={"1px solid black"}>
            © 2024 Your Website Name. All rights reserved.
          </Flex>
        </>
        :
        <Routes>
          <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      }
    </Flex>
  )
}

export default App
