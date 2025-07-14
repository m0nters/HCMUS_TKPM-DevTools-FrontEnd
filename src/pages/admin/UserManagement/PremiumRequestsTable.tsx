import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "../../../components/";
import { UserProfile } from "../../../types/";

interface PremiumRequestsTableProps {
  requests: UserProfile[];
  filteredRequests: UserProfile[];
  isLoading: boolean;
  processingId: string | null;
  onApprove: (user: UserProfile) => void;
  onReject: (user: UserProfile) => void;
}

export function PremiumRequestsTable({
  requests,
  filteredRequests,
  isLoading,
  processingId,
  onApprove,
  onReject,
}: PremiumRequestsTableProps) {
  if (isLoading) {
    return <LoadingSpinner size="lg" className="py-24" />;
  }

  if (filteredRequests.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="mb-4 text-gray-500">
          No pending premium upgrade requests.
        </p>
        <p className="text-sm text-gray-400">
          When users submit premium upgrade requests, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
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
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              STT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Current Role
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
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
              <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onApprove(user)}
                    disabled={processingId === user.id}
                    className={`rounded-md bg-green-100 p-2 text-green-700 transition-colors hover:bg-green-200 ${
                      processingId === user.id
                        ? "cursor-wait opacity-50"
                        : "cursor-pointer"
                    }`}
                    title="Approve premium request"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onReject(user)}
                    disabled={processingId === user.id}
                    className={`rounded-md bg-red-100 p-2 text-red-700 transition-colors hover:bg-red-200 ${
                      processingId === user.id
                        ? "cursor-wait opacity-50"
                        : "cursor-pointer"
                    }`}
                    title="Reject premium request"
                  >
                    <XCircleIcon className="h-5 w-5" />
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
