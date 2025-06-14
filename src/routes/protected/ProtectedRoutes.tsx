import { Admin } from "./Admin";
import { PremiumUpgrade } from "./PremiumUpgrade";
import { User } from "./User";

export const ProtectedRoutes = [...User, ...Admin, ...PremiumUpgrade];
