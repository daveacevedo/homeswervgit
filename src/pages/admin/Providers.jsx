import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminProviders = () => {
  const { user, supabase } = useAuth();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');

  useEffect(() => {
    const fetchProviders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // This would be replaced with actual data fetching from Supabase
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock providers data
        const mockProviders = [
          {
            id: '1',
            businessName: 'Elite Plumbing Services',
            ownerName: 'Mike Johnson',
            email: 'elite.plumbing@example.com',
            phone: '(555) 123-4567',
            category: 'plumbing',
            verificationStatus: 'verified',
            rating: 4.8,
            completedJobs: 124,
            joinDate: '2023-06-15'
          },
          {
            id: '2',
            businessName: 'Ace Electrical Contractors',
            ownerName: 'David Williams',
            email: 'ace.electrical@example.com',
            phone: '(555) 234-5678',
            category: 'electrical',
            verificationStatus: 'pending',
            rating: 4.5,
            completedJobs: 87,
            joinDate: '2023-08-22'
          },
          {
            id: '3',
            businessName: 'Quality Landscaping',
            ownerName: 'Robert Davis',
            email: 'quality.landscaping@example.com',
            phone: '(555) 345-6789',
            category: 'landscaping',
            verificationStatus: 'verified',
            rating: 4.9,
            completedJobs: 156,
            joinDate: '2023-04-10'
          },
          {
            id: '4',
            businessName: 'Precision HVAC Solutions',
            ownerName: 'Thomas Anderson',
            email: 'precision.hvac@example.com',
            phone: '(555) 456-7890',
            category: 'hvac',
            verificationStatus: 'verified',
            rating: 4.7,
            completedJobs: 98,
            joinDate: '2023-07-05'
          },
          {
            id: '5',
            businessName: 'Superior Painting Co.',
            ownerName: 'Jennifer Martinez',
            email: 'superior.painting@example.com',
            phone: '(555) 567-8901',
            category: 'painting',
            verificationStatus: 'pending',
            rating: 4.6,
            completedJobs: 72,
            joinDate: '2023-09-18'
          },
          {
            id: '6',
            businessName: 'Reliable Roofing',
            ownerName: 'James Wilson',
            email: 'reliable.roofing@example.com',
            phone: '(555) 678-9012',
            category: 'roofing',
            verificationStatus: 'verified',
            rating: 4.8,
            completedJobs: 112,
            joinDate: '2023-05-30'
          },
          {
            id: '7',
            businessName: 'Modern Kitchen & Bath',
            ownerName: 'Lisa Thompson',
            email: 'modern.kitchen@example.com',
            phone: '(555) 789-0123',
            category: 'remodeling',
            verificationStatus: 'rejected',
            rating: 4.2,
            completedJobs: 45,
            joinDate: '2023-10-12'
          }
        ];
        
        setProviders(mockProviders);
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProviders();
  }, [user]);

  // Filter providers based on search term and filters
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = 
      provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || provider.category === categoryFilter;
    const matchesVerification = verificationFilter === 'all' || provider.verificationStatus === verificationFilter;
    
    return matchesSearch && matchesCategory && matchesVerification;
  });

  const handleVerificationAction = (providerId, action) => {
    // This would be replaced with actual API calls
    console.log(`Performing ${action} on provider ${providerId}`);
    
    // For demo purposes, update the UI immediately
    setProviders(providers.map(provider => {
      if (provider.id === providerId) {
        return {
          ...provider,
          verificationStatus: action === 'verify' ? 'verified' : action === 'reject' ? 'rejected' : 'pending'
        };
      }
      return provider;
    }));
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
        <h1 className="text-2xl font-semibold text-gray-900">Service Provider Management</h1>
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
                  placeholder="Search by business name or owner"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <div>
              <label htmlFor="category-filter" className="sr-only">Filter by category</label>
              <select
                id="category-filter"
                name="category-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="hvac">HVAC</option>
                <option value="landscaping">Landscaping</option>
                <option value="painting">Painting</option>
                <option value="roofing">Roofing</option>
                <option value="remodeling">Remodeling</option>
              </select>
            </div>
            <div>
              <label htmlFor="verification-filter" className="sr-only">Filter by verification</label>
              <select
                id="verification-filter"
                name="verification-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
              >
                <option value="all">All Verification Statuses</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Providers Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jobs
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProviders.length > 0 ? (
                    filteredProviders.map((provider) => (
                      <tr key={provider.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                                {provider.businessName.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {provider.businessName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {provider.ownerName} • {provider.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                {provider.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{provider.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            provider.verificationStatus === 'verified' 
                              ? 'bg-green-100 text-green-800' 
                              : provider.verificationStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {provider.verificationStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm text-gray-900">{provider.rating}</div>
                            <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {provider.completedJobs}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(provider.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-3 justify-end">
                            <button
                              className="text-primary-600 hover:text-primary-900"
                              onClick={() => console.log('View provider', provider.id)}
                            >
                              View
                            </button>
                            {provider.verificationStatus === 'pending' && (
                              <>
                                <button
                                  className="text-green-600 hover:text-green-900"
                                  onClick={() => handleVerificationAction(provider.id, 'verify')}
                                >
                                  Verify
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleVerificationAction(provider.id, 'reject')}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {provider.verificationStatus === 'verified' && (
                              <button
                                className="text-yellow-600 hover:text-yellow-900"
                                onClick={() => handleVerificationAction(provider.id, 'revoke')}
                              >
                                Revoke
                              </button>
                            )}
                            {provider.verificationStatus === 'rejected' && (
                              <button
                                className="text-green-600 hover:text-green-900"
                                onClick={() => handleVerificationAction(provider.id, 'reconsider')}
                              >
                                Reconsider
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No providers found matching your criteria
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

export default AdminProviders;
