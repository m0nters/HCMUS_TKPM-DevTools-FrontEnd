import { Outlet, useLocation, Navigate } from "react-router-dom";
import { AdminSidePanel } from "../../components/admin";

/**
 * Admin Dashboard Layout
 * Provides navigation and layout structure for all admin pages
 */
function AdminDashboard() {
  const location = useLocation();

  // Check if we're at the root admin path and redirect to overview
  if (location.pathname === "/admin") {
    return <Navigate to="/admin/overview" replace />;
  }

  return (
    <div className="w-full min-h-[calc(100vh-74px)]">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <AdminSidePanel />

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
