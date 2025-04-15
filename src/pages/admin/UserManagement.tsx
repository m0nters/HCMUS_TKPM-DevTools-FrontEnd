import { useState, useEffect, useCallback, use } from "react";
import {
  getAllUsers,
  changeUserRole,
  deleteUser,
} from "../../services/admin/userService";
import {
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import { UserProfile, UserRole, ROLES } from "../../types/user";
import { AlertMessage, Button } from "../../components/common";
import { estimateReadingTime } from "../../utils/string";
import { useDebounce } from "../../hooks/useDebounce";
import ConfirmDialog from "../../components/common/ui/ConfirmDialog";

function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [actionStatus, setActionStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [searchQuery, setSearchQuery] = useState("");
  // Add these state variables near your other state declarations
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);

  const { user: currentUser } = useAuth();

  const debouncedSearchQuery = useDebounce(searchQuery);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setActionStatus({ type: null, message: "" }); // Reset status message
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      setActionStatus({
        type: "error",
        message: "Failed to fetch users. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    applyFilters();
    setIsSearching(false);
  }, [debouncedSearchQuery, users]);

  const applyFilters = () => {
    if (debouncedSearchQuery.trim() === "") {
      setFilteredUsers(users);
      return;
    }

    const lowercaseQuery = debouncedSearchQuery.toLowerCase().trim();
    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.role.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (chosenUser: UserProfile, role: UserRole) => {
    try {
      const response = await changeUserRole(chosenUser.id, role);
      if (response.success) {
        // Update the local state to reflect the change
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === chosenUser.id ? { ...user, role } : user
          )
        );
        setActionStatus({
          type: "success",
          message: `${chosenUser?.fullName} role changed to ${role}`,
        });
      } else {
        setActionStatus({
          type: "error",
          message:
            response.message ||
            `Failed to change user role for ${chosenUser?.fullName}`,
        });
      }
    } catch (error) {
      console.error("Error changing role:", error);
      setActionStatus({
        type: "error",
        message: `Failed to change user role for ${chosenUser?.fullName}`,
      });
    }
  };

  // Modify the handleDelete function to open the confirm dialog
  const handleDelete = (user: UserProfile) => {
    // Open the confirm dialog
    setUserToDelete(user);
    setIsConfirmDialogOpen(true);
  };

  // Create a new function to execute the actual deletion
  const executeUserDeletion = async (userId: string) => {
    try {
      const response = await deleteUser(userId);
      if (response.success) {
        // Remove the user from the local state
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setFilteredUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId)
        );

        setActionStatus({
          type: "success",
          message: "User deleted successfully",
        });
      } else {
        setActionStatus({
          type: "error",
          message: response.message || "Failed to delete user",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setActionStatus({
        type: "error",
        message: "Failed to delete user",
      });
    }
  };

  // Add this confirm dialog component

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      {isConfirmDialogOpen && (
        <ConfirmDialog
          isOpen={isConfirmDialogOpen} // looks like 2FA here
          title="Confirm Deletion"
          message={
            <>
              Are you sure you want to delete the user{" "}
              <span className="font-medium text-gray-700">
                {userToDelete!.fullName}
              </span>
              ? This action cannot be undone.
            </>
          }
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonColor="red"
          onConfirm={() => {
            executeUserDeletion(userToDelete!.id);
            setIsConfirmDialogOpen(false);
          }}
          onCancel={() => setIsConfirmDialogOpen(false)}
        />
      )}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <Button onClick={fetchUsers} variant="primary" size="sm">
            <div className="flex justify-center items-center gap-2 group-hover:gap-4 transition-all duration-50">
              <ArrowPathIcon className="w-4 h-4" />
              <span>Refresh</span>
            </div>
          </Button>
        </div>
        {/* Error message */}
        {actionStatus && (
          <AlertMessage
            message={actionStatus.message}
            isError={actionStatus.type !== "success"}
            duration={estimateReadingTime(actionStatus.message)}
            onDismiss={() => {
              setActionStatus({ type: null, message: "" });
            }}
            position="top-center"
          />
        )}
        {/* Search and filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {/* Show spinning icon when debouncing */}
            {isSearching ? (
              <ArrowPathIcon className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <input
            type="text"
            className={`block w-full p-2 pl-10 text-sm border rounded-lg bg-white transition-colors`}
            placeholder="Search users by any part of name, email, or role..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearching(true);
            }}
          />

          {/* Optional: Add status text when debouncing */}
          {isSearching && (
            <div className="absolute left-0">
              <span className="text-xs text-gray-400">Searching...</span>
            </div>
          )}
        </div>
        {/* Users table */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className={`block w-24 text-sm border-gray-300 rounded-md ${
                            currentUser?.email === user.email
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user, e.target.value as UserRole)
                          }
                          disabled={currentUser?.email === user.email}
                        >
                          {ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={currentUser?.email === user.email}
                          className={`text-red-500 hover:text-red-700 ${
                            currentUser?.email === user.email
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          title={
                            currentUser?.email === user.email
                              ? "You cannot delete your own account. Some other admin must do that for you."
                              : "Delete user"
                          }
                        >
                          <TrashIcon className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
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
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserManagement;
