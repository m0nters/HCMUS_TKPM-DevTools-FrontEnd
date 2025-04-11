import { UserInfo } from "./auth";

export type AuthUser = Omit<UserInfo, "token">;

export interface AuthContextType {
  user: AuthUser | null;
  isAuth: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (user: UserInfo, rememberMe: boolean) => void;
  logout: () => void;
}
