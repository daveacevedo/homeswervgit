import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAdmin } from '../../../contexts/AdminContext';
import { format } from 'date-fns';

export default function AuditLogViewer() {
  const { hasPermission } = useAdmin();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    action: '',
    entityType: '',
    fromDate: '',
    toDate: '',
    userId: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });
  
  const canViewAuditLogs = hasPermission('access_management', 'view_audit_logs');

  useEffect(() => {
    if (canViewAuditLogs) {
      fetchLogs();
    }
  }, [canViewAuditLogs, pagination.page]);

  async function fetchLogs() {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate offset
      const offset = (pagination.page - 1) * pagination.limit;
      
      // Prepare filter object
      const filterParams = {
        ...filters,
        limit: pagination.limit,
        offset
      };
      
      // Fetch logs
      const { data, error, count } = await supabase
        .from('audit_logs')
        .select('*, auth_users:user_id(email)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + pagination.limit - 1);
      
      if (error) throw error;
      
      setLogs(data || []);
      setPagination({
        ...pagination,
        total: count || 0
      });
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setError('Failed to load audit logs. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      page: 1 // Reset to first page when applying filters
    });
    fetchLogs();
  };

  const handleResetFilters = () => {
    setFilters({
      action: '',
      entityType: '',
      fromDate: '',
      toDate: '',
      userId: ''
    });
    setPagination({
      ...pagination,
      page: 1
    });
    fetchLogs();
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(pagination.total / pagination.limit)) {
      return;
    }
    
    setPagination({
      ...pagination,
      page: newPage
    });
  };

  if (!canViewAuditLogs) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">Access Denied</h2>
        <p className="mt-2 text-sm text-gray-500">
          You don't have permission to view audit logs.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-gray-500">
          View system activity and user actions
        </p>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white shadow sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Filter Logs</h3>
          <form className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-6 sm:gap-x-4" onSubmit={handleApplyFilters}>
            <div className="sm:col-span-2">
              <label htmlFor="action" className="block text-sm font-medium text-gray-700">
                Action
              </label>
              <select
                id="action"
                name="action"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={filters.action}
                onChange={handleFilterChange}
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="publish">Publish</option>
                <option value="unpublish">Unpublish</option>
                <option value="activate">Activate</option>
                <option value="deactivate">Deactivate</option>
                <option value="revoke">Revoke</option>
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="entityType" className="block text-sm font-medium text-gray-700">
                Entity Type
              </label>
              <select
                id="entityType"
                name="entityType"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={filters.entityType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="admin_user">Admin User</option>
                <option value="admin_role">Admin Role</option>
                <option value="provider_verification">Provider Verification</option>
                <option value="content_page">Content Page</option>
                <option value="content_block">Content Block</option>
                <option value="integration_config">Integration</option>
                <option value="api_key">API Key</option>
                <option value="system_settings">System Settings</option>
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                name="fromDate"
                id="fromDate"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={filters.fromDate}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                type="date"
                name="toDate"
                id="toDate"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={filters.toDate}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <input
                type="text"
                name="userId"
                id="userId"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={filters.userId}
                onChange={handleFilterChange}
                placeholder="Enter user ID"
              />
            </div>
            
            <div className="sm:col-span-2 flex items-end">
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Logs Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Timestamp
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      User
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Entity Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Entity ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-sm text-gray-500">
                        No audit logs found
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                          {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {log.auth_users?.email || 'Unknown'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            log.action === 'create' ? 'bg-green-100 text-green-800' :
                            log.action === 'update' ? 'bg-blue-100 text-blue-800' :
                            log.action === 'delete' ? 'bg-red-100 text-red-800' :
                            log.action === 'publish' ? 'bg-purple-100 text-purple-800' :
                            log.action === 'unpublish' ? 'bg-yellow-100 text-yellow-800' :
                            log.action === 'activate' ? 'bg-green-100 text-green-800' :
                            log.action === 'deactivate' ? 'bg-red-100 text-red-800' :
                            log.action === 'revoke' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {log.entity_type.replace(/_/g, ' ')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {log.entity_id || 'N/A'}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {log.details ? JSON.stringify(log.details) : 'No details'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pagination */}
      {!loading && logs.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.limit)) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.page === pageNumber
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
