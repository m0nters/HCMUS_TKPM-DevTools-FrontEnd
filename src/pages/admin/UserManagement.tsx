import { useState, useEffect, useCallback } from "react";
import {
  AdminUser,
  getAllUsers,
  changeUserRole,
  deleteUser,
} from "../../services/admin/userService";
import {
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";

type UserRole = "User" | "Premium" | "Admin";
const ROLES: UserRole[] = ["User", "Premium", "Admin"];

function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      setError("Failed to fetch users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.role.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    try {
      setActionInProgress(userId);
      const response = await changeUserRole(userId, role);
      if (response.success) {
        // Update the local state to reflect the change
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role } : user
          )
        );
      } else {
        throw new Error(response.message || "Failed to change role");
      }
    } catch (error) {
      console.error("Error changing role:", error);
      setError("Failed to change user role. Please try again.");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (userId: string, userEmail: string) => {
    // Prevent deletion of current user
    if (currentUser?.email === userEmail) {
      setError("You cannot delete your own account.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setActionInProgress(userId);
      const response = await deleteUser(userId);
      if (response.success) {
        // Remove the user from the local state
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setFilteredUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId)
        );
      } else {
        throw new Error(response.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again.");
    } finally {
      setActionInProgress(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={fetchUsers}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Search and filter */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-white"
          placeholder="Search users by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

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
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className={`block w-24 text-sm border-gray-300 rounded-md ${
                          actionInProgress === user.id ? "opacity-50" : ""
                        }`}
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as UserRole)
                        }
                        disabled={
                          actionInProgress === user.id ||
                          currentUser?.email === user.email
                        }
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
                        onClick={() => handleDelete(user.id, user.email)}
                        disabled={
                          actionInProgress === user.id ||
                          currentUser?.email === user.email
                        }
                        className={`text-red-500 hover:text-red-700 ${
                          actionInProgress === user.id ||
                          currentUser?.email === user.email
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        title={
                          currentUser?.email === user.email
                            ? "You cannot delete your own account"
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
  );
}

export default UserManagement;
