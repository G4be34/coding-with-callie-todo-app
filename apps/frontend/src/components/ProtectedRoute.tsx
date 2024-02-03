import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode}) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const expiration = JSON.parse(token).expiration_date;

  if (expiration < Date.now()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}