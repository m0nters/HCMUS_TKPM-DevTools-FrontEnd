import { useContext } from "react";
import { FavoritesContext } from "../contexts/";

export function useFavorites() {
  return useContext(FavoritesContext);
}
