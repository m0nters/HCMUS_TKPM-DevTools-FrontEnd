export type UserRole = "User" | "Premium" | "Admin";
export const ROLES = ["User", "Premium", "Admin"] as const;

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}
