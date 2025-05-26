import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminUsers = () => {
  const { user, supabase } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // This would be replaced with actual data fetching from Supabase
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock users data
        const mockUsers = [
          {
            id: '1',
            email: 'john.smith@example.com',
            firstName: 'John',
            lastName: 'Smith',
            role: 'homeowner',
            status: 'active',
            createdAt: '2023-11-15T10:30:00Z',
            lastLogin: '2023-11-28T14:22:00Z'
          },
          {
            id: '2',
            email: 'elite.plumbing@example.com',
            firstName: 'Mike',
            lastName: 'Johnson',
            role: 'provider',
            status: 'active',
            createdAt: '2023-11-10T08:15:00Z',
            lastLogin: '2023-11-27T16:45:00Z'
          },
          {
            id: '3',
            email: 'sarah.jones@example.com',
            firstName: 'Sarah',
            lastName: 'Jones',
            role: 'homeowner',
            status: 'active',
            createdAt: '2023-11-05T14:20:00Z',
            lastLogin: '2023-11-26T09:10:00Z'
          },
          {
            id: '4',
            email: 'ace.electrical@example.com',
            firstName: 'David',
            lastName: 'Williams',
            role: 'provider',
            status: 'pending',
            createdAt: '2023-11-01T11:45:00Z',
            lastLogin: '2023-11-25T13:30:00Z'
          },
          {
            id: '5',
            email: 'mike.brown@example.com',
            firstName: 'Mike',
            lastName: 'Brown',
            role: 'homeowner',
            status: 'active',
            createdAt: '2023-10-28T09:00:00Z',
            lastLogin: '2023-11-24T10:15:00Z'
          },
          {
            id: '6',
            email: 'quality.landscaping@example.com',
            firstName: 'Robert',
            lastName: 'Davis',
            role: 'provider',
            status: 'active',
            createdAt: '2023-10-25T15:30:00Z',
            lastLogin: '2023-11-23T11:20:00Z'
          },
          {
            id: '7',
            email: 'emma.wilson@example.com',
            firstName: 'Emma',
            lastName: 'Wilson',
            role: 'homeowner',
            status: 'inactive',
            createdAt: '2023-10-20T13:10:00Z',
            lastLogin: '2023-11-10T08:45:00Z'
          },
          {
            id: '8',
            email: 'admin@homeservicehub.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            status: 'active',
            createdAt: '2023-10-01T09:00:00Z',
            lastLogin: '2023-11-28T09:30:00Z'
          }
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [user]);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = (userId, action) => {
    // This would be replaced with actual API calls
    console.log(`Performing ${action} on user ${userId}`);
    
    // For demo purposes, update the UI immediately
    if (action === 'activate' || action === 'deactivate') {
      setUsers(users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            status: action === 'activate' ? 'active' : 'inactive'
          };
        }
        return user;
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add User
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search by name or email"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <div>
              <label htmlFor="role-filter" className="sr-only">Filter by role</label>
              <select
                id="role-filter"
                name="role-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="homeowner">Homeowner</option>
                <option value="provider">Provider</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="status-filter" className="sr-only">Filter by status</label>
              <select
                id="status-filter"
                name="status-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{user.role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : user.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-3 justify-end">
                            <button
                              className="text-primary-600 hover:text-primary-900"
                              onClick={() => console.log('View user', user.id)}
                            >
                              View
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-900"
                              onClick={() => console.log('Edit user', user.id)}
                            >
                              Edit
                            </button>
                            {user.status === 'active' ? (
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleUserAction(user.id, 'deactivate')}
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                className="text-green-600 hover:text-green-900"
                                onClick={() => handleUserAction(user.id, 'activate')}
                              >
                                Activate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No users found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
