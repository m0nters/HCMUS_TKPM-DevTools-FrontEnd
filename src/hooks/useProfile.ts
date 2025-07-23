import { useMutation, useQuery } from "@tanstack/react-query";
import {
  changePassword,
  deleteAccount,
  getFavorites,
  getProfile,
} from "../services/";

// Profile query hook
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};

// Favorites query hook
export const useFavoritesQuery = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });
};

// Password change mutation hook
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

// Delete account mutation hook
export const useDeleteAccountMutation = () => {
  return useMutation({
    mutationFn: deleteAccount,
  });
};
