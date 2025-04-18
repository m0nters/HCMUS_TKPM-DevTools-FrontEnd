import { Link } from "react-router-dom";
import SidePanel from "./SidePanel";
import React, { useState, useEffect } from "react";
import {
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
  ShieldCheckIcon,
  SparklesIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/";

function Header() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuth, isPremium, logout } = useAuth();

  // press Escape key => close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPanelOpen) {
        setIsPanelOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPanelOpen]);

  // Handle clicks outside the user menu
  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#user-menu")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isUserMenuOpen]);

  const menuItems = [
    {
      type: "header",
      content: () => (
        <div className="px-4 py-2 border-b border-gray-100">
          <p className="text-sm font-medium">{user?.fullName}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <p className="text-xs font-bold">{user?.role}</p>
        </div>
      ),
      alwaysShow: true,
    },
    {
      type: "link",
      label: "Profile",
      to: "/profile",
      icon: <UserCircleIcon className="w-4 h-4 mr-2" />,
      alwaysShow: true,
    },
    {
      type: "link",
      label: "Admin Dashboard",
      to: "/admin",
      icon: <ShieldCheckIcon className="w-4 h-4 mr-2" />,
      showIf: () => user?.role === "Admin",
    },
    {
      type: "link",
      label: "Upgrade to Premium",
      to: "/premium",
      icon: <SparklesIcon className="w-4 h-4 mr-2" />,
      showIf: () => !isPremium,
    },
    {
      type: "divider",
      alwaysShow: true,
    },
    {
      type: "button",
      label: "Logout",
      icon: <ArrowLeftEndOnRectangleIcon className="w-4 h-4 mr-2" />,
      onClick: () => {
        logout();
        setIsUserMenuOpen(false);
      },
      alwaysShow: true,
    },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-5">
        <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center">
            <button
              onClick={() => setIsPanelOpen(true)}
              className="mr-4 hover:bg-gray-100 p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <Link
              to="/"
              className="text-xl font-bold text-black hover:text-gray-700 transition-colors select-none"
            >
              <span className="bg-black text-white px-2 py-1 mr-1">IT</span>
              Tools
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuth ? (
              <div className="relative" id="user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 hover:gap-4 hover:bg-gray-100 px-3 py-2 rounded-md transition-all ease-in-out duration-200 cursor-pointer"
                >
                  <UserCircleIcon className="w-6 h-6" />
                  <span className="hidden md:block">
                    {user?.fullName || user?.userName}
                  </span>
                </button>

                {/* Dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    {menuItems.map((item, index) => {
                      // Check if the item should be shown
                      const shouldShow =
                        item.alwaysShow || (item.showIf && item.showIf());
                      if (!shouldShow) return null;

                      // Render based on item type
                      switch (item.type) {
                        case "header":
                          return (
                            <React.Fragment key={index}>
                              {item.content && item.content()}
                            </React.Fragment>
                          );

                        case "link":
                          return (
                            <Link
                              key={index}
                              to={item.to!}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-1 hover:gap-2 transition-all ease-in-out duration-200"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              {item.icon}
                              {item.label}
                            </Link>
                          );

                        case "button":
                          return (
                            <button
                              key={index}
                              onClick={item.onClick}
                              className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-1 hover:gap-2 transition-all ease-in-out duration-200 cursor-pointer"
                            >
                              {item.icon}
                              {item.label}
                            </button>
                          );

                        case "divider":
                          return (
                            <hr key={index} className="my-1 border-gray-200" />
                          );

                        default:
                          return null;
                      }
                    })}
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-all duration-200 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
}

export default Header;
