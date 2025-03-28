import { Navigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

interface UnauthenticatedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Redirects authenticated users away from pages they shouldn't access when logged in
 * (like login and register pages)
 */
const UnauthenticatedRoute = ({
  children,
  redirectTo = "/",
}: UnauthenticatedRouteProps) => {
  const { isAuth } = useAuth();

  // If user is authenticated, redirect them away
  if (isAuth) {
    return <Navigate to={redirectTo} replace />;
  }

  // If not authenticated, show the children
  return <>{children}</>;
};

export default UnauthenticatedRoute;
