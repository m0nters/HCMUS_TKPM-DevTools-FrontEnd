import {
  ChartBarIcon,
  PuzzlePieceIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

export function AdminSidePanel() {
  const navItems = [
    {
      icon: <ChartBarIcon className="h-5 w-5" />,
      label: "Overview",
      to: "overview",
    },
    {
      icon: <UsersIcon className="h-5 w-5" />,
      label: "User Management",
      to: "users",
    },
    {
      icon: <PuzzlePieceIcon className="h-5 w-5" />,
      label: "Tool Upload",
      to: "upload",
    },
  ];

  return (
    <aside className="w-full border-r border-gray-200 bg-white p-4 md:min-h-[calc(100vh-74px)] md:w-64">
      <h2 className="mb-6 text-lg font-bold text-gray-800">Admin Dashboard</h2>
      <nav className="space-y-1">
        {navItems.map(({ icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out hover:gap-4 ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } `
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
