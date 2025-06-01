import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Properties() {
  const { hasPermission } = useAdmin();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock data for demonstration
  const mockProperties = [
    { 
      id: 1, 
      address: '123 Main St, Austin, TX 78701', 
      type: 'Single Family', 
      status: 'Active',
      owner: 'John Smith',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1850,
      yearBuilt: 2005,
      lastUpdated: '2023-10-15T14:30:00Z',
      projectCount: 2,
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 2, 
      address: '456 Oak Ave, Dallas, TX 75201', 
      type: 'Condo', 
      status: 'Active',
      owner: 'Sarah Johnson',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      yearBuilt: 2010,
      lastUpdated: '2023-10-14T09:15:00Z',
      projectCount: 1,
      image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 3, 
      address: '789 Pine Rd, Houston, TX 77002', 
      type: 'Townhouse', 
      status: 'Inactive',
      owner: 'Robert Williams',
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 1650,
      yearBuilt: 2015,
      lastUpdated: '2023-09-30T11:45:00Z',
      projectCount: 0,
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 4, 
      address: '101 Maple Dr, San Antonio, TX 78205', 
      type: 'Single Family', 
      status: 'Active',
      owner: 'Emily Davis',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2200,
      yearBuilt: 2000,
      lastUpdated: '2023-10-12T16:20:00Z',
      projectCount: 3,
      image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 5, 
      address: '222 Elm St, Austin, TX 78704', 
      type: 'Multi-Family', 
      status: 'Active',
      owner: 'Michael Brown',
      bedrooms: 6,
      bathrooms: 4,
      sqft: 3500,
      yearBuilt: 1995,
      lastUpdated: '2023-10-10T13:10:00Z',
      projectCount: 5,
      image: 'https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
  ];

  const propertyTypes = ['all', 'Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Commercial'];
  const statusOptions = ['all', 'Active', 'Inactive', 'Pending'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProperties(mockProperties);
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

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         property.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesType = typeFilter === 'all' || property.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Property Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage properties registered on the platform
        </p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <label htmlFor="search" className="sr-only">
            Search properties
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
              placeholder="Search properties"
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-full sm:w-48">
          <select
            id="type"
            name="type"
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Property Types' : type}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-full sm:w-auto sm:ml-auto">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Add Property
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={property.image} 
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
                  <span className="truncate">{property.type}</span>
                  <span className="mx-1">•</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    property.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : property.status === 'Inactive'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status}
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
                    <p className="text-sm font-medium text-gray-900">{property.yearBuilt}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500">Owner</p>
                  <p className="text-sm font-medium text-gray-900">{property.owner}</p>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500">Projects</p>
                  <p className="text-sm font-medium text-gray-900">
                    {property.projectCount} {property.projectCount === 1 ? 'project' : 'projects'}
                  </p>
                </div>
                <div className="mt-4 text-xs text-gray-500 text-right">
                  Last updated: {formatDate(property.lastUpdated)}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredProperties.length === 0 && !loading && (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {properties.length === 0 
              ? "No properties have been added to the system yet."
              : "No properties match your current search filters."}
          </p>
          {properties.length === 0 && (
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Add Property
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
