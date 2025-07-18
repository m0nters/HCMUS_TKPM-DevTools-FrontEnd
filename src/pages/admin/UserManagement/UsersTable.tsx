import { TrashIcon } from "@heroicons/react/24/outline";
import { DropdownMenu, LoadingSpinner } from "../../../components";
import { ROLES, UserProfile, UserRole } from "../../../types/";

interface UsersTableProps {
  users: UserProfile[];
  filteredUsers: UserProfile[];
  isLoading: boolean;
  currentUserEmail?: string;
  onRoleChange: (user: UserProfile, role: UserRole) => void;
  onDeleteClick: (user: UserProfile) => void;
}

export function UsersTable({
  users,
  filteredUsers,
  isLoading,
  currentUserEmail,
  onRoleChange,
  onDeleteClick,
}: UsersTableProps) {
  if (isLoading) {
    return <LoadingSpinner size="lg" className="py-24" />;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <p className="text-sm text-gray-700">
          Total users:{" "}
          <span className="font-medium">{filteredUsers.length}</span>
          {users.length !== filteredUsers.length && (
            <>
              {" "}
              (filtered from <span className="font-medium">{users.length}</span>
              )
            </>
          )}
        </p>
      </div>

      <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
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
              Role
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
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
                  <div className="w-32">
                    <DropdownMenu
                      options={ROLES.map((role) => ({
                        value: role,
                        label: role,
                      }))}
                      selectedValue={user.role}
                      onSelect={(value) =>
                        onRoleChange(user, value as UserRole)
                      }
                      disabled={currentUserEmail === user.email}
                      searchable={false}
                      buttonClassName={"text-sm"}
                      optionsClassName={"text-sm"}
                      allowClear={false}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                  <button
                    onClick={() => onDeleteClick(user)}
                    disabled={currentUserEmail === user.email}
                    className={`text-red-500 hover:text-red-700 ${
                      currentUserEmail === user.email
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    title={
                      currentUserEmail === user.email
                        ? "You cannot delete your own account. Some other admin must do that for you."
                        : "Delete user"
                    }
                  >
                    <TrashIcon className="inline h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
