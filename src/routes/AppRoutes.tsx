import React from "react";
import { Routes } from "react-router-dom";
import { ProtectedRoutes } from "./protected/";
import { PublicRoutes } from "./public/";
import { UnauthenticatedRoutes } from "./unauthenticated/";

/**
 * Main routes component that combines all route groups
 * - Public routes: accessible by everyone
 * - Private routes: require authentication
 * - Unauthenticated routes: only accessible when not logged in
 */
export const AppRoutes = () => {
  // Add a prefix to each route's key to ensure global uniqueness
  const prefixKeys = (routes: React.JSX.Element[], prefix: string) => {
    return routes.map((route) => {
      // Clone the route with a new key that includes the prefix
      return {
        ...route,
        key: `${prefix}-${
          route.key || Math.random().toString(36).substring(7)
        }`,
      };
    });
  };

  return (
    <Routes>
      {/* Public routes - accessible to all users */}
      {prefixKeys(PublicRoutes, "public")}

      {/* Protected routes - require authentication */}
      {prefixKeys(ProtectedRoutes, "protected")}

      {/* Routes accessible only when not logged in */}
      {prefixKeys(UnauthenticatedRoutes, "unauth")}
    </Routes>
  );
};
