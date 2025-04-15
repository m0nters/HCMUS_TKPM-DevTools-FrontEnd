import { Admin } from "./adminRoutes";
import { User } from "./userRoutes";

export const ProtectedRoutes = [...User, ...Admin];
