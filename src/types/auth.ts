export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface RegisterCredentials {
  userName: string;
  fullName: string;
  email: string;
  password: string;
}

export interface UserInfo {
  fullName: string;
  userName: string;
  email: string;
  token: string;
  role: "User" | "Premium" | "Admin";
}
