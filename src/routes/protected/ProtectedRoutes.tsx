import { Admin } from "./AdminRoutes";
import { PremiumUpgrade } from "./PremiumRoutes";
import { User } from "./UserRoutes";

export const ProtectedRoutes = [...User, ...Admin, ...PremiumUpgrade];
