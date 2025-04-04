import { Routes } from "react-router-dom";
import { PublicRoutes } from "./public";
import { ProtectedRoutes } from "./protected";
import { UnauthenticatedRoutes } from "./unauthenticated";

/**
 * Main routes component that combines all route groups
 * - Public routes: accessible by everyone
 * - Private routes: require authentication
 * - Unauthenticated routes: only accessible when not logged in
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes - accessible to all users */}
      {PublicRoutes}

      {/* Protected routes - require authentication */}
      {ProtectedRoutes}

      {/* Routes accessible only when not logged in */}
      {UnauthenticatedRoutes}
    </Routes>
  );
};

export default AppRoutes;
