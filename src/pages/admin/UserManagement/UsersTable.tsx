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
  onBulkRoleChange?: (users: UserProfile[], role: UserRole) => void;
  onBulkDelete?: (users: UserProfile[]) => void;
  selectedUsers: Set<string>;
  onSelectionChange: (selectedUsers: Set<string>) => void;
}

export function UsersTable({
  users,
  filteredUsers,
  isLoading,
  currentUserEmail,
  onRoleChange,
  onDeleteClick,
  onBulkRoleChange,
  onBulkDelete,
  selectedUsers,
  onSelectionChange,
}: UsersTableProps) {
  // Filter out current user from selectable users (can't bulk operate on yourself)
  const selectableUsers = filteredUsers.filter(
    (user) => user.email !== currentUserEmail,
  );

  const selectedUserObjects = filteredUsers.filter((user) =>
    selectedUsers.has(user.id),
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(new Set(selectableUsers.map((user) => user.id)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    onSelectionChange(newSelected);
  };

  const handleBulkRoleChange = (role: UserRole) => {
    if (selectedUserObjects.length === 0) return;
    onBulkRoleChange?.(selectedUserObjects, role);
  };

  const handleBulkDelete = () => {
    if (selectedUserObjects.length === 0) return;
    onBulkDelete?.(selectedUserObjects);
  };

  const isAllSelected =
    selectableUsers.length > 0 && selectedUsers.size === selectableUsers.length;
  const isIndeterminate =
    selectedUsers.size > 0 && selectedUsers.size < selectableUsers.length;
  if (isLoading) {
    return <LoadingSpinner size="lg" className="py-24" />;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Total users:{" "}
            <span className="font-medium">{filteredUsers.length}</span>
            {users.length !== filteredUsers.length && (
              <>
                {" "}
                (filtered from{" "}
                <span className="font-medium">{users.length}</span>)
              </>
            )}
            {selectedUsers.size > 0 && (
              <>
                {" "}
                |{" "}
                <span className="font-medium text-blue-600">
                  {selectedUsers.size} selected
                </span>
              </>
            )}
          </p>

          {/* Bulk Operations */}
          {selectedUsers.size > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-32">
                <DropdownMenu
                  options={ROLES.map((role) => ({
                    value: role,
                    label: `Change to ${role}`,
                  }))}
                  selectedValue=""
                  onSelect={(value) => handleBulkRoleChange(value as UserRole)}
                  searchable={false}
                  buttonClassName="text-sm"
                  optionsClassName="text-sm"
                  allowClear={false}
                />
              </div>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-700"
              >
                <TrashIcon className="h-4 w-4" />
                Delete ({selectedUsers.size})
              </button>
            </div>
          )}
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                disabled={selectableUsers.length === 0}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
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
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(user.id)}
                    onChange={(e) =>
                      handleSelectUser(user.id, e.target.checked)
                    }
                    disabled={user.email === currentUserEmail}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.fullName}
                    {user.email === currentUserEmail && (
                      <span className="ml-2 text-xs text-gray-500">(You)</span>
                    )}
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
                <td className="translate-x-6 px-6 py-4 text-center text-sm font-medium whitespace-nowrap">
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
                colSpan={6}
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
