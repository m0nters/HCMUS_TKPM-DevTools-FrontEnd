import { Link } from "react-router-dom";
import SidePanel from "./SidePanel";
import { useState, useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

function Header() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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
          </div>
        </div>
      </header>

      <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
}

export default Header;
