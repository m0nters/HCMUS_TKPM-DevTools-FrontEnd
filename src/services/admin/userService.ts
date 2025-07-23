import { UserProfile } from "../../types/";
import { withAuth } from "../api/";

type UserRole = "User" | "Premium" | "Admin";

/**
 * Fetches all users (admin only)
 */
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const users = await withAuth<UserProfile[]>("/admin/users");
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};

/**
 * Change a user's role
 * @param userId - The ID of the user to update
 * @param role - The new role to assign
 */
export const changeUserRole = async (
  userId: string,
  role: UserRole,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await withAuth<{ success: boolean; message: string }>(
      "/admin/user/role-change",
      {
        method: "POST",
        body: JSON.stringify({ userId, role }),
      },
    );
    return response;
  } catch (error) {
    console.error("Failed to change user role:", error);
    throw error;
  }
};

/**
 * Delete a user
 * @param userId - The ID of the user to delete
 */
export const deleteUser = async (
  userId: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await withAuth<{ success: boolean; message: string }>(
      `/admin/user?userId=${userId}`,
      {
        method: "DELETE",
      },
    );
    return response;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};

/**
 * Bulk delete users
 * @param userIds - Array of user IDs to delete
 */
export const bulkDeleteUsers = async (
  userIds: string[],
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await withAuth<{ success: boolean; message: string }>(
      "/admin/bulk",
      {
        method: "DELETE",
        body: JSON.stringify({ userIds }),
      },
    );
    return response;
  } catch (error) {
    console.error("Failed to bulk delete users:", error);
    throw error;
  }
};

/**
 * Bulk change user roles
 * @param userIds - Array of user IDs to update
 * @param newRole - The new role to assign to all users
 */
export const bulkChangeUserRoles = async (
  userIds: string[],
  newRole: UserRole,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await withAuth<{ success: boolean; message: string }>(
      "/admin/bulk/role",
      {
        method: "PUT",
        body: JSON.stringify({ userIds, newRole }),
      },
    );
    return response;
  } catch (error) {
    console.error("Failed to bulk change user roles:", error);
    throw error;
  }
};

/**
 * Get user statistics summary
 */
export const getUserStats = async () => {
  try {
    const users = await getAllUsers();

    return {
      totalUsers: users.length,
      premiumUsers: users.filter((user) => user.role === "Premium").length,
    };
  } catch (error) {
    console.error("Failed to get user stats:", error);
    return {
      totalUsers: 0,
      premiumUsers: 0,
    };
  }
};
