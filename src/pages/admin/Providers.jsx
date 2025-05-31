import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Providers() {
  const { hasPermission } = useAdmin();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data for demonstration
  const mockProviders = [
    { 
      id: 1, 
      name: 'Elite Plumbing Services', 
      owner: 'Michael Johnson',
      email: 'info@eliteplumbing.com', 
      phone: '(555) 123-4567',
      category: 'Plumbing', 
      verificationStatus: 'Verified', 
      joinDate: '2023-05-15T10:30:00Z',
      rating: 4.8,
      completedJobs: 124
    },
    { 
      id: 2, 
      name: 'Sunshine Electrical', 
      owner: 'Sarah Williams',
      email: 'contact@sunshineelectrical.com', 
      phone: '(555) 234-5678',
      category: 'Electrical', 
      verificationStatus: 'Pending', 
      joinDate: '2023-09-22T14:15:00Z',
      rating: 4.5,
      completedJobs: 57
    },
    { 
      id: 3, 
      name: 'Green Thumb Landscaping', 
      owner: 'David Miller',
      email: 'info@greenthumb.com', 
      phone: '(555) 345-6789',
      category: 'Landscaping', 
      verificationStatus: 'Verified', 
      joinDate: '2023-03-10T09:45:00Z',
      rating: 4.9,
      completedJobs: 215
    },
    { 
      id: 4, 
      name: 'Perfect Finish Painting', 
      owner: 'Jennifer Lopez',
      email: 'service@perfectfinish.com', 
      phone: '(555) 456-7890',
      category: 'Painting', 
      verificationStatus: 'Rejected', 
      joinDate: '2023-08-05T11:20:00Z',
      rating: 3.7,
      completedJobs: 32
    },
    { 
      id: 5, 
      name: 'Reliable Roofing', 
      owner: 'Robert Smith',
      email: 'info@reliableroofing.com', 
      phone: '(555) 567-8901',
      category: 'Roofing', 
      verificationStatus: 'Pending', 
      joinDate: '2023-10-01T16:30:00Z',
      rating: 4.2,
      completedJobs: 78
    },
  ];

  const statuses = ['all', 'Verified', 'Pending', 'Rejected'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProviders(mockProviders);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = 
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      provider.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || provider.verificationStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Provider Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage service providers and verification requests
        </p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <label htmlFor="search" className="sr-only">
            Search providers
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              id="search"
              name="search"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              placeholder="Search providers"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="w-full sm:w-48">
          <select
            id="status"
            name="status"
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Provider
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Category
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Rating
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Jobs
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Joined
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredProviders.map((provider) => (
                      <tr key={provider.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="font-medium text-primary-700">
                                {provider.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{provider.name}</div>
                              <div className="text-gray-500">{provider.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{provider.category}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            provider.verificationStatus === 'Verified' 
                              ? 'bg-green-100 text-green-800' 
                              : provider.verificationStatus === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {provider.verificationStatus}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            {provider.rating}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {provider.completedJobs}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(provider.joinDate)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {provider.verificationStatus === 'Pending' && (
                            <>
                              <button
                                type="button"
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-900 mr-3"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
