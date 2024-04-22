import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export const ProtectedRoute = ({ children }: { children: React.ReactNode}) => {
  const { token, expiration, setToken } = useAuth();
  const location = useLocation();

  if (!token || expiration < Date.now()) {
    setToken('');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}