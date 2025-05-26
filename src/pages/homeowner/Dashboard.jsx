import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HomeownerDashboard = () => {
  const { user, homeownerProfile, supabase } = useAuth();
  const [projects, setProjects] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // This would be replaced with actual data fetching from Supabase
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock projects data
        setProjects([
          {
            id: 1,
            title: 'Kitchen Renovation',
            status: 'In Progress',
            progress: 65,
            provider: 'ABC Contractors',
            dueDate: '2023-12-15'
          },
          {
            id: 2,
            title: 'Bathroom Remodel',
            status: 'Planning',
            progress: 20,
            provider: 'XYZ Home Services',
            dueDate: '2024-01-10'
          },
          {
            id: 3,
            title: 'Backyard Landscaping',
            status: 'Completed',
            progress: 100,
            provider: 'Green Thumb Landscaping',
            dueDate: '2023-11-30'
          }
        ]);
        
        // Mock recommended providers
        setProviders([
          {
            id: 1,
            name: 'John\'s Plumbing',
            category: 'Plumbing',
            rating: 4.8,
            reviews: 56,
            image: 'https://images.pexels.com/photos/8486972/pexels-photo-8486972.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          },
          {
            id: 2,
            name: 'Elite Electrical',
            category: 'Electrical',
            rating: 4.7,
            reviews: 42,
            image: 'https://images.pexels.com/photos/8961438/pexels-photo-8961438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          },
          {
            id: 3,
            name: 'Perfect Paint',
            category: 'Painting',
            rating: 4.9,
            reviews: 78,
            image: 'https://images.pexels.com/photos/6474343/pexels-photo-6474343.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Homeowner Dashboard</h1>
        
        {/* Welcome Section */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Welcome back, {user?.email?.split('@')[0] || 'Homeowner'}!
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Track your home improvement projects, find trusted service providers, and get inspired with project ideas.
              </p>
            </div>
            <div className="mt-5">
              <Link
                to="/homeowner/projects"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </div>
        
        {/* Projects Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Your Projects</h2>
            <Link
              to="/homeowner/projects"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all
            </Link>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{project.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : project.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          project.status === 'Completed' 
                            ? 'bg-green-500' 
                            : 'bg-primary-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                      {project.provider}
                    </div>
                    <div className="text-gray-500">
                      Due {new Date(project.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link to={`/homeowner/projects/${project.id}`} className="font-medium text-primary-600 hover:text-primary-500">
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Project Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg border-2 border-dashed border-gray-300">
              <div className="px-4 py-5 sm:p-6 flex flex-col items-center justify-center text-center h-full">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Start a new project</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started on your next home improvement project.
                </p>
                <div className="mt-6">
                  <Link
                    to="/homeowner/projects/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    New Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommended Providers */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recommended Providers</h2>
            <Link
              to="/homeowner/providers"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all
            </Link>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <div key={provider.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="h-48 w-full overflow-hidden">
                  <img 
                    src={provider.image} 
                    alt={provider.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">{provider.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{provider.category}</p>
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.floor(provider.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="ml-2 text-sm text-gray-500">{provider.rating} ({provider.reviews} reviews)</p>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link to={`/homeowner/providers/${provider.id}`} className="font-medium text-primary-600 hover:text-primary-500">
                      View profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Community Inspiration */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Community Inspiration</h2>
            <Link
              to="/community"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Explore more
            </Link>
          </div>
          
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="relative rounded-lg overflow-hidden h-48">
                  <img 
                    src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Modern Kitchen" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h4 className="text-white font-medium">Modern Kitchens</h4>
                  </div>
                </div>
                
                <div className="relative rounded-lg overflow-hidden h-48">
                  <img 
                    src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Bathroom Ideas" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h4 className="text-white font-medium">Bathroom Ideas</h4>
                  </div>
                </div>
                
                <div className="relative rounded-lg overflow-hidden h-48">
                  <img 
                    src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Outdoor Spaces" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h4 className="text-white font-medium">Outdoor Spaces</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeownerDashboard;
