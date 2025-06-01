import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProviderServices = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Basic Home Inspection',
      description: 'Comprehensive inspection of home systems including electrical, plumbing, HVAC, and structural elements.',
      price: 250,
      duration: '2-3 hours',
      isActive: true,
      category: 'Inspection',
      bookings: 24
    },
    {
      id: 2,
      name: 'Plumbing Repair',
      description: 'Fix leaks, clogs, and other common plumbing issues. Includes minor repairs and parts replacement.',
      price: 120,
      duration: '1-2 hours',
      isActive: true,
      category: 'Repair',
      bookings: 42
    },
    {
      id: 3,
      name: 'Electrical System Upgrade',
      description: 'Upgrade electrical panels, install new outlets, and improve home electrical systems for safety and efficiency.',
      price: 350,
      duration: '4-6 hours',
      isActive: true,
      category: 'Installation',
      bookings: 18
    },
    {
      id: 4,
      name: 'HVAC Maintenance',
      description: 'Regular maintenance for heating and cooling systems to ensure optimal performance and longevity.',
      price: 180,
      duration: '1-2 hours',
      isActive: true,
      category: 'Maintenance',
      bookings: 36
    },
    {
      id: 5,
      name: 'Roof Inspection & Repair',
      description: 'Thorough inspection of roof condition with minor repairs for leaks and damaged shingles.',
      price: 275,
      duration: '2-4 hours',
      isActive: false,
      category: 'Inspection',
      bookings: 15
    }
  ]);

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: 'Inspection'
  });

  const handleAddService = (e) => {
    e.preventDefault();
    const serviceToAdd = {
      ...newService,
      id: services.length + 1,
      isActive: true,
      bookings: 0,
      price: parseFloat(newService.price)
    };
    
    setServices([...services, serviceToAdd]);
    setNewService({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: 'Inspection'
    });
  };

  const toggleServiceStatus = (id) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: value
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          onClick={() => document.getElementById('add-service-form').scrollIntoView({ behavior: 'smooth' })}
        >
          Add New Service
        </button>
      </div>

      {/* Services Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Active Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.filter(s => s.isActive).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{services.reduce((sum, service) => sum + service.bookings, 0)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Average Price</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(services.reduce((sum, service) => sum + service.price, 0) / services.length)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">My Service Offerings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{service.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(service.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.bookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => toggleServiceStatus(service.id)}
                      className={`mr-3 ${service.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                    >
                      {service.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <Link to={`/provider/services/${service.id}/edit`} className="text-blue-600 hover:text-blue-900">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Service Form */}
      <div id="add-service-form" className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add New Service</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleAddService}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Service Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={newService.name}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  id="category"
                  name="category"
                  value={newService.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Inspection">Inspection</option>
                  <option value="Repair">Repair</option>
                  <option value="Installation">Installation</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Consultation">Consultation</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  min="0"
                  value={newService.price}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  name="duration"
                  id="duration"
                  required
                  placeholder="e.g. 1-2 hours"
                  value={newService.duration}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  value={newService.description}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Service
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Service Insights */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Service Insights</h2>
        </div>
        <div className="p-6">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Most Popular Services by Bookings</p>
            <div className="relative pt-1">
              {services
                .sort((a, b) => b.bookings - a.bookings)
                .slice(0, 3)
                .map((service, index) => (
                  <div key={service.id} className="mb-4">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-sm font-semibold text-gray-700">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-700">{service.bookings} bookings</span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${(service.bookings / Math.max(...services.map(s => s.bookings))) * 100}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-blue-500' : 'bg-blue-400'
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link
              to="/provider/analytics"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              View Detailed Analytics
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderServices;
