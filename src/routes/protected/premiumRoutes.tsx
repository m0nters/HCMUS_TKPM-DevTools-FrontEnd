import { Route } from "react-router-dom";
import { Premium } from "../../pages/";
import { ProtectedRoute } from "../../components/";

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
