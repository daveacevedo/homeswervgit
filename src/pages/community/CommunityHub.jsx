import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CommunityHub = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with actual data fetching from Supabase
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock categories
        setCategories([
          { id: 'kitchen', name: 'Kitchen' },
          { id: 'bathroom', name: 'Bathroom' },
          { id: 'outdoor', name: 'Outdoor' },
          { id: 'living', name: 'Living Room' },
          { id: 'bedroom', name: 'Bedroom' },
          { id: 'basement', name: 'Basement' }
        ]);
        
        // Mock projects
        setProjects([
          {
            id: 1,
            title: 'Modern Kitchen Renovation',
            description: 'Complete kitchen remodel with custom cabinets and quartz countertops.',
            category: 'kitchen',
            image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            author: 'John Smith',
            likes: 42,
            comments: 12,
            date: '2023-11-15'
          },
          {
            id: 2,
            title: 'Backyard Patio Makeover',
            description: 'Transformed our backyard with a new paver patio, pergola, and fire pit.',
            category: 'outdoor',
            image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            author: 'Sarah Johnson',
            likes: 38,
            comments: 8,
            date: '2023-11-10'
          },
          {
            id: 3,
            title: 'Spa-Like Bathroom Remodel',
            description: 'Complete bathroom renovation with walk-in shower, freestanding tub, and heated floors.',
            category: 'bathroom',
            image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            author: 'Michael Brown',
            likes: 56,
            comments: 15,
            date: '2023-11-05'
          },
          {
            id: 4,
            title: 'Cozy Living Room Redesign',
            description: 'Updated our living room with new furniture, lighting, and a custom built-in entertainment center.',
            category: 'living',
            image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            author: 'Emily Davis',
            likes: 29,
            comments: 7,
            date: '2023-10-28'
          },
          {
            id: 5,
            title: 'Master Bedroom Retreat',
            description: 'Transformed our master bedroom with a new color scheme, furniture, and custom closet system.',
            category: 'bedroom',
            image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            author: 'Robert Wilson',
            likes: 34,
            comments: 9,
            date: '2023-10-20'
          },
          {
            id: 6,
            title: 'Basement Home Theater',
            description: 'Converted our unfinished basement into a home theater with custom seating and sound system.',
            category: 'basement',
            image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            author: 'Jennifer Lee',
            likes: 47,
            comments: 14,
            date: '2023-10-15'
          }
        ]);
      } catch (error) {
        console.error('Error fetching community data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommunityData();
  }, []);

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Community Inspiration Hub
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover amazing home improvement projects shared by our community.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All Projects
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Projects Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  <Link to={`/community/project/${project.id}`} className="hover:text-primary-600">
                    {project.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                        {project.author.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-900">{project.author}</p>
                      <p className="text-xs text-gray-500">{new Date(project.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {project.likes}
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      {project.comments}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to={`/community/project/${project.id}`} className="font-medium text-primary-600 hover:text-primary-500">
                    View project details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Share Your Project CTA */}
        <div className="mt-12 bg-primary-50 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Share your own project
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>
                    Inspire others by sharing your home improvement journey with the community.
                  </p>
                </div>
              </div>
              <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                >
                  {user ? 'Share a Project' : 'Sign in to Share'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
