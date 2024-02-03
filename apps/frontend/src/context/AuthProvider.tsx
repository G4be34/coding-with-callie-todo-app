import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode
}

type UserType = {
  username: string
  email: string
  photo: string
  theme: string
  font: string
  _id: number
  password: string
}

type AuthContextType = {
  token: string
  loginUser: (email: string, password: string) => void
  logoutUser: () => void
  badLogin: boolean
  user: UserType | object
  setUser: React.Dispatch<React.SetStateAction<UserType | object>>
}

export default function AuthProvider ({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [badLogin, setBadLogin] = useState(false);
  const [user, setUser] = useState({});

  const loginUser = async (email: string, password: string) => {
    try {
      const authResponse = await axios.post('/api/auth/login', { email, password });

      setBadLogin(false);

      const token = authResponse.data.access_token;

      const timeResponse = await axios.get(`/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const expirationDate = timeResponse.data.exp;

      const tokenObj = {
        access_token: token,
        expiration_date: expirationDate * 1000
      }

      localStorage.setItem('token', JSON.stringify(tokenObj));

      const userResponse = await axios.get(`/api/users/${timeResponse.data.sub}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser({_id: timeResponse.data.sub, ...userResponse.data});

      setToken(token);

      navigate('/');
    } catch (error) {
      console.log("Error logging in: ",error);
      setBadLogin(true);
    }
  }

  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken('');
  }

  const value = {
    token,
    loginUser,
    logoutUser,
    badLogin,
    user,
    setUser
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const { access_token } = JSON.parse(token);
      setToken(access_token);
    }
  }, [])

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