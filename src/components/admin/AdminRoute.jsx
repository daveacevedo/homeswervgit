import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';

function AdminRoute() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  const loading = authLoading || adminLoading;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user && isAdmin ? <Outlet /> : <Navigate to="/login" />;
}

export default AdminRoute;
