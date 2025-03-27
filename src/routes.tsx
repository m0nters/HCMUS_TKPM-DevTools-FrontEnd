import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PluginExplorer from "./pages/PluginExplorer";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/404";
import Profile from "./pages/Profile";
import { ProtectedRoute } from "./components/common";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/explore" element={<PluginExplorer />} />
      <Route path="/terms" element={<TermsOfService />} />
      {/* Protected routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
