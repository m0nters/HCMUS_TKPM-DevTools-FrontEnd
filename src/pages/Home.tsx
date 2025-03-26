import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllCategories } from "../services/plugins/categories";
import { Plugin } from "../types/plugins";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PluginCard from "../components/common/PluginCard";
import Button from "../components/common/Button";

function Home() {
  const [featuredPlugins, setFeaturedPlugins] = useState<Plugin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getAllCategories();

        // Get 4 plugins to feature
        const featured = categoriesData
          .flatMap((category) => category.plugins)
          .slice(0, 4);

        setFeaturedPlugins(featured);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <article>
        <title>Home | IT Tools</title>
        <meta
          name="description"
          content="A collection of essential utilities designed for developers to optimize daily tasks and enhance productivity"
        />
      </article>
      <div className="w-full mx-auto pt-24 px-6 pb-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16 mt-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Developer Tools That{" "}
            <span className="bg-black text-white px-2">Simplify</span> Your
            Workflow
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-10">
            A collection of essential utilities designed for developers to
            optimize daily tasks and enhance productivity
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button to="/explore" variant="secondary" size="lg">
              Explore All Tools
            </Button>
            <Button to="/register" variant="secondary" size="lg">
              Create Account
            </Button>
          </div>
        </div>

        {/* Featured Tools Section */}
        <div className="mt-24 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Tools
          </h2>

          {isLoading ? (
            LoadingSpinner({ size: "large" })
          ) : featuredPlugins.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 text-center">
              <SparklesIcon className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Featured Tools Yet
              </h3>
              <p className="text-gray-500 max-w-md">
                We're preparing some amazing developer tools for you. Check back
                soon or explore our categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {featuredPlugins.map((plugin) => PluginCard({ plugin }))}
            </div>
          )}

          <div className="flex justify-center mt-10">
            <Link
              to="/explore"
              className="flex items-center text-black hover:text-gray-700 font-medium gap-2 hover:gap-4 transition-all ease-in-out duration-200"
            >
              View All Tools By Categories
              <ArrowRightIcon className="w-8 h-8" />
            </Link>
          </div>
        </div>

        {/* How it works Section */}
        <div className="mt-24 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-7 text-center">How It Works</h2>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-medium mb-2">Choose a Tool</h3>
                <p className="text-gray-600">
                  Browse our collection of developer utilities and select the
                  one you need
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-medium mb-2">Input Your Data</h3>
                <p className="text-gray-600">
                  Enter the information you want to process using our simple
                  interface
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Get Results Instantly
                </h3>
                <p className="text-gray-600">
                  Receive your processed data immediately, ready to use in your
                  projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
