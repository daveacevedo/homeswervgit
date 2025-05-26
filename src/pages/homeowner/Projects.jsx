import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Kitchen Renovation',
      description: 'Complete kitchen remodel with new cabinets, countertops, and appliances',
      status: 'in-progress',
      budget: '$15,000',
      startDate: '2023-10-15',
      endDate: '2023-12-20',
      progress: 65,
      providers: [
        { id: 101, name: 'Elite Cabinets', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { id: 102, name: 'Modern Plumbing', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100' }
      ]
    },
    {
      id: 2,
      title: 'Bathroom Remodel',
      description: 'Master bathroom renovation with new shower, vanity, and flooring',
      status: 'planning',
      budget: '$8,500',
      startDate: '2024-01-10',
      endDate: '2024-02-15',
      progress: 15,
      providers: [
        { id: 103, name: 'Luxury Baths', avatar: 'https://images.pexels.com/photos/2379006/pexels-photo-2379006.jpeg?auto=compress&cs=tinysrgb&w=100' }
      ]
    },
    {
      id: 3,
      title: 'Deck Construction',
      description: 'New backyard deck with composite decking and railing',
      status: 'completed',
      budget: '$7,200',
      startDate: '2023-05-01',
      endDate: '2023-06-15',
      progress: 100,
      providers: [
        { id: 104, name: 'Outdoor Living Pros', avatar: 'https://images.pexels.com/photos/2379007/pexels-photo-2379007.jpeg?auto=compress&cs=tinysrgb&w=100' }
      ]
    }
  ]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
          Create New Project
        </button>
      </div>

      {/* Project filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        </div>
        <div className="p-4 flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
              <option value="">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
              <option value="">All Time</option>
              <option value="this-month">This Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="last-6-months">Last 6 Months</option>
              <option value="this-year">This Year</option>
            </select>
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
            <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
              <option value="">All Budgets</option>
              <option value="under-5000">Under $5,000</option>
              <option value="5000-10000">$5,000 - $10,000</option>
              <option value="10000-25000">$10,000 - $25,000</option>
              <option value="over-25000">Over $25,000</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {projects.map((project) => (
            <li key={project.id} className="hover:bg-gray-50">
              <Link to={`/homeowner/projects/${project.id}`} className="block">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-lg font-medium text-blue-600 truncate">{project.title}</p>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="text-sm text-gray-500">{project.budget}</p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {project.description}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {project.startDate} to {project.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            Progress
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div style={{ width: `${project.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="flex -space-x-2 overflow-hidden">
                      {project.providers.map((provider) => (
                        <img
                          key={provider.id}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                          src={provider.avatar}
                          alt={provider.name}
                        />
                      ))}
                    </div>
                    <div className="ml-2 text-sm text-gray-500">
                      {project.providers.length === 1 
                        ? '1 provider assigned' 
                        : `${project.providers.length} providers assigned`}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Projects;
