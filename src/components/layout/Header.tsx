import { Link } from "react-router-dom";
import { SidePanel } from "./SidePanel";
import React, { useState, useEffect } from "react";
import {
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
  ShieldCheckIcon,
  SparklesIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/";

export function Header() {
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
        <div className="border-b border-gray-100 px-4 py-2">
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
      icon: <UserCircleIcon className="mr-2 h-4 w-4" />,
      alwaysShow: true,
    },
    {
      type: "link",
      label: "Admin Dashboard",
      to: "/admin",
      icon: <ShieldCheckIcon className="mr-2 h-4 w-4" />,
      showIf: () => user?.role === "Admin",
    },
    {
      type: "link",
      label: "Upgrade to Premium",
      to: "/premium",
      icon: <SparklesIcon className="mr-2 h-4 w-4" />,
      showIf: () => !isPremium,
    },
    {
      type: "divider",
      alwaysShow: true,
    },
    {
      type: "button",
      label: "Logout",
      icon: <ArrowLeftEndOnRectangleIcon className="mr-2 h-4 w-4" />,
      onClick: () => {
        logout();
        setIsUserMenuOpen(false);
      },
      alwaysShow: true,
    },
  ];

  return (
    <>
      <header className="fixed top-0 z-5 w-full">
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => setIsPanelOpen(true)}
              className="mr-4 cursor-pointer rounded-md p-1 transition-colors hover:bg-gray-100"
              aria-label="Menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <Link
              to="/"
              className="text-xl font-bold text-black transition-colors select-none hover:text-gray-700"
            >
              <span className="mr-1 bg-black px-2 py-1 text-white">IT</span>
              Tools
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuth ? (
              <div className="relative" id="user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 transition-all duration-200 ease-in-out hover:gap-4 hover:bg-gray-100"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <span className="hidden md:block">
                    {user?.fullName || user?.userName}
                  </span>
                </button>

                {/* Dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
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
                              className="flex items-center gap-1 px-4 py-2 text-sm text-gray-700 transition-all duration-200 ease-in-out hover:gap-2 hover:bg-gray-100"
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
                              className="flex w-full cursor-pointer items-center gap-1 px-4 py-2 text-left text-sm text-gray-700 transition-all duration-200 ease-in-out hover:gap-2 hover:bg-gray-100"
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
                  className="rounded-md border border-black px-4 py-2 text-black transition-all duration-200 hover:bg-black hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
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
