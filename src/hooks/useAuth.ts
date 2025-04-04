import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * For easier usage
 */
export function useAuth() {
  return useContext(AuthContext);
}
