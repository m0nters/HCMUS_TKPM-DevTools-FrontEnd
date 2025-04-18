import { Admin } from "./adminRoutes";
import { PremiumUpgrade } from "./premiumRoutes";
import { User } from "./userRoutes";

export const ProtectedRoutes = [...User, ...Admin, ...PremiumUpgrade];
