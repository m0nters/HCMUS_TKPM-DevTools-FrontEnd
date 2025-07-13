import {
  ArrowPathIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import {
  AlertMessage,
  Button,
  ConfirmDialog,
} from "../../../components/common";
import { useAuth, useDebounce } from "../../../hooks/";
import {
  changeUserRole,
  deleteUser,
  getAllUsers,
  getPremiumRequests,
  processPremiumRequest,
} from "../../../services/";
import { UserProfile, UserRole } from "../../../types/";
import { estimateReadingTime } from "../../../utils/";
import { PremiumRequestsTable } from "./PremiumRequestsTable";
import { UsersTable } from "./UsersTable";

// Define view types
type ViewType = "users" | "premium-requests";

const VIEW_TABS = [
  {
    id: "users" as ViewType,
    label: "All Users",
    icon: UsersIcon,
    getBadgeCount: (data: any) => null, // No badge for users tab
  },
  {
    id: "premium-requests" as ViewType,
    label: "Premium Requests",
    icon: BellIcon,
    getBadgeCount: (data: any) =>
      data.premiumRequests?.length > 0 ? data.premiumRequests.length : null,
  },
] as const;

export function UserManagement() {
  // Shared state
  const [activeView, setActiveView] = useState<ViewType>("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [actionStatus, setActionStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  // Users state
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);

  // Premium requests state
  const [premiumRequests, setPremiumRequests] = useState<UserProfile[]>([]);
  const [filteredPremiumRequests, setFilteredPremiumRequests] = useState<
    UserProfile[]
  >([]);
  const [isRequestsLoading, setIsRequestsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const { user: currentUser } = useAuth();
  const debouncedSearchQuery = useDebounce(searchQuery);

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    try {
      setIsUsersLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      setActionStatus({
        isError: true,
        message: "Failed to fetch users. Please try again.",
      });
    } finally {
      setIsUsersLoading(false);
    }
  }, []);

  // Fetch premium requests
  const fetchPremiumRequests = useCallback(async () => {
    try {
      setIsRequestsLoading(true);
      const data = await getPremiumRequests();
      setPremiumRequests(data);
      setFilteredPremiumRequests(data);
    } catch (error) {
      setActionStatus({
        isError: true,
        message: "Failed to load premium requests. Please try again.",
      });
    } finally {
      setIsRequestsLoading(false);
    }
  }, []);

  // Initial data loading
  useEffect(() => {
    fetchUsers();
    fetchPremiumRequests();
  }, [fetchUsers, fetchPremiumRequests]);

  // Apply search filters for current view
  useEffect(() => {
    if (debouncedSearchQuery.trim() === "") {
      setFilteredUsers(users);
      setFilteredPremiumRequests(premiumRequests);
      setIsSearching(false);
      return;
    }

    const lowercaseQuery = debouncedSearchQuery.toLowerCase().trim();

    // Filter users
    const filteredUsersResult = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.role.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredUsers(filteredUsersResult);

    // Filter premium requests
    const filteredRequestsResult = premiumRequests.filter(
      (user) =>
        user.fullName.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.role.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredPremiumRequests(filteredRequestsResult);
    setIsSearching(false);
  }, [debouncedSearchQuery, users, premiumRequests]);

  // User actions
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
        fetchPremiumRequests();
        setActionStatus({
          isError: false,
          message: `${chosenUser?.fullName} role changed to ${role}`,
        });
      } else {
        setActionStatus({
          isError: true,
          message:
            response.message ||
            `Failed to change user role for ${chosenUser?.fullName}`,
        });
      }
    } catch (error) {
      console.error("Error changing role:", error);
      setActionStatus({
        isError: true,
        message: `Failed to change user role for ${chosenUser?.fullName}`,
      });
    }
  };

  const handleDelete = (user: UserProfile) => {
    setUserToDelete(user);
    setIsConfirmDialogOpen(true);
  };

  const executeUserDeletion = async (userId: string) => {
    try {
      const response = await deleteUser(userId);
      if (response.success) {
        // Remove the user from the local state
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setFilteredUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId)
        );
        fetchPremiumRequests();
        setActionStatus({
          isError: false,
          message: "User deleted successfully",
        });
      } else {
        setActionStatus({
          isError: true,
          message: response.message || "Failed to delete user",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setActionStatus({
        isError: true,
        message: "Failed to delete user",
      });
    }
  };

  // Premium request actions
  const handleApproveRequest = async (user: UserProfile) => {
    handleProcessRequest(user, true);
  };

  const handleRejectRequest = async (user: UserProfile) => {
    handleProcessRequest(user, false);
  };

  const handleProcessRequest = async (
    user: UserProfile,
    isAccepted: boolean
  ) => {
    setIsProcessing(user.id);
    try {
      const response = await processPremiumRequest(user.id, isAccepted);

      if (response.success) {
        // Remove the processed request from the list
        setPremiumRequests((prev) => prev.filter((req) => req.id !== user.id));
        setFilteredPremiumRequests((prev) =>
          prev.filter((req) => req.id !== user.id)
        );
        if (isAccepted) fetchUsers();
        setActionStatus({
          isError: false,
          message: `${
            isAccepted ? "Approved" : "Rejected"
          } premium request for ${user.fullName}`,
        });
      } else {
        setActionStatus({
          isError: true,
          message:
            response.message || "Failed to process request. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      setActionStatus({
        isError: true,
        message:
          "An error occurred while processing the request. Please try again.",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  // Helper to refresh all data
  const refreshAllData = () => {
    fetchUsers();
    fetchPremiumRequests();
    setActionStatus(null);
  };

  return (
    <>
      {isConfirmDialogOpen && (
        <ConfirmDialog
          isOpen={isConfirmDialogOpen}
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
          <Button onClick={refreshAllData} variant="primary" size="sm">
            <div className="flex justify-center items-center gap-2 group-hover:gap-4 transition-all duration-50">
              <ArrowPathIcon className="w-4 h-4" />
              <span>Refresh</span>
            </div>
          </Button>
        </div>

        {actionStatus && (
          <AlertMessage
            message={actionStatus.message}
            isError={actionStatus.isError}
            duration={estimateReadingTime(actionStatus.message)}
            onDismiss={() => {
              setActionStatus(null);
            }}
            position="top-center"
          />
        )}

        {/* View Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Views">
            {VIEW_TABS.map((tab) => {
              const Icon = tab.icon;
              const badgeCount = tab.getBadgeCount({ premiumRequests });
              const isActive = activeView === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                    isActive
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                    {badgeCount && (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {badgeCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search and filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {isSearching ? (
              <ArrowPathIcon className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <input
            type="text"
            className={`block w-full p-2 pl-10 text-sm border rounded-lg bg-white transition-colors`}
            placeholder={`Search ${
              activeView === "users" ? "users" : "premium requests"
            }...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearching(true);
            }}
          />

          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-xs text-blue-500">Searching...</span>
            </div>
          )}
        </div>

        {/* Content based on active view */}
        {activeView === "users" ? (
          <UsersTable
            users={users}
            filteredUsers={filteredUsers}
            isLoading={isUsersLoading}
            currentUserEmail={currentUser?.email}
            onRoleChange={handleRoleChange}
            onDeleteClick={handleDelete}
          />
        ) : (
          <PremiumRequestsTable
            requests={premiumRequests}
            filteredRequests={filteredPremiumRequests}
            isLoading={isRequestsLoading}
            processingId={isProcessing}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
          />
        )}
      </div>
    </>
  );
}
