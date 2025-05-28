import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [providersPerPage] = useState(10);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProviders();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProviders = async () => {
    try {
      setLoading(true);
      
      // Fetch providers (users with role 'provider')
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          created_at,
          is_active,
          is_verified,
          provider_details (
            id,
            business_name,
            description,
            years_of_experience,
            service_area,
            hourly_rate,
            service_category_id,
            rating,
            total_reviews,
            total_projects
          )
        `)
        .eq('role', 'provider');

      if (error) throw error;
      
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError('Failed to load providers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleProviderStatus = async (providerId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', providerId);

      if (error) throw error;

      // Update local state
      setProviders(providers.map(provider => 
        provider.id === providerId ? { ...provider, is_active: newStatus } : provider
      ));
    } catch (error) {
      console.error('Error toggling provider status:', error);
      alert('Failed to update provider status. Please try again.');
    }
  };

  const toggleVerificationStatus = async (providerId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: newStatus })
        .eq('id', providerId);

      if (error) throw error;

      // Update local state
      setProviders(providers.map(provider => 
        provider.id === providerId ? { ...provider, is_verified: newStatus } : provider
      ));
    } catch (error) {
      console.error('Error toggling verification status:', error);
      alert('Failed to update verification status. Please try again.');
    }
  };

  // Filter providers based on search term, category, and status
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = 
      provider.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.provider_details?.[0]?.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      provider.provider_details?.[0]?.service_category_id === selectedCategory;
    
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && provider.is_active) ||
      (selectedStatus === 'inactive' && !provider.is_active) ||
      (selectedStatus === 'verified' && provider.is_verified) ||
      (selectedStatus === 'unverified' && !provider.is_verified);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = filteredProviders.slice(indexOfFirstProvider, indexOfLastProvider);
  const totalPages = Math.ceil(filteredProviders.length / providersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Service Provider Management</h1>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search providers..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        
        <div>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>
      
      {/* Providers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projects
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentProviders.length > 0 ? (
              currentProviders.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {provider.first_name && provider.last_name ? (
                          <span className="text-gray-600 font-medium">
                            {provider.first_name.charAt(0)}{provider.last_name.charAt(0)}
                          </span>
                        ) : (
                          <span className="text-gray-600 font-medium">
                            {provider.email.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {provider.first_name && provider.last_name 
                            ? `${provider.first_name} ${provider.last_name}`
                            : 'No Name'
                          }
                        </div>
                        <div className="text-sm text-gray-500">{provider.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {provider.provider_details?.[0]?.business_name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {provider.provider_details?.[0]?.service_area || 'N/A'}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                    {provider.provider_details?.[0]?.service_category_id 
                      ? getCategoryName(provider.provider_details[0].service_category_id)
                      : 'N/A'
                    }
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-1">
                        {provider.provider_details?.[0]?.rating?.toFixed(1) || 'N/A'}
                      </span>
                      {provider.provider_details?.[0]?.rating && (
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      )}
                      <span className="text-xs text-gray-500 ml-1">
                        ({provider.provider_details?.[0]?.total_reviews || 0})
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                    {provider.provider_details?.[0]?.total_projects || 0}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          provider.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {provider.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          provider.is_verified
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {provider.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => toggleProviderStatus(provider.id, provider.is_active)}
                        className={`px-3 py-1 rounded text-xs ${
                          provider.is_active
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        {provider.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => toggleVerificationStatus(provider.id, provider.is_verified)}
                        className={`px-3 py-1 rounded text-xs ${
                          provider.is_verified
                            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                      >
                        {provider.is_verified ? 'Unverify' : 'Verify'}
                      </button>
                      <button
                        className="px-3 py-1 rounded text-xs bg-gray-100 text-gray-600 hover:bg-gray-200"
                        onClick={() => {
                          // View provider details functionality
                          alert('View provider details - to be implemented');
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                  No providers found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstProvider + 1} to {Math.min(indexOfLastProvider, filteredProviders.length)} of {filteredProviders.length} providers
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map(number => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === number + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Providers;
