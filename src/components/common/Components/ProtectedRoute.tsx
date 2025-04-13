import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAuth?: boolean;
  requireAdmin?: boolean;
  requirePremium?: boolean;
}

const ProtectedRoute = ({
  children,
  requiredAuth = true,
  requireAdmin = false,
  requirePremium = false,
}: ProtectedRouteProps) => {
  const { isAuth, isAdmin, isPremium, isLoading } = useAuth();
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

  // Check if premium access is required but user doesn't have premium
  if (requirePremium && !isPremium) {
    return <Navigate to="/premium" replace />;
  }

  return children;
};

export default ProtectedRoute;
