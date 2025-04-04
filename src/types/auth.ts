export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface UserInfo {
  fullName: string;
  userName: string;
  email: string;
  token: string;
  role: "User" | "Premium" | "Admin";
}
