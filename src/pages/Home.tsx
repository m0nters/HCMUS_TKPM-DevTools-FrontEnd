import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllPlugins } from "../data/pluginsData";
import { Plugin } from "../types/plugins";

function Home() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllPlugins = async () => {
      setIsLoading(true);
      try {
        const result = await getAllPlugins();
        setPlugins(result);
      } catch (error) {
        console.error("Failed to load tools:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPlugins();
  }, []);

  return (
    <div className="w-full mx-auto pt-24 px-6 pb-12">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mb-16 mt-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Developer Tools That{" "}
          <span className="bg-black text-white">Simplify</span> Your Workflow
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-8">
          A collection of essential utilities designed for developers to
          optimize daily tasks and enhance productivity
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-xl relative">
          <input
            type="text"
            placeholder="Search for tools..."
            className="w-full py-3 px-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button className="absolute right-3 top-3 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>{" "}
        </div>
      </div>

      {/* Tools */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">All the tools</h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {plugins.map((plugin) => (
              <Link
                to={`/${plugin.name.toLowerCase().replace(/\s+/g, "-")}`}
                key={plugin.id}
                className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all duration-200 relative"
              >
                {plugin.isPremium && (
                  <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
                <span
                  className="w-12 h-12 mb-3 text-gray-800 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: plugin.icon || "" }}
                />
                <h3 className="font-medium text-center">{plugin.name}</h3>
                <p className="text-xs text-gray-500 mt-2 text-center line-clamp-2 max-w-full">
                  {plugin.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
