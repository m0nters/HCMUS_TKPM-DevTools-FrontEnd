import { useState, useEffect, useCallback } from "react";
import {
  getPremiumRequests,
  processPremiumRequest,
} from "../../services/admin/premiumService";
import { UserProfile } from "../../types/user";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { AlertMessage, Button, LoadingSpinner } from "../../components/common";
import { estimateReadingTime } from "../../utils/string";

function PremiumRequests() {
  const [requests, setRequests] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const fetchPremiumRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPremiumRequests();
      setRequests(data);
      setStatusMessage({ type: null, message: "" });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: "Failed to load premium requests. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPremiumRequests();
  }, []);

  const handleProcessRequest = async (
    user: UserProfile,
    isAccepted: boolean
  ) => {
    setIsProcessing(user.id);
    try {
      const response = await processPremiumRequest(user.id, isAccepted);

      if (response.success) {
        fetchPremiumRequests(); // Refresh the list after processing

        setStatusMessage({
          type: "success",
          message: `${
            isAccepted ? "Approved" : "Rejected"
          } premium request for ${user.fullName}`,
        });
      } else {
        setStatusMessage({
          type: "error",
          message:
            response.message || "Failed to process request. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      setStatusMessage({
        type: "error",
        message:
          "An error occurred while processing the request. Please try again.",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Premium Upgrade Requests
        </h1>
        <Button onClick={fetchPremiumRequests} variant="primary" size="sm">
          <div className="flex justify-center items-center gap-2">
            <ArrowPathIcon className="w-4 h-4" />
            <span>Refresh</span>
          </div>
        </Button>
      </div>

      {statusMessage.type && (
        <AlertMessage
          message={statusMessage.message}
          isError={statusMessage.type === "error"}
          duration={estimateReadingTime(statusMessage.message)}
          onDismiss={() => setStatusMessage({ type: null, message: "" })}
          position="top-center"
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">
            No pending premium upgrade requests.
          </p>
          <p className="text-gray-400 text-sm">
            When users submit premium upgrade requests, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <p className="text-sm text-gray-700">
              <span className="font-medium">{requests.length}</span> pending
              {requests.length === 1 ? " request" : " requests"}
            </p>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleProcessRequest(user, true)}
                        disabled={isProcessing === user.id}
                        className={`p-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-colors ${
                          isProcessing === user.id
                            ? "opacity-50 cursor-wait"
                            : "cursor-pointer"
                        }`}
                        title="Approve premium request"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleProcessRequest(user, false)}
                        disabled={isProcessing === user.id}
                        className={`p-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors ${
                          isProcessing === user.id
                            ? "opacity-50 cursor-wait"
                            : "cursor-pointer"
                        }`}
                        title="Reject premium request"
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PremiumRequests;
