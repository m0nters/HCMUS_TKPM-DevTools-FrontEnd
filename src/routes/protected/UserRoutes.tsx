import { Route } from "react-router-dom";
import Profile from "../../pages/profile/Profile";
import { ProtectedRoute } from "../../components/common";

export const User = [
  <Route
    key="profile"
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />,
];
