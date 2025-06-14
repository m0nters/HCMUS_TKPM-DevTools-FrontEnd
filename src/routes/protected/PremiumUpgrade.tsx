import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../components";
import { Premium } from "../../pages";

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
