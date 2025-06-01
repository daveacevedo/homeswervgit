import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { 
  HomeIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const Properties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  
  useEffect(() => {
    if (user) {
      fetchProperties();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from Supabase
      // For now, we'll use mock data
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // If no data, use mock data
      const propertyData = data && data.length > 0 ? data : [
        {
          id: 'prop-1',
          address: '123 Main Street',
          city: 'Austin',
          state: 'TX',
          zip: '78701',
          type: 'Single Family',
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1850,
          year_built: 2005,
          purchase_date: '2018-06-15',
          purchase_price: 425000,
          current_value: 525000,
          image_url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          project_count: 3,
          created_at: '2023-01-15T14:30:00Z'
        },
        {
          id: 'prop-2',
          address: '456 Oak Avenue',
          city: 'Austin',
          state: 'TX',
          zip: '78704',
          type: 'Condo',
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1200,
          year_built: 2015,
          purchase_date: '2020-03-10',
          purchase_price: 350000,
          current_value: 410000,
          image_url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          project_count: 1,
          created_at: '2023-03-20T09:15:00Z'
        },
        {
          id: 'prop-3',
          address: '789 Pine Road',
          city: 'Austin',
          state: 'TX',
          zip: '78745',
          type: 'Townhouse',
          bedrooms: 3,
          bathrooms: 2.5,
          sqft: 1650,
          year_built: 2010,
          purchase_date: '2019-11-22',
          purchase_price: 380000,
          current_value: 450000,
          image_url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          project_count: 2,
          created_at: '2023-05-05T11:45:00Z'
        }
      ];
      
      setProperties(propertyData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };
  
  const handleAddProperty = async (newProperty) => {
    try {
      setLoading(true);
      
      // In a real app, this would insert into Supabase
      const { data, error } = await supabase
        .from('properties')
        .insert([
          {
            ...newProperty,
            user_id: user.id,
            created_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Refresh the list
      fetchProperties();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding property:', error);
      setLoading(false);
    }
  };
  
  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would delete from Supabase
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyToDelete.id);
      
      if (error) throw error;
      
      // Refresh the list
      fetchProperties();
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error('Error deleting property:', error);
      setLoading(false);
    }
  };
  
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };
  
  const exportToCSV = () => {
    // Create CSV content
    const headers = [
      'Address',
      'City',
      'State',
      'Zip',
      'Type',
      'Bedrooms',
      'Bathrooms',
      'Square Feet',
      'Year Built',
      'Purchase Date',
      'Purchase Price',
      'Current Value'
    ];
    
    const rows = properties.map(property => [
      property.address,
      property.city,
      property.state,
      property.zip,
      property.type,
      property.bedrooms,
      property.bathrooms,
      property.sqft,
      property.year_built,
      property.purchase_date,
      property.purchase_price,
      property.current_value
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'properties.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const propertyTypes = ['all', 'Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Vacant Land', 'Other'];
  
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.zip.includes(searchTerm);
    
    const matchesType = typeFilter === 'all' || property.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Your Properties
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your real estate portfolio
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="ml-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Property
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white shadow sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search properties
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Search by address, city, or zip code"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <label htmlFor="type-filter" className="sr-only">
                Filter by type
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <select
                  id="type-filter"
                  name="type-filter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Property Types' : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <HomeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {properties.length === 0 
              ? "You haven't added any properties yet."
              : "No properties match your current filters."}
          </p>
          {properties.length === 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                Add your first property
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={property.image_url} 
                  alt={property.address} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x200?text=Property+Image';
                  }}
                />
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 truncate" title={property.address}>
                  {property.address}
                </h3>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="truncate">{property.city}, {property.state} {property.zip}</span>
                  <span className="mx-1">•</span>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                    {property.type}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Bedrooms</p>
                    <p className="text-sm font-medium text-gray-900">{property.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bathrooms</p>
                    <p className="text-sm font-medium text-gray-900">{property.bathrooms}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Square Feet</p>
                    <p className="text-sm font-medium text-gray-900">{property.sqft.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Year Built</p>
                    <p className="text-sm font-medium text-gray-900">{property.year_built}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500">Purchase Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(property.purchase_date)}</p>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Purchase Price</p>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(property.purchase_price)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Value</p>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(property.current_value)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500">Projects</p>
                  <p className="text-sm font-medium text-gray-900">
                    {property.project_count} {property.project_count === 1 ? 'project' : 'projects'}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="flex justify-between">
                  <Link
                    to={`/homeowner/properties/${property.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </Link>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PencilSquareIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(property)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add Property Modal (placeholder) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Property</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                This is a placeholder for the property form. In a real application, this would be a form to add a new property.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Property
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Delete Property
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete the property at {propertyToDelete?.address}? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
