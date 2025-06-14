import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks";
import { LoadingSpinner } from "../common";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAuth?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requiredAuth = true,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isAuth, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Check if auth is required but user is not authenticated
  if (requiredAuth && !isAuth) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: "You need to login to use this functionality.",
          isError: true,
        }}
        replace
      />
    );
  }

  // Check if admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/401" replace />;
  }

  return children;
}
