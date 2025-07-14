import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AdminSidePanel } from "../../components";

/**
 * Admin Dashboard Layout
 * Provides navigation and layout structure for all admin pages
 */
export function AdminDashboard() {
  const location = useLocation();

  // Check if we're at the root admin path and redirect to overview
  if (location.pathname === "/admin") {
    return <Navigate to="/admin/overview" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-74px)] w-full">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <AdminSidePanel />

        {/* Main content */}
        <main className="flex-1 bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
