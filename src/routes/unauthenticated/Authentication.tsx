import { Route } from "react-router-dom";
import { UnauthenticatedRoute } from "../../components/";
import { Login, Register } from "../../pages";

export const Authentication = [
  <Route
    key="login"
    path="/login"
    element={
      <UnauthenticatedRoute>
        <Login />
      </UnauthenticatedRoute>
    }
  />,
  <Route
    key="register"
    path="/register"
    element={
      <UnauthenticatedRoute>
        <Register />
      </UnauthenticatedRoute>
    }
  />,
];
