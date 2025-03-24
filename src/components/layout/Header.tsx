import { Link } from "react-router-dom";
import SidePanel from "./SidePanel";
import { useState, useEffect } from "react";

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
      <header className="fixed top-0 w-full z-50">
        <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center">
            <button
              onClick={() => setIsPanelOpen(true)}
              className="mr-4 hover:bg-gray-100 p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
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
