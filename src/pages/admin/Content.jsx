import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Content() {
  const { hasPermission } = useAdmin();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Mock data for demonstration
  const mockPages = [
    { 
      id: 1, 
      title: 'Home Page', 
      slug: '/', 
      type: 'Landing Page', 
      lastUpdated: '2023-10-10T15:30:00Z',
      status: 'Published',
      author: 'Admin'
    },
    { 
      id: 2, 
      title: 'About Us', 
      slug: '/about', 
      type: 'Content Page', 
      lastUpdated: '2023-09-25T11:45:00Z',
      status: 'Published',
      author: 'Content Editor'
    },
    { 
      id: 3, 
      title: 'Services', 
      slug: '/services', 
      type: 'Content Page', 
      lastUpdated: '2023-10-05T09:20:00Z',
      status: 'Published',
      author: 'Admin'
    },
    { 
      id: 4, 
      title: 'Privacy Policy', 
      slug: '/privacy-policy', 
      type: 'Legal Page', 
      lastUpdated: '2023-08-15T14:10:00Z',
      status: 'Published',
      author: 'Legal Team'
    },
    { 
      id: 5, 
      title: 'Terms of Service', 
      slug: '/terms-of-service', 
      type: 'Legal Page', 
      lastUpdated: '2023-08-15T14:30:00Z',
      status: 'Published',
      author: 'Legal Team'
    },
    { 
      id: 6, 
      title: 'Upcoming Features', 
      slug: '/upcoming-features', 
      type: 'Content Page', 
      lastUpdated: '2023-10-12T10:15:00Z',
      status: 'Draft',
      author: 'Content Editor'
    },
    { 
      id: 7, 
      title: 'FAQ', 
      slug: '/faq', 
      type: 'Content Page', 
      lastUpdated: '2023-09-30T16:45:00Z',
      status: 'Published',
      author: 'Support Team'
    },
    { 
      id: 8, 
      title: 'Contact Us', 
      slug: '/contact', 
      type: 'Contact Page', 
      lastUpdated: '2023-10-01T13:20:00Z',
      status: 'Published',
      author: 'Admin'
    },
  ];

  const pageTypes = ['all', 'Landing Page', 'Content Page', 'Legal Page', 'Contact Page'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPages(mockPages);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || page.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Content Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage website content and pages
        </p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <label htmlFor="search" className="sr-only">
            Search pages
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
              placeholder="Search pages"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="w-full sm:w-48">
          <select
            id="type"
            name="type"
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {pageTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-full sm:w-auto sm:ml-auto">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Create Page
          </button>
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
                        Title
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        URL
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Type
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Last Updated
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredPages.map((page) => (
                      <tr key={page.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {page.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{page.slug}</code>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{page.type}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            page.status === 'Published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {page.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(page.lastUpdated)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            type="button"
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Preview
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
