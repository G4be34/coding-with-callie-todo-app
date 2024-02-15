import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  setToken: React.Dispatch<React.SetStateAction<string>>
  loginUser: (email: string, password: string) => void
  logoutUser: () => void
  badLogin: boolean
  user: UserType | object
  setUser: React.Dispatch<React.SetStateAction<UserType | object>>
  loading: boolean
  expiration: number
  setBadLogin: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AuthProvider ({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [expiration, setExpiration] = useState(0);
  const [badLogin, setBadLogin] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

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

      const photoResponse = await axios.post('/api/image/s3_download', { user_id: timeResponse.data.sub }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const photo = photoResponse.data;
      const photoBase64 = `data:image/png;base64,${photo}`;

      setUser({_id: timeResponse.data.sub, ...userResponse.data, photo: photoBase64});

      setToken(token);

      setExpiration(expirationDate * 1000);

      setLoading(false);

      const origin = location.state?.from?.pathname || '/';
      navigate(origin);

      toast({
        title: `Welcome ${userResponse.data.username}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } catch (error) {
      console.log("Error logging in: ",error);
      setBadLogin(true);
    }
  }

  const logoutUser = () => {
    localStorage.removeItem('token');
    setExpiration(0);
    setToken('');
    setUser({});
    toast({
      title: 'Logged out',
      description: "Successfully logged out",
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top'
    })
  }

  const value = {
    token,
    setToken,
    loginUser,
    logoutUser,
    badLogin,
    user,
    setUser,
    loading,
    expiration,
    setBadLogin
  }


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const { access_token, expiration_date } = JSON.parse(token);
      if (Date.now() < expiration_date) {
        const fetchData = async () => {
          try {
            const timeResponse = await axios.get(`/api/auth/profile`, {
              headers: {
                Authorization: `Bearer ${access_token}`
              }
            });

            const userResponse = await axios.get(`/api/users/${timeResponse.data.sub}`, {
              headers: {
                Authorization: `Bearer ${access_token}`
              }
            });

            const photoResponse = await axios.post('/api/image/s3_download', { user_id: timeResponse.data.sub }, {
              headers: {
                Authorization: `Bearer ${access_token}`
              }
            });
            const photo = photoResponse.data;
            const photoBase64 = `data:image/png;base64,${photo}`;

            setUser({_id: timeResponse.data.sub, ...userResponse.data, photo: photoBase64});
            setToken(access_token);
            setExpiration(expiration_date);
            setLoading(false);
            navigate('/');
          } catch (error) {
            console.error("Error fetching user details:", error);
            logoutUser();
            setLoading(false);
          }
        };

        fetchData();
      } else {
        logoutUser();
        setLoading(false);
      }
    } else {
      setLoading(false);
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