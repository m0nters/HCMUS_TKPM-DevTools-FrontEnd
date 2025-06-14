import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../components";
import {
  FavoritesSection,
  MyProfile,
  ProfileInfoSection,
  SecuritySection,
} from "../../pages";

export const User = [
  <Route
    key="profile"
    path="/profile"
    element={
      <ProtectedRoute requiredAuth={true}>
        <MyProfile />
      </ProtectedRoute>
    }
  >
    {/* Nested routes that will render inside the Outlet in MyProfile */}
    <Route index element={<ProfileInfoSection />} />
    <Route path="info" element={<ProfileInfoSection />} />
    <Route path="security" element={<SecuritySection />} />
    <Route path="favorites" element={<FavoritesSection />} />
  </Route>,
];
