import {
  LockClosedIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AlertMessage,
  BackLink,
  Button,
  LoadingSpinner,
  PremiumBadge,
} from "../components/common";
import { DynamicPluginUI } from "../components/plugins/DynamicPluginUI";
import { useAuth } from "../hooks/";
import { getAllPlugins, getPluginSchema } from "../services/plugins/";
import { Plugin, PluginSchema } from "../types/";
import { estimateReadingTime, slugify } from "../utils/";

export function PluginDetails() {
  const { pluginName } = useParams<{ pluginName: string }>();
  const { isAuth, isPremium } = useAuth();
  const [pluginSchemaData, setPluginSchemaData] = useState<PluginSchema | null>(
    null,
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
          (p) => pluginName === slugify(p.name),
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
    return <LoadingSpinner size="lg" />;
  }

  // Premium content locked
  const premiumContentLocked = () => {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <LockClosedIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold">Premium Feature</h2>
        <p className="mx-auto mb-6 max-w-md text-gray-600">
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
            <p className="mt-6 text-sm text-gray-500">
              Don't have an account?{" "}
              <button
                onClick={handleRegisterClick}
                className="cursor-pointer text-black hover:underline"
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
        <div className="rounded-lg border border-gray-200 bg-white p-6">
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
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <WrenchScrewdriverIcon className="h-10 w-10 text-gray-400" />
          </div>

          <h2 className="mb-2 text-2xl font-semibold">
            This Tool Is Currently Unavailable
          </h2>

          <p className="mx-auto mb-6 max-w-md text-gray-600">
            We're sorry, but this tool is not available at the moment. Our team
            is working on it and it should be back online soon.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/explore"
              className="rounded-md bg-gray-100 px-6 py-3 text-gray-800 transition-colors hover:bg-gray-200"
            >
              Browse Other Tools
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="mx-auto w-full max-w-5xl pt-24 pb-12">
      <div className="mb-6">
        <BackLink to="/explore" label="Back to all tools" className="mb-6" />

        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold">{targetPlugin?.name}</h1>
            {targetPlugin?.isPremium && <PremiumBadge size="md" />}
          </div>
          <p className="mb-6 text-gray-500">{targetPlugin?.description}</p>
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
