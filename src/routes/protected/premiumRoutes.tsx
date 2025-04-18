import { Route } from "react-router-dom";
import Premium from "../../pages/Premium";
import { ProtectedRoute } from "../../components/auth";

export const PremiumUpgrade = [
  <Route
    key="premium"
    path="/premium"
    element={
      <ProtectedRoute requiredAuth={true}>
        <Premium />
      </ProtectedRoute>
    }
  />,
];
