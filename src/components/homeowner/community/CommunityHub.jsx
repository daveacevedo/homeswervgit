import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { CommunityService } from '../../../lib/community';

export default function CommunityHub() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [userLikes, setUserLikes] = useState({});
  const [popularTags, setPopularTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  
  useEffect(() => {
    // Check if this is the user's first visit to the community hub
    const hasVisitedCommunity = localStorage.getItem('hasVisitedCommunity');
    if (!hasVisitedCommunity) {
      setShowOnboarding(true);
      localStorage.setItem('hasVisitedCommunity', 'true');
    }
    
    fetchPosts();
    fetchUserLikes();
    fetchPopularTags();
  }, [filter]);
  
  async function fetchPosts() {
    try {
      setLoading(true);
      setError(null);
      
      const options = {};
      
      if (filter !== 'all') {
        if (filter === 'featured') {
          options.featured = true;
        } else {
          options.tag = filter;
        }
      }
      
      const data = await CommunityService.getPosts(options);
      
      // Apply search filter if query exists
      const filteredData = searchQuery 
        ? data.filter(post => 
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
          )
        : data;
        
      setPosts(filteredData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  async function fetchUserLikes() {
    try {
      // For each post, check if the user has liked it
      const likes = {};
      
      for (const post of posts) {
        const hasLiked = await CommunityService.hasUserLikedPost(post.id);
        likes[post.id] = hasLiked;
      }
      
      setUserLikes(likes);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  }
  
  async function fetchPopularTags() {
    try {
      const tags = await CommunityService.getPopularTags(10);
      setPopularTags(tags);
    } catch (error) {
      console.error('Error fetching popular tags:', error);
    }
  }
  
  const handleLikePost = async (postId) => {
    try {
      if (userLikes[postId]) {
        await CommunityService.unlikePost(postId);
        setUserLikes({ ...userLikes, [postId]: false });
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes_count: post.likes_count - 1 } 
            : post
        ));
      } else {
        await CommunityService.likePost(postId);
        setUserLikes({ ...userLikes, [postId]: true });
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes_count: post.likes_count + 1 } 
            : post
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };
  
  const nextOnboardingStep = () => {
    if (onboardingStep < 3) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
    }
  };
  
  const skipOnboarding = () => {
    setShowOnboarding(false);
  };
  
  return (
    <div className="bg-white min-h-screen">
      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Welcome to the Community Hub!
              </h3>
              
              {onboardingStep === 1 && (
                <div className="space-y-4">
                  <img 
                    src="https://images.pexels.com/photos/7937386/pexels-photo-7937386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Community Hub" 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <p className="text-gray-600">
                    Discover inspiration from other homeowners and share your own projects with the community.
                  </p>
                </div>
              )}
              
              {onboardingStep === 2 && (
                <div className="space-y-4">
                  <img 
                    src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Share Projects" 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <p className="text-gray-600">
                    Share your renovation projects, get feedback, and connect with other homeowners in your area.
                  </p>
                </div>
              )}
              
              {onboardingStep === 3 && (
                <div className="space-y-4">
                  <img 
                    src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Find Inspiration" 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <p className="text-gray-600">
                    Save ideas to your vision board and find the perfect inspiration for your next home project.
                  </p>
                </div>
              )}
              
              <div className="mt-6 flex justify-between">
                <button
                  onClick={skipOnboarding}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Skip
                </button>
                <button
                  onClick={nextOnboardingStep}
                  className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  {onboardingStep === 3 ? 'Get Started' : 'Next'}
                </button>
              </div>
              
              <div className="mt-4 flex justify-center space-x-2">
                {[1, 2, 3].map((step) => (
                  <div 
                    key={step}
                    className={`h-2 w-2 rounded-full ${onboardingStep === step ? 'bg-primary-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-5 pt-24">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#3361E1]">Community Inspiration Hub</h1>
          <div className="flex items-center mt-4 md:mt-0">
            <Link
              to="/community/new"
              className="inline-flex items-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Share Your Project
            </Link>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="mt-6 mb-8">
          <form onSubmit={handleSearch} className="flex w-full md:max-w-md">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full rounded-l-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                placeholder="Search projects, tags, or ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center rounded-r-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Search
            </button>
          </form>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-[#3361E1] mb-4">Categories</h3>
                <ul className="space-y-3">
                  <li>
                    <button
                      className={`text-sm w-full text-left px-3 py-2 rounded-md ${filter === 'all' ? 'bg-primary-50 font-medium text-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
                      onClick={() => setFilter('all')}
                    >
                      All Projects
                    </button>
                  </li>
                  <li>
                    <button
                      className={`text-sm w-full text-left px-3 py-2 rounded-md ${filter === 'featured' ? 'bg-primary-50 font-medium text-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
                      onClick={() => setFilter('featured')}
                    >
                      Featured
                    </button>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-[#3361E1] mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tagData) => (
                    <button
                      key={tagData.tag}
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm ${
                        filter === tagData.tag
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      onClick={() => setFilter(tagData.tag)}
                    >
                      {tagData.tag}
                      <span className="ml-1 text-xs text-gray-500">({tagData.count})</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-[#3361E1] mb-4">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Looking for inspiration or have questions about your project?
                </p>
                <button
                  className="w-full inline-flex justify-center items-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  Ask AI Concierge
                </button>
              </div>
            </div>
          </div>
          
          {/* Posts grid */}
          <div className="lg:col-span-3">
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3361E1]"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No posts found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter !== 'all' ? 'Try a different filter or ' : ''}
                  Get started by sharing your own project.
                </p>
                <div className="mt-6">
                  <Link
                    to="/community/new"
                    className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                  >
                    <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                    Share Your Project
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {filter === 'all' ? 'All Projects' : 
                     filter === 'featured' ? 'Featured Projects' : 
                     `Projects tagged with "${filter}"`}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({posts.length} {posts.length === 1 ? 'project' : 'projects'})
                    </span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <div key={post.id} className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
                      <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-t-lg bg-gray-100">
                        <Link to={`/community/posts/${post.id}`}>
                          {post.images && post.images.length > 0 ? (
                            <img
                              src={post.images[0]}
                              alt={post.title}
                              className="object-cover object-center h-48 w-full group-hover:opacity-90 transition-opacity duration-300"
                            />
                          ) : (
                            <div className="flex h-48 w-full items-center justify-center bg-gray-200">
                              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </Link>
                        {post.is_featured && (
                          <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900 line-clamp-1">
                              <Link to={`/community/posts/${post.id}`}>
                                <span aria-hidden="true" className="absolute inset-0" />
                                {post.title}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {post.user?.user_metadata?.full_name || post.user?.email?.split('@')[0]}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex space-x-4">
                          <button
                            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                            onClick={() => handleLikePost(post.id)}
                          >
                            {userLikes[post.id] ? (
                              <HeartIconSolid className="h-4 w-4 text-red-500 mr-1" />
                            ) : (
                              <HeartIcon className="h-4 w-4 mr-1" />
                            )}
                            {post.likes_count}
                          </button>
                          <Link
                            to={`/community/posts/${post.id}`}
                            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                          >
                            <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                            {post.comments_count}
                          </Link>
                          <button className="flex items-center text-sm text-gray-500 hover:text-gray-700 ml-auto">
                            <ShareIcon className="h-4 w-4" />
                          </button>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around items-center h-16">
          <Link to="/dashboard" className="flex flex-col items-center justify-center w-full h-full text-[#3361E1]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/projects" className="flex flex-col items-center justify-center w-full h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs mt-1">Projects</span>
          </Link>
          <Link to="/providers" className="flex flex-col items-center justify-center w-full h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs mt-1">Providers</span>
          </Link>
          <Link to="/deals" className="flex flex-col items-center justify-center w-full h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs mt-1">Deals</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center justify-center w-full h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
