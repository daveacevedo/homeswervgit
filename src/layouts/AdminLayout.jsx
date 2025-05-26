import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const { loading, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/admin/dashboard" className="text-xl font-bold text-primary-600">
                  Admin Dashboard
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                  <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-700">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </div>
                </span>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.email}</div>
                <div className="text-sm font-medium text-gray-500">Administrator</div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-64 mb-6 md:mb-0">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <nav className="space-y-1">
                    <Link
                      to="/admin/dashboard"
                      className={`${
                        isActive('/admin/dashboard')
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className={`${
                        isActive('/admin/users')
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                    >
                      Users
                    </Link>
                    <Link
                      to="/admin/providers"
                      className={`${
                        isActive('/admin/providers')
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                    >
                      Providers
                    </Link>
                    <Link
                      to="/admin/reports"
                      className={`${
                        isActive('/admin/reports')
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                    >
                      Reports
                    </Link>
                    <Link
                      to="/admin/settings"
                      className={`${
                        isActive('/admin/settings')
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                    >
                      Settings
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
            <div className="md:ml-6 w-full">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
