import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  PencilIcon, 
  CheckIcon, 
  StarIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const ProviderProfile = () => {
  const { user } = useAuth();
  const { userProfile, updateUserProfile } = useApp();
  
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [projects, setProjects] = useState([]);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    company_name: '',
    phone: '',
    bio: '',
    services: [],
    years_experience: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        company_name: userProfile.company_name || '',
        phone: userProfile.phone || '',
        bio: userProfile.bio || '',
        services: userProfile.services || [],
        years_experience: userProfile.years_experience || '',
        website: userProfile.website || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        zip: userProfile.zip || ''
      });
      
      fetchReviews();
      fetchProjects();
    }
  }, [userProfile]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch reviews from your database
      // For demo purposes, we'll use mock data
      
      // Mock reviews data
      const mockReviews = [
        {
          id: 1,
          client: 'Emily Wilson',
          client_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          rating: 5,
          comment: 'Excellent work! Very professional and completed the job ahead of schedule. The quality of work was outstanding and they were very clean and respectful of our home.',
          date: new Date(2023, 4, 10),
          project: 'Interior Painting'
        },
        {
          id: 2,
          client: 'David Lee',
          client_avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          rating: 4,
          comment: 'Good quality work and reasonable pricing. Would hire again for future projects. They were a bit late on the first day but made up for it by working longer hours.',
          date: new Date(2023, 4, 5),
          project: 'Roof Repair'
        },
        {
          id: 3,
          client: 'Sarah Johnson',
          client_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          rating: 5,
          comment: 'I am extremely satisfied with the bathroom remodel. The attention to detail was impressive and they were very responsive to my questions and concerns throughout the project.',
          date: new Date(2023, 3, 20),
          project: 'Bathroom Remodel'
        },
        {
          id: 4,
          client: 'John Smith',
          client_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          rating: 4,
          comment: 'The kitchen renovation turned out beautifully. They were knowledgeable and provided helpful suggestions throughout the process. The only reason for 4 stars instead of 5 is that the project took a bit longer than initially estimated.',
          date: new Date(2023, 3, 15),
          project: 'Kitchen Renovation'
        }
      ];
      
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      // In a real app, you would fetch projects from your database
      // For demo purposes, we'll use mock data
      
      // Mock projects data
      const mockProjects = [
        {
          id: 1,
          title: 'Modern Kitchen Renovation',
          description: 'Complete kitchen renovation with custom cabinets, quartz countertops, and new appliances.',
          image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          date: new Date(2023, 3, 15),
          client: 'John Smith',
          location: 'Anytown, CA'
        },
        {
          id: 2,
          title: 'Bathroom Remodel',
          description: 'Full bathroom remodel including new shower, vanity, toilet, and tile work.',
          image: 'https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          date: new Date(2023, 3, 20),
          client: 'Sarah Johnson',
          location: 'Somewhere, CA'
        },
        {
          id: 3,
          title: 'Deck Installation',
          description: 'Built a new cedar deck with railings and stairs in the backyard.',
          image: 'https://images.pexels.com/photos/5997993/pexels-photo-5997993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          date: new Date(2023, 4, 5),
          client: 'Michael Brown',
          location: 'Nowhere, CA'
        },
        {
          id: 4,
          title: 'Interior Painting',
          description: 'Painted living room, dining room, and hallway with premium paint.',
          image: 'https://images.pexels.com/photos/6444256/pexels-photo-6444256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          date: new Date(2023, 4, 10),
          client: 'Emily Wilson',
          location: 'Anytown, CA'
        }
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (service) => {
    const updatedServices = formData.services.includes(service)
      ? formData.services.filter(s => s !== service)
      : [...formData.services, service];
    
    setFormData({ ...formData, services: updatedServices });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // In a real app, you would update the profile in your database
      // For demo purposes, we'll just update the local state
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update profile
      // const { data, error } = await updateUserProfile(formData);
      
      // if (error) throw error;
      
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render stars for ratings
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        aria-hidden="true" 
      />
    ));
  };

  // Format date
  const formatDate = (date) => {
    return format(date, 'MMM d, yyyy');
  };

  // Available services
  const availableServices = [
    'Kitchen Renovation',
    'Bathroom Remodeling',
    'Deck Building',
    'Painting',
    'Flooring',
    'Electrical',
    'Plumbing',
    'Roofing',
    'Landscaping',
    'Carpentry'
  ];

  if (loading && !userProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Profile header */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="relative h-40 bg-blue-600">
            <button
              type="button"
              className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-75 text-gray-700 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CameraIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-end -mt-16">
            <div className="flex-shrink-0 relative">
              <img
                className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                src={userProfile?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                alt=""
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 p-1 rounded-full bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <CameraIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 sm:mt-0 sm:ml-6 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {userProfile?.first_name} {userProfile?.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{userProfile?.company_name || 'Your Company Name'}</p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setEditing(!editing)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    Edit Profile
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {renderStars(4.5)}
                </div>
                <span className="ml-2 text-sm text-gray-500">4.5 out of 5 stars ({reviews.length} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile content */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile information */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                {!editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
              </div>
              {editing ? (
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                            First name
                          </label>
                          <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                            Last name
                          </label>
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                          Company name
                        </label>
                        <input
                          type="text"
                          name="company_name"
                          id="company_name"
                          value={formData.company_name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={3}
                          value={formData.bio}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700">
                          Years of experience
                        </label>
                        <input
                          type="number"
                          name="years_experience"
                          id="years_experience"
                          value={formData.years_experience}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                          Website
                        </label>
                        <input
                          type="text"
                          name="website"
                          id="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            id="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            id="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                            ZIP
                          </label>
                          <input
                            type="text"
                            name="zip"
                            id="zip"
                            value={formData.zip}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Services</label>
                        <div className="mt-2 grid grid-cols-1 gap-y-2 sm:grid-cols-2">
                          {availableServices.map((service) => (
                            <div key={service} className="flex items-center">
                              <input
                                id={`service-${service}`}
                                name={`service-${service}`}
                                type="checkbox"
                                checked={formData.services.includes(service)}
                                onChange={() => handleServiceChange(service)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`service-${service}`} className="ml-3 text-sm text-gray-700">
                                {service}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {loading ? (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        )}
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Full name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {formData.first_name} {formData.last_name}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Company name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {formData.company_name || 'Not specified'}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Email address</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {user?.email}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {formData.phone || 'Not specified'}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Bio</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {formData.bio || 'No bio provided'}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Years of experience</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {formData.years_experience || 'Not specified'}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Website</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {formData.website ? (
                          <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                            {formData.website}
                          </a>
                        ) : (
                          'Not specified'
                        )}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {formData.address ? (
                          <>
                            {formData.address}<br />
                            {formData.city}, {formData.state} {formData.zip}
                          </>
                        ) : (
                          'Not specified'
                        )}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Services</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {formData.services && formData.services.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {formData.services.map((service) => (
                              <span
                                key={service}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        ) : (
                          'No services specified'
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </div>

          {/* Reviews and projects */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reviews */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Reviews</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  4.5 / 5
                </span>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <li key={review.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={review.client_avatar}
                            alt={review.client}
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{review.client}</p>
                            <p className="text-xs text-gray-500">{formatDate(review.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {review.project}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Projects */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Projects</h3>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
                  Add Project
                </button>
              </div>
              <div className="border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="px-4 py-4">
                        <h4 className="text-lg font-medium text-gray-900">{project.title}</h4>
                        <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-xs text-gray-500">{formatDate(project.date)}</p>
                          <p className="text-xs text-gray-500">{project.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
