import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  ChatBubbleLeftRightIcon, 
  HeartIcon, 
  ShareIcon,
  HandThumbUpIcon,
  UserGroupIcon,
  PhotoIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const CommunityHub = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch projects from your database
      // For demo purposes, we'll use mock data
      
      // Mock projects data
      const mockProjects = [
        {
          id: 1,
          title: 'Modern Kitchen Renovation',
          description: 'Complete kitchen renovation with custom cabinets, quartz countertops, and new appliances.',
          author: 'John Smith',
          authorRole: 'homeowner',
          authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          date: new Date(2023, 3, 15),
          category: 'kitchen',
          images: [
            'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          ],
          likes: 24,
          comments: 8,
          shares: 3
        },
        {
          id: 2,
          title: 'Backyard Deck and Landscaping',
          description: 'Built a new cedar deck and completely redesigned the backyard with native plants and a stone pathway.',
          author: 'Sarah Johnson',
          authorRole: 'homeowner',
          authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          date: new Date(2023, 3, 20),
          category: 'outdoor',
          images: [
            'https://images.pexels.com/photos/5997993/pexels-photo-5997993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          ],
          likes: 32,
          comments: 12,
          shares: 5
        },
        {
          id: 3,
          title: 'Bathroom Remodel Tips',
          description: 'Professional tips for remodeling your bathroom on a budget while still achieving a luxury look.',
          author: 'Michael Brown',
          authorRole: 'provider',
          authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          date: new Date(2023, 3, 25),
          category: 'bathroom',
          images: [
            'https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          ],
          likes: 45,
          comments: 18,
          shares: 10
        },
        {
          id: 4,
          title: 'DIY Living Room Makeover',
          description: 'How I transformed my living room with just paint, new curtains, and rearranging furniture. Budget-friendly tips included!',
          author: 'Emily Wilson',
          authorRole: 'homeowner',
          authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          date: new Date(2023, 4, 2),
          category: 'living',
          images: [
            'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          ],
          likes: 38,
          comments: 15,
          shares: 7
        },
        {
          id: 5,
          title: 'Energy-Efficient Home Upgrades',
          description: 'Sharing my experience installing solar panels, upgrading insulation, and replacing windows to create an energy-efficient home.',
          author: 'David Lee',
          authorRole: 'homeowner',
          authorAvatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          date: new Date(2023, 4, 5),
          category: 'energy',
          images: [
            'https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          ],
          likes: 29,
          comments: 11,
          shares: 8
        },
        {
          id: 6,
          title: 'Professional Painting Techniques',
          description: 'Learn the techniques professionals use to get perfect paint results every time. From prep work to final touches.',
          author: 'Jennifer Garcia',
          authorRole: 'provider',
          authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          date: new Date(2023, 4, 8),
          category: 'painting',
          images: [
            'https://images.pexels.com/photos/6444256/pexels-photo-6444256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          ],
          likes: 52,
          comments: 23,
          shares: 15
        }
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on category and search term
  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Get category badge
  const getCategoryBadge = (category) => {
    const categories = {
      kitchen: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Kitchen' },
      bathroom: { bg: 'bg-green-100', text: 'text-green-800', label: 'Bathroom' },
      outdoor: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Outdoor' },
      living: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Living Room' },
      energy: { bg: 'bg-red-100', text: 'text-red-800', label: 'Energy Efficiency' },
      painting: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Painting' }
    };
    
    const categoryInfo = categories[category] || { bg: 'bg-gray-100', text: 'text-gray-800', label: category };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.bg} ${categoryInfo.text}`}>
        {categoryInfo.label}
      </span>
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
        <h1 className="text-2xl font-semibold text-gray-900">Community Hub</h1>
        <p className="mt-2 text-sm text-gray-700">
          Share your home improvement projects, get inspired, and connect with others.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Filters and search */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div>
                <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
                  Filter by category
                </label>
                <select
                  id="filter"
                  name="filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="bathroom">Bathroom</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="living">Living Room</option>
                  <option value="energy">Energy Efficiency</option>
                  <option value="painting">Painting</option>
                </select>
              </div>
            </div>
            <div className="w-full md:w-64">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Create post button */}
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PhotoIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Share Your Project
          </button>
        </div>

        {/* Projects grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={project.authorAvatar}
                        alt={project.author}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">{project.author}</h3>
                        {project.authorRole === 'provider' && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Pro
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(project.date)}</p>
                    </div>
                    <div className="ml-auto">
                      {getCategoryBadge(project.category)}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link to={`/community/project/${project.id}`} className="text-lg font-medium text-blue-600 hover:text-blue-500">
                      {project.title}
                    </Link>
                    <p className="mt-2 text-sm text-gray-500">{project.description}</p>
                  </div>
                  {project.images.length > 0 && (
                    <div className="mt-4">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="h-64 w-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="mt-4 flex justify-between">
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        <HandThumbUpIcon className="h-5 w-5 mr-1 text-gray-400" />
                        <span>{project.likes}</span>
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-1 text-gray-400" />
                        <span>{project.comments}</span>
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        <ShareIcon className="h-5 w-5 mr-1 text-gray-400" />
                        <span>{project.shares}</span>
                      </button>
                    </div>
                    <Link
                      to={`/community/project/${project.id}`}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="lg:col-span-2 bg-white overflow-hidden shadow rounded-lg p-6 text-center text-gray-500">
              No projects found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
