export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface UserInfo {
  fullName: string;
  userName: string;
  email: string;
  token: string;
  isPremium?: boolean;
  role?: string;
}
