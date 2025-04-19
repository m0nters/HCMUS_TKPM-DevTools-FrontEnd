import { LoadingSpinner } from "../../../components/common";
import { UserProfile } from "../../../types/";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface PremiumRequestsTableProps {
  requests: UserProfile[];
  filteredRequests: UserProfile[];
  isLoading: boolean;
  processingId: string | null;
  onApprove: (user: UserProfile) => void;
  onReject: (user: UserProfile) => void;
}

function PremiumRequestsTable({
  requests,
  filteredRequests,
  isLoading,
  processingId,
  onApprove,
  onReject,
}: PremiumRequestsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (filteredRequests.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500 mb-4">
          No pending premium upgrade requests.
        </p>
        <p className="text-gray-400 text-sm">
          When users submit premium upgrade requests, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-x-auto">
      <div className="px-6 py-4 border-b border-gray-200">
        <p className="text-sm text-gray-700">
          <span className="font-medium">{filteredRequests.length}</span> pending
          {filteredRequests.length === 1 ? " request" : " requests"}
          {requests.length !== filteredRequests.length && (
            <>
              {" "}
              (filtered from{" "}
              <span className="font-medium">{requests.length}</span>)
            </>
          )}
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
          {filteredRequests.map((user, index) => (
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
                    onClick={() => onApprove(user)}
                    disabled={processingId === user.id}
                    className={`p-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-colors ${
                      processingId === user.id
                        ? "opacity-50 cursor-wait"
                        : "cursor-pointer"
                    }`}
                    title="Approve premium request"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onReject(user)}
                    disabled={processingId === user.id}
                    className={`p-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors ${
                      processingId === user.id
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
  );
}

export default PremiumRequestsTable;
