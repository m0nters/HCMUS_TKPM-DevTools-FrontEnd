import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/";

interface UnauthenticatedRouteProps {
  children: React.ReactNode;
}

/**
 * Redirects authenticated users away from pages they shouldn't access when logged in
 * (like login and register pages)
 */
const UnauthenticatedRoute = ({ children }: UnauthenticatedRouteProps) => {
  const { isAuth } = useAuth();
  const location = useLocation();

  // If user is authenticated, redirect them away
  if (isAuth) {
    return <Navigate to={location.state?.from || "/"} replace />;
  }

  // If not authenticated, show the children
  return <>{children}</>;
};

export default UnauthenticatedRoute;
