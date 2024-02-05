import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export const ProtectedRoute = ({ children }: { children: React.ReactNode}) => {
  const { token, expiration } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (expiration < Date.now()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}