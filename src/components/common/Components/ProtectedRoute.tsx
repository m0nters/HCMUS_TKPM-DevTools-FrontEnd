import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

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
  const { isAuth, isAdmin, isPremium } = useAuth();
  const location = useLocation();

  // Check if auth is required but user is not authenticated
  if (requiredAuth && !isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Check if premium access is required but user doesn't have premium
  if (requirePremium && !isPremium) {
    return <Navigate to="/premium" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
