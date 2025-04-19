import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/";
import {
  LoadingSpinner,
  PremiumBadge,
  BackLink,
  Button,
  AlertMessage,
} from "../components/common";
import DynamicPluginUI from "../components/plugins/DynamicPluginUI";
import {
  LockClosedIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { getPluginSchema, getAllPlugins } from "../services/plugins/";
import { Plugin, PluginSchema } from "../types/";
import { estimateReadingTime, slugify } from "../utils/";

function PluginDetails() {
  const { pluginName } = useParams<{ pluginName: string }>();
  const { isAuth, isPremium } = useAuth();
  const [pluginSchemaData, setPluginSchemaData] = useState<PluginSchema | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "premium" | null;
    message?: string;
  } | null>(null);
  const [targetPlugin, setTargetPlugin] = useState<Plugin | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch plugin schema details based on the plugin name from the URL
  useEffect(() => {
    async function fetchPluginDetails() {
      try {
        setIsLoading(true);

        // First, get all plugins to find the ID from the name
        const plugins = await getAllPlugins();
        const matchedPlugin = plugins.find(
          (p) => pluginName === slugify(p.name)
        );

        if (!matchedPlugin) {
          setStatusMessage({
            type: "error",
            message: "Plugin not found",
          });
          setIsLoading(false);
          return;
        }

        setTargetPlugin(matchedPlugin);
        // Now fetch the detailed schema using the ID
        const fetchedSchemaData = await getPluginSchema(matchedPlugin.id);
        console.log("Fetched schema data:", fetchedSchemaData);
        setPluginSchemaData(fetchedSchemaData);

        // Check premium access
        if (matchedPlugin.isPremium && !isPremium) {
          setStatusMessage({
            type: "premium",
          });
        }
      } catch (err) {
        console.error("Error loading plugin:", err);
        setStatusMessage({
          type: "error",
          message: "Failed to load plugin details.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchPluginDetails();
  }, []);

  const handleLoginClick = () => {
    navigate("/login", {
      state: {
        from: location,
        message: "Please log in to access this premium feature.",
      },
    });
  };

  // truyền cái `from` này vào cái `from` của bên Register
  // khi nó gửi sang Login, như vậy sau khi bấm vào tạo tài khoản
  // và đăng nhập thành công, nó sẽ tự động chuyển về cái plugin này
  const handleRegisterClick = () => {
    navigate("/register", {
      state: { from: location },
    });
  };

  const handlePluginSuccess = (result: any) => {
    /* Normally, this will be commented out since I've realized
            for every change happens and the success message shows up
            will be very annoying, uncomment to debug if you want */
    // setStatusNotification({
    //   type: "success",
    //   message: "Operation completed successfully!",
    // });
  };

  const handlePluginError = (error: Error) => {
    setStatusMessage({
      type: "error",
      message: error.message,
    });
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto pt-24 px-6 pb-12">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // Premium content locked
  const premiumContentLocked = () => {
    return (
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
          <div className="flex flex-col items-center">
            <Button
              onClick={handleLoginClick}
              className="w-fit"
              variant="primary"
              size="md"
            >
              Login
            </Button>
            <p className="text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <button
                onClick={handleRegisterClick}
                className="text-black hover:underline cursor-pointer"
              >
                Register now
              </button>
            </p>
          </div>
        ) : (
          <Button to="/premium" variant="primary" size="md">
            Premium
          </Button>
        )}
      </div>
    );
  };

  // Render plugin UI
  const pluginUI = () => {
    return (
      <>
        {statusMessage && statusMessage.type !== "premium" && (
          <AlertMessage
            message={statusMessage.message!}
            isError={statusMessage.type !== "success"}
            duration={estimateReadingTime(statusMessage.message!)}
            onDismiss={() => setStatusMessage({ type: null, message: "" })}
            position="top-center"
          />
        )}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <DynamicPluginUI
            schema={pluginSchemaData!}
            onSuccess={handlePluginSuccess}
            onError={handlePluginError}
          />
        </div>
      </>
    );
  };

  const notAvailableContent = () => {
    return (
      <>
        <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <WrenchScrewdriverIcon className="w-10 h-10 text-gray-400" />
          </div>

          <h2 className="text-2xl font-semibold mb-2">
            This Tool Is Currently Unavailable
          </h2>

          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We're sorry, but this tool is not available at the moment. Our team
            is working on it and it should be back online soon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/explore"
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
            >
              Browse Other Tools
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="w-full mx-auto pt-24 max-w-5xl pb-12">
      <div className="mb-6">
        <BackLink to="/explore" label="Back to all tools" className="mb-6" />

        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{targetPlugin?.name}</h1>
            {targetPlugin?.isPremium && <PremiumBadge size="md" />}
          </div>
          <p className="text-gray-500 mb-6">{targetPlugin?.description}</p>
        </div>
      </div>

      {statusMessage && statusMessage.type === "premium" && !isPremium
        ? premiumContentLocked()
        : pluginSchemaData
        ? pluginUI()
        : notAvailableContent()}
    </div>
  );
}

export default PluginDetails;
