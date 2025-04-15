import { Outlet, NavLink, useLocation, Navigate } from "react-router-dom";
import {
  UsersIcon,
  PuzzlePieceIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";

/**
 * Admin Dashboard Layout
 * Provides navigation and layout structure for all admin pages
 */
function AdminDashboard() {
  const { isAdmin } = useAuth();
  const location = useLocation();

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Check if we're at the root admin path and redirect to overview
  if (location.pathname === "/admin") {
    return <Navigate to="/admin/overview" replace />;
  }

  return (
    <div className="w-full min-h-[calc(100vh-74px)]">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="bg-white border-r border-gray-200 w-full md:w-64 md:min-h-[calc(100vh-74px)] p-4">
          <h2 className="font-bold text-lg mb-6 text-gray-800">
            Admin Dashboard
          </h2>
          <nav className="space-y-1">
            <NavItem
              to="overview"
              icon={<ChartBarIcon className="w-5 h-5" />}
              label="Overview"
            />
            <NavItem
              to="users"
              icon={<UsersIcon className="w-5 h-5" />}
              label="User Management"
            />
            <NavItem
              to="upload"
              icon={<PuzzlePieceIcon className="w-5 h-5" />}
              label="Tool Upload"
            />
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Navigation item component
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ to, icon, label }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === `/admin/${to}`;
  return (
    <NavLink
      to={to}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
}

export default AdminDashboard;
