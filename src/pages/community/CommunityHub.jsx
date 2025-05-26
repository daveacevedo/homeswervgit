import React from 'react';
import { Link } from 'react-router-dom';

function CommunityHub() {
  // Sample data for community projects
  const featuredProjects = [
    {
      id: 1,
      title: 'Modern Kitchen Renovation',
      description: 'Complete kitchen remodel with custom cabinets and marble countertops',
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      author: 'Sarah Johnson',
      likes: 245,
      comments: 32,
    },
    {
      id: 2,
      title: 'Backyard Oasis',
      description: 'Transformed a plain backyard into a relaxing retreat with pool and landscaping',
      image: 'https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      author: 'Michael Rodriguez',
      likes: 189,
      comments: 24,
    },
    {
      id: 3,
      title: 'Bathroom Spa Makeover',
      description: 'Luxury bathroom renovation with walk-in shower and freestanding tub',
      image: 'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      author: 'Emily Chen',
      likes: 156,
      comments: 18,
    },
  ];

  const recentProjects = [
    {
      id: 4,
      title: 'DIY Floating Shelves',
      description: 'Easy weekend project to add storage and style to any room',
      image: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      author: 'David Wilson',
      likes: 87,
      comments: 12,
    },
    {
      id: 5,
      title: 'Front Yard Landscaping',
      description: 'Boosted curb appeal with new plants, mulch, and lighting',
      image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      author: 'Jessica Martinez',
      likes: 112,
      comments: 15,
    },
    {
      id: 6,
      title: 'Home Office Conversion',
      description: 'Transformed a spare bedroom into a productive workspace',
      image: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      author: 'Robert Taylor',
      likes: 94,
      comments: 8,
    },
    {
      id: 7,
      title: 'Basement Entertainment Room',
      description: 'Created the ultimate movie and game room for family fun',
      image: 'https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      author: 'Amanda Johnson',
      likes: 76,
      comments: 10,
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-blue-700">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="People working on home projects"
          />
          <div className="absolute inset-0 bg-blue-700 mix-blend-multiply" aria-hidden="true" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Community Inspiration Hub</h1>
          <p className="mt-6 max-w-3xl text-xl text-blue-100">
            Discover amazing home improvement projects, share your own transformations, and connect with a community of homeowners and professionals.
          </p>
          <div className="mt-10 flex space-x-4">
            <a
              href="#featured"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50"
            >
              Explore Projects
            </a>
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 bg-opacity-60 hover:bg-opacity-70"
            >
              Share Your Project
            </a>
          </div>
        </div>
      </div>

      {/* Featured projects section */}
      <div id="featured" className="relative pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Featured Projects</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Check out these amazing transformations from our community members
            </p>
          </div>
          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {featuredProjects.map((project) => (
              <div key={project.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-shrink-0">
                  <img className="h-48 w-full object-cover" src={project.image} alt={project.title} />
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <Link to={`/community/project/${project.id}`} className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900">{project.title}</p>
                      <p className="mt-3 text-base text-gray-500">{project.description}</p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <span className="sr-only">{project.author}</span>
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`https://ui-avatars.com/api/?name=${project.author.replace(' ', '+')}&background=random`}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{project.author}</p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <span>{project.likes} likes</span>
                        <span aria-hidden="true">&middot;</span>
                        <span>{project.comments} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent projects section */}
      <div className="bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="relative max-w-7xl mx-auto divide-y-2 divide-gray-200">
          <div>
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Recent Projects</h2>
            <p className="mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
              The latest home improvement projects from our community
            </p>
          </div>
          <div className="mt-6 pt-10 grid gap-16 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-12">
            {recentProjects.map((project) => (
              <div key={project.id}>
                <Link to={`/community/project/${project.id}`} className="mt-2 block">
                  <p className="text-xl font-semibold text-gray-900">{project.title}</p>
                  <p className="mt-3 text-base text-gray-500">{project.description}</p>
                </Link>
                <div className="mt-3">
                  <Link
                    to={`/community/project/${project.id}`}
                    className="text-base font-semibold text-blue-600 hover:text-blue-500"
                  >
                    View project
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="sr-only">{project.author}</span>
                    <img
                      className="h-10 w-10 rounded-full"
                      src={`https://ui-avatars.com/api/?name=${project.author.replace(' ', '+')}&background=random`}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{project.author}</p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <span>{project.likes} likes</span>
                      <span aria-hidden="true">&middot;</span>
                      <span>{project.comments} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Browse by Category</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Find inspiration for any project
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Explore projects by room, style, or type of renovation
            </p>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
              <div className="col-span-1 flex justify-center items-center">
                <a href="#" className="text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="text-base font-medium text-gray-900 mt-2">Kitchen</div>
                </a>
              </div>
              <div className="col-span-1 flex justify-center items-center">
                <a href="#" className="text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <div className="text-base font-medium text-gray-900 mt-2">Bathroom</div>
                </a>
              </div>
              <div className="col-span-1 flex justify-center items-center">
                <a href="#" className="text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div className="text-base font-medium text-gray-900 mt-2">Outdoor</div>
                </a>
              </div>
              <div className="col-span-1 flex justify-center items-center">
                <a href="#" className="text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="text-base font-medium text-gray-900 mt-2">Living Room</div>
                </a>
              </div>
              <div className="col-span-1 flex justify-center items-center">
                <a href="#" className="text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-base font-medium text-gray-900 mt-2">Bedroom</div>
                </a>
              </div>
              <div className="col-span-1 flex justify-center items-center">
                <a href="#" className="text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div className="text-base font-medium text-gray-900 mt-2">DIY</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to share your project?</span>
            <span className="block">Join our community today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Share your home improvement journey, get feedback from professionals, and inspire others.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CommunityHub;
