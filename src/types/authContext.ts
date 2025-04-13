import { UserInfo } from "./auth";

export type AuthUser = Omit<UserInfo, "token">;

export interface AuthContextType {
  user: AuthUser | null;
  isAuth: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  isLoading: boolean; // for waiting to completely load state's data for protected routes
  login: (user: UserInfo, rememberMe: boolean) => void;
  logout: () => void;
}
