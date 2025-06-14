import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../components/auth";
import {
  AdminDashboard,
  AdminOverview,
  UserManagement,
  ToolUpload,
} from "../../pages/admin";

export const Admin = [
  <Route
    key="admin"
    path="/admin"
    element={
      <ProtectedRoute requiredAuth={true} requireAdmin={true}>
        <AdminDashboard />
      </ProtectedRoute>
    }
  >
    {/* Nested routes that will render inside the Outlet in AdminDashboard */}
    <Route index element={<AdminOverview />} />
    <Route path="overview" element={<AdminOverview />} />
    <Route path="users" element={<UserManagement />} />
    <Route path="upload" element={<ToolUpload />} />
  </Route>,
];
