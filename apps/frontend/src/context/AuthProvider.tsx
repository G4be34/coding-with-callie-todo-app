import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode
}

type AuthContextType = {
  token: string
  loginUser: (email: string, password: string) => void
  logoutUser: () => void
}

export default function AuthProvider ({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      setToken(response.data.access_token);
      console.log("Response data: ", response.data.access_token);
      const origin = location.state?.from?.pathname || '/';
      navigate(origin);
    } catch (error) {
      console.log("Error logging in: ",error);
    }
  }

  const logoutUser = () => {
    setToken('');
    console.log("Logged out")
  }

  const value = {
    token,
    loginUser,
    logoutUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}