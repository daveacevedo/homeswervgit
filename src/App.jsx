import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/users/UserManagement';
import RoleManagement from './components/admin/roles/RoleManagement';
import VerificationManagement from './components/admin/verifications/VerificationManagement';
import ContentManagement from './components/admin/content/ContentManagement';
import IntegrationManagement from './components/admin/integrations/IntegrationManagement';
import ApiKeyManagement from './components/admin/api/ApiKeyManagement';
import AnalyticsDashboard from './components/admin/analytics/AnalyticsDashboard';
import SystemSettings from './components/admin/settings/SystemSettings';
import AuditLogViewer from './components/admin/audit/AuditLogViewer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="roles" element={<RoleManagement />} />
                <Route path="verifications" element={<VerificationManagement />} />
                <Route path="content" element={<ContentManagement />} />
                <Route path="integrations" element={<IntegrationManagement />} />
                <Route path="api-keys" element={<ApiKeyManagement />} />
                <Route path="analytics" element={<AnalyticsDashboard />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="audit-logs" element={<AuditLogViewer />} />
              </Route>
            </Route>
            
            {/* Redirect to admin dashboard for now */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
