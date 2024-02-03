import { Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { ForgotPassword } from './auth/forgot-password-page/ForgotPassword';
import { LoginPage } from './auth/login-page/LoginPage';
import { SignUpPage } from './auth/signup-page/SignUpPage';
import { CalendarPage } from './calendar-page/CalendarPage';
import { Header } from './components/Header';
import { ProfileModal } from './components/ProfileModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthProvider';
import { GraphsPage } from './graphs-page/GraphsPage';
import { ProfilePage } from './profile-page/ProfilePage';
import { TodosPage } from './todos-page/TodosPage';

function App() {
  const { token } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  return (
    <Flex flexDirection={"column"} minH={"100vh"} justifyContent={"space-between"}>
      {showModal ? <ProfileModal setShowModal={setShowModal} showModal={showModal} /> : null}
      {token ? <Header setShowModal={setShowModal} setShowOptions={setShowOptions} showOptions={showOptions} /> : null}
      <Routes>
        <Route path="/" element={<ProtectedRoute><TodosPage /></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/data" element={<ProtectedRoute><GraphsPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      {token ?
        <Flex as="footer" justifyContent={"center"} alignItems={"center"} p={4} borderTop={"1px solid black"}>
          © 2024 CWC Todo App. All rights reserved.
        </Flex> : null
      }
    </Flex>
  )
}

export default App
