import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { 
  UserCircleIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  MapPinIcon,
  StarIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const ProviderClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch clients from your database
      // For demo purposes, we'll use mock data
      
      // Mock clients data
      const mockClients = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '(206) 555-1234',
          address: '123 Main St, Seattle, WA 98101',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          status: 'active',
          projects_count: 3,
          total_spent: 3500,
          last_project_date: new Date(2023, 4, 15),
          notes: 'Prefers communication via email. Interested in kitchen renovation next year.',
          rating: 5
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          phone: '(425) 555-5678',
          address: '456 Oak Ave, Bellevue, WA 98004',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          status: 'active',
          projects_count: 1,
          total_spent: 850,
          last_project_date: new Date(2023, 4, 16),
          notes: 'Has two dogs, ensure team is aware when visiting.',
          rating: 4
        },
        {
          id: 3,
          name: 'Michael Brown',
          email: 'michael.brown@example.com',
          phone: '(206) 555-9012',
          address: '789 Pine Rd, Redmond, WA 98052',
          avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          status: 'inactive',
          projects_count: 2,
          total_spent: 2200,
          last_project_date: new Date(2023, 3, 18),
          notes: 'Referred by Sarah Johnson. Interested in future landscaping work.',
          rating: 5
        },
        {
          id: 4,
          name: 'Emily Wilson',
          email: 'emily.wilson@example.com',
          phone: '(425) 555-3456',
          address: '101 Elm St, Kirkland, WA 98033',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          status: 'active',
          projects_count: 1,
          total_spent: 1200,
          last_project_date: new Date(2023, 4, 5),
          notes: 'Very particular about cleanliness during projects.',
          rating: 5
        },
        {
          id: 5,
          name: 'David Lee',
          email: 'david.lee@example.com',
          phone: '(206) 555-7890',
          address: '202 Cedar Ave, Seattle, WA 98115',
          avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          status: 'active',
          projects_count: 1,
          total_spent: 950,
          last_project_date: new Date(2023, 4, 2),
          notes: 'Works from home, prefers early morning appointments.',
          rating: 4
        },
        {
          id: 6,
          name: 'Jennifer Garcia',
          email: 'jennifer.garcia@example.com',
          phone: '(425) 555-2345',
          address: '303 Maple Dr, Bellevue, WA 98005',
          avatar: 'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          status: 'pending',
          projects_count: 0,
          total_spent: 0,
          last_project_date: null,
          notes: 'Initial consultation scheduled for next week.',
          rating: null
        },
        {
          id: 7,
          name: 'Robert Martinez',
          email: 'robert.martinez@example.com',
          phone: '(206) 555-6789',
          address: '404 Birch Ln, Seattle, WA 98105',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          status: 'active',
          projects_count: 1,
          total_spent: 750,
          last_project_date: new Date(2023, 3, 28),
          notes: 'Prefers text messages for communication.',
          rating: 5
        },
        {
          id: 8,
          name: 'Lisa Anderson',
          email: 'lisa.anderson@example.com',
          phone: '(425) 555-0123',
          address: '505 Spruce Ct, Redmond, WA 98052',
          avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          status: 'inactive',
          projects_count: 1,
          total_spent: 1500,
          last_project_date: new Date(2023, 2, 15),
          notes: 'Has expressed interest in additional landscaping work in the summer.',
          rating: 4
        }
      ];
      
      setClients(mockClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter clients based on search term and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.phone.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'last_project') {
      // Handle null dates
      if (!a.last_project_date && !b.last_project_date) comparison = 0;
      else if (!a.last_project_date) comparison = 1;
      else if (!b.last_project_date) comparison = -1;
      else comparison = a.last_project_date - b.last_project_date;
    } else if (sortBy === 'projects_count') {
      comparison = a.projects_count - b.projects_count;
    } else if (sortBy === 'total_spent') {
      comparison = a.total_spent - b.total_spent;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Inactive
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
    }
  };

  // Render star rating
  const renderStarRating = (rating) => {
    if (rating === null) return <span className="text-sm text-gray-500">No rating yet</span>;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon 
            key={i} 
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill={i < rating ? 'currentColor' : 'none'} 
          />
        ))}
      </div>
    );
  };

  // Handle client click
  const handleClientClick = (client) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setSelectedClient(null);
    setShowClientModal(false);
  };

  // Client modal
  const renderClientModal = () => {
    if (!selectedClient) return null;

    return (
      <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseModal}></div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={selectedClient.avatar}
                    alt={selectedClient.name}
                  />
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {selectedClient.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Client since {selectedClient.last_project_date ? format(selectedClient.last_project_date, 'MMMM yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  {getStatusBadge(selectedClient.status)}
                </div>
              </div>
              
              <div className="mt-4 border-t border-gray-200 pt-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.email}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.phone}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.address}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Projects</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.projects_count}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Total Spent</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatCurrency(selectedClient.total_spent)}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Rating</dt>
                    <dd className="mt-1 text-sm text-gray-900">{renderStarRating(selectedClient.rating)}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.notes || 'No notes available'}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-3 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-3 sm:text-sm"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-2 sm:text-sm"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Filters and search */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="w-full md:w-1/2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowFilters(!showFilters)}
              >
                <AdjustmentsHorizontalIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                Filters
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Client
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
                    Sort By
                  </label>
                  <select
                    id="sort"
                    name="sort"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="name">Name</option>
                    <option value="last_project">Last Project Date</option>
                    <option value="projects_count">Number of Projects</option>
                    <option value="total_spent">Total Spent</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                    Order
                  </label>
                  <select
                    id="order"
                    name="order"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clients list */}
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {sortedClients.length > 0 ? (
                sortedClients.map((client) => (
                  <li key={client.id}>
                    <div 
                      className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleClientClick(client)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={client.avatar}
                            alt={client.name}
                          />
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-blue-600">{client.name}</p>
                              <div className="ml-2">
                                {getStatusBadge(client.status)}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">{client.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle message action
                            }}
                          >
                            <ChatBubbleLeftRightIcon className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle calendar action
                            }}
                          >
                            <CalendarIcon className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <PhoneIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            {client.phone}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            {client.address}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            {client.projects_count} {client.projects_count === 1 ? 'project' : 'projects'} · {formatCurrency(client.total_spent)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {client.last_project_date ? (
                            <span>Last project: {format(client.last_project_date, 'MMM d, yyyy')}</span>
                          ) : (
                            <span>No projects yet</span>
                          )}
                        </div>
                        <div>
                          {renderStarRating(client.rating)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-center text-gray-500">
                  No clients found matching your criteria
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Client statistics */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Client Statistics</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Overview of your client base</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Total Clients</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{clients.length}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Active Clients</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {clients.filter(client => client.status === 'active').length}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Total Revenue</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatCurrency(clients.reduce((sum, client) => sum + client.total_spent, 0))}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Average Projects per Client</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {(clients.reduce((sum, client) => sum + client.projects_count, 0) / clients.length).toFixed(1)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Client detail modal */}
      {showClientModal && renderClientModal()}
    </div>
  );
};

export default ProviderClients;
