import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getPluginSchema } from "../services/plugins/schema";
import { PluginSchema } from "../types/pluginSchema";
import { LoadingSpinner, PremiumBadge } from "../components/common";
import DynamicPluginUI from "../components/plugins/dynamic-ui/DynamicPluginUI";
import { ArrowLeftIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { getAllPlugins } from "../services/plugins/plugins";

function PluginDetails() {
  const { pluginName } = useParams<{ pluginName: string }>();
  const { isAuth, isPremium } = useAuth();

  const [pluginSchemaData, setPluginSchemaData] = useState<PluginSchema | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    async function fetchPluginDetails() {
      try {
        setIsLoading(true);

        // First, get all plugins to find the ID from the name
        const plugins = await getAllPlugins();
        const matchedPlugin = plugins.find(
          (p) =>
            pluginName ===
            p.name
              .toLowerCase()
              .replace(/\s+/g, "-") // Replace spaces with dashes
              .replace(/[^\w-]+/g, "") // Remove special characters
              .replace(/--+/g, "-") // Replace multiple dashes with a single dash
              .trim()
        );

        if (!matchedPlugin) {
          setError("Plugin not found");
          setIsLoading(false);
          return;
        }

        // Now fetch the detailed schema using the ID
        const schema = await getPluginSchema(matchedPlugin.id);
        setPluginSchemaData(schema);

        // Check premium access
        if (schema.isPremium && !isPremium) {
          setError("premium");
        }
      } catch (err) {
        console.error("Error loading plugin:", err);
        setError("Failed to load plugin details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPluginDetails();
  }, []);

  const handlePluginSuccess = (result: any) => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handlePluginError = (error: Error) => {
    setError(error.message);
    setTimeout(
      () => setError(error.message === "premium" ? "premium" : null),
      5000
    );
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto pt-24 px-6 pb-12">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  // Render error state
  if (error && error !== "premium") {
    return (
      <div className="w-full max-w-4xl mx-auto pt-24 px-6 pb-12">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <p>{error}</p>
        </div>
        <Link
          to="/explore"
          className="flex items-center text-black hover:underline"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to all tools
        </Link>
      </div>
    );
  }

  // Premium content locked
  if (error === "premium" && pluginSchemaData) {
    return (
      <div className="w-full max-w-4xl mx-auto pt-24 px-6 pb-12">
        <div className="mb-6">
          <Link
            to="/explore"
            className="flex items-center text-black hover:underline mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to all tools
          </Link>

          <h1 className="text-3xl font-bold mb-2">{pluginSchemaData?.name}</h1>
          <p className="text-gray-500 mb-6">{pluginSchemaData?.description}</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <LockClosedIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Premium Feature</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            This tool requires a premium account. Please upgrade to access this
            feature.
          </p>
          {!isAuth ? (
            <div className="space-y-2">
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Log In
              </Link>
              <p className="text-sm text-gray-500 mt-2">
                Don't have an account?{" "}
                <Link to="/register" className="text-black hover:underline">
                  Register now
                </Link>
              </p>
            </div>
          ) : (
            <Link
              to="/premium"
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Upgrade to Premium
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Render plugin UI
  if (pluginSchemaData) {
    return (
      <div className="w-full max-w-4xl mx-auto pt-24 px-6 pb-12">
        {showSuccessMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-50 border border-green-200 text-green-800 rounded-md p-4 shadow-md transition-opacity">
            Operation completed successfully!
          </div>
        )}

        <div className="mb-6">
          <Link
            to="/explore"
            className="flex items-center text-black hover:underline mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to all tools
          </Link>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{pluginSchemaData.name}</h1>
              {pluginSchemaData.isPremium && <PremiumBadge />}
            </div>
            <p className="text-gray-500 mb-6">{pluginSchemaData.description}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <DynamicPluginUI
            schema={pluginSchemaData}
            onSuccess={handlePluginSuccess}
            onError={handlePluginError}
          />
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}

export default PluginDetails;
