import { useContext } from "react";
import { AuthContext } from "../contexts/";

/**
 * For easier usage
 */
export function useAuth() {
  return useContext(AuthContext);
}
