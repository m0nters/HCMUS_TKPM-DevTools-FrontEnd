import {
  ChartBarIcon,
  PuzzlePieceIcon,
  SparklesIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

function AdminSidePanel() {
  const navItems = [
    {
      icon: <ChartBarIcon className="w-5 h-5" />,
      label: "Overview",
      to: "overview",
    },
    {
      icon: <UsersIcon className="w-5 h-5" />,
      label: "User Management",
      to: "users",
    },
    {
      icon: <SparklesIcon className="w-5 h-5" />,
      label: "Premium Requests",
      to: "premium-requests",
    },
    {
      icon: <PuzzlePieceIcon className="w-5 h-5" />,
      label: "Tool Upload",
      to: "upload",
    },
  ];

  return (
    <aside className="bg-white border-r border-gray-200 w-full md:w-64 md:min-h-[calc(100vh-74px)] p-4">
      <h2 className="font-bold text-lg mb-6 text-gray-800">Admin Dashboard</h2>
      <nav className="space-y-1">
        {navItems.map(({ icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
                flex items-center px-3 py-2 text-sm font-medium rounded-md gap-2 hover:gap-4 transition-all ease-in-out duration-200
                ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidePanel;
