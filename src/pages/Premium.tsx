import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon as SparklesSolid } from "@heroicons/react/24/solid";
import { useState } from "react";
import { AlertMessage, Button } from "../components/";
import { useAuth } from "../hooks";
import { requestPremiumUpgrade } from "../services/";
import { estimateReadingTime } from "../utils";

export function Premium() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestStatus, setRequestStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);
  const { isPremium, user } = useAuth();

  const handleUpgradeRequest = async () => {
    setIsSubmitting(true);
    setRequestStatus(null);

    try {
      const response = await requestPremiumUpgrade();

      if (response.success) {
        setRequestStatus({
          isError: false,
          message:
            "Your premium upgrade request has been submitted successfully! Our team will review it shortly.",
        });
      } else {
        setRequestStatus({
          isError: true,
          message:
            response.message || "Something went wrong. Please try again later.",
        });
      }
    } catch (error: any) {
      setRequestStatus({
        isError: true,
        message:
          error.message ||
          "Failed to submit upgrade request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      title: "Exclusive Tools Access",
      description:
        "Get access to our specialized premium-only tools designed for advanced IT professionals.",
      icon: ShieldCheckIcon,
    },
    {
      title: "Enhanced Functionality",
      description:
        "Premium tools offer extended capabilities, larger processing limits and more customization options.",
      icon: CloudArrowUpIcon,
    },
    {
      title: "Priority Support",
      description:
        "Get faster responses and dedicated assistance with your premium account.",
      icon: ClockIcon,
    },
  ];

  // Feature comparison data
  const featureComparison = [
    { name: "Access to basic tools", free: true, premium: true },
    { name: "Save favorite tools", free: true, premium: true },
    { name: "Access to premium tools", free: false, premium: true },
    { name: "Priority support", free: false, premium: true },
    { name: "Ad-free experience", free: false, premium: true },
  ];

  return (
    <>
      <article>
        <title>Premium | IT Tools</title>
        <meta
          name="description"
          content="Upgrade to IT Tools Premium to access exclusive tools and features"
        />
      </article>

      <div className="mx-auto w-full max-w-6xl px-6 pt-20 pb-16">
        {/* Hero section */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-purple-100 p-3">
            <SparklesSolid className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="mb-4 text-4xl font-bold">
            Upgrade to{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Premium
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Unlock powerful premium tools and features to enhance your
            productivity
          </p>
        </div>

        {/* Status messages */}
        {requestStatus && (
          <div className="mb-8">
            <AlertMessage
              message={requestStatus.message}
              isError={requestStatus.isError}
              duration={estimateReadingTime(requestStatus.message)}
              onDismiss={() => setRequestStatus(null)}
              position="top-center"
            />
          </div>
        )}

        {/* Main content with two columns layout */}
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Benefits column */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Premium Benefits</h2>
            <div className="space-y-6">
              {benefits.map((benefit) => {
                return (
                  <div className="flex gap-4">
                    <div className="h-fit rounded-lg bg-purple-100 p-2">
                      <benefit.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-medium">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comparison table */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Feature Comparison</h2>
            <div className="overflow-hidden rounded-lg border">
              <div className="grid grid-cols-3 bg-gray-50 p-4 font-medium">
                <div>Feature</div>
                <div className="text-center">Free</div>
                <div className="text-center">
                  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Premium
                  </span>
                </div>
              </div>

              <div className="border-b"></div>

              {featureComparison.map((feature, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 p-4 ${
                    index < featureComparison.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div>{feature.name}</div>
                  <div className="flex justify-center">
                    {feature.free ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XMarkIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex justify-center">
                    <CheckCircleIcon className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-100 to-purple-100 p-8 text-center">
          <h2 className="mb-2 text-2xl font-semibold">
            {isPremium ? (
              <>
                You are already{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Premium
                </span>
                !
              </>
            ) : (
              "Ready to upgrade?"
            )}
          </h2>
          {!isPremium && (
            <p className="mx-auto mb-6 max-w-lg text-gray-700">
              Submit your request for a premium account and get access to all
              our premium tools and features.
            </p>
          )}

          {!isPremium && (
            <div className="flex justify-center">
              <Button
                onClick={handleUpgradeRequest}
                disabled={isSubmitting || isPremium}
                variant="primary"
                size="lg"
              >
                <div className="flex items-center gap-2">
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <div className="flex items-center justify-center gap-2 transition-all duration-50 group-hover:gap-4">
                      <span>Request Premium Upgrade</span>
                      <ArrowRightIcon className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </Button>
            </div>
          )}

          {isPremium && (
            <div className="text-sm text-gray-600">
              Your account: <span className="font-semibold">{user?.email}</span>{" "}
              is already{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Premium
              </span>
              . Enjoy your exclusive features!
            </div>
          )}
        </div>
      </div>
    </>
  );
}
