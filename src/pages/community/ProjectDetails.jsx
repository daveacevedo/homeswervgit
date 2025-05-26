import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProjectDetails() {
  const { id } = useParams();
  const [comment, setComment] = useState('');
  
  // Sample project data - in a real app, this would come from an API call
  const project = {
    id: parseInt(id),
    title: 'Modern Kitchen Renovation',
    description: 'Complete kitchen remodel with custom cabinets and marble countertops. This project took 6 weeks to complete and transformed our outdated kitchen into a modern cooking space that's perfect for entertaining.',
    images: [
      'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3926544/pexels-photo-3926544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      projects: 8,
    },
    details: {
      budget: '$25,000',
      duration: '6 weeks',
      completionDate: 'March 15, 2023',
      location: 'Seattle, WA',
    },
    materials: [
      'Custom maple cabinets',
      'Carrara marble countertops',
      'Subway tile backsplash',
      'Stainless steel appliances',
      'Hardwood flooring',
      'LED recessed lighting',
    ],
    steps: [
      {
        title: 'Planning and Design',
        description: 'Worked with a kitchen designer to create the layout and select materials.',
      },
      {
        title: 'Demolition',
        description: 'Removed old cabinets, countertops, and flooring.',
      },
      {
        title: 'Plumbing and Electrical',
        description: 'Updated plumbing for the sink and dishwasher. Added new electrical for lighting and appliances.',
      },
      {
        title: 'Cabinet Installation',
        description: 'Installed custom cabinets and added soft-close hardware.',
      },
      {
        title: 'Countertops and Backsplash',
        description: 'Installed marble countertops and subway tile backsplash.',
      },
      {
        title: 'Finishing Touches',
        description: 'Installed new appliances, lighting, and hardware.',
      },
    ],
    tips: [
      'Always add 20% to your budget for unexpected expenses',
      'Choose materials that are both beautiful and functional',
      'Consider the workflow when designing your layout',
      'Invest in quality appliances that will last',
    ],
    comments: [
      {
        id: 1,
        author: 'Michael Rodriguez',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        text: 'This looks amazing! I love the marble countertops. How are they holding up with stains?',
        date: '2 days ago',
      },
      {
        id: 2,
        author: 'Emily Chen',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        text: 'Beautiful transformation! Did you have any issues with the cabinet delivery timeline?',
        date: '1 week ago',
      },
    ],
    likes: 245,
    saves: 128,
    views: 1892,
    tags: ['Kitchen', 'Renovation', 'Modern', 'Marble', 'Custom Cabinets'],
    providers: [
      {
        name: 'Elite Cabinets',
        service: 'Cabinet Installation',
        rating: 4.9,
      },
      {
        name: 'Stone Masters',
        service: 'Countertop Installation',
        rating: 4.8,
      },
    ],
  };
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the comment to an API
    alert('Comment submitted: ' + comment);
    setComment('');
  };
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex py-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <div>
                <Link to="/" className="text-gray-400 hover:text-gray-500">
                  <svg className="flex-shrink-0 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="sr-only">Home</span>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <Link to="/community" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">Community</Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <span className="ml-4 text-sm font-medium text-gray-500" aria-current="page">{project.title}</span>
              </div>
            </li>
          </ol>
        </nav>
        
        {/* Project header */}
        <div className="border-b border-gray-200 pb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{project.title}</h1>
          <div className="mt-4 flex items-center">
            <div className="flex-shrink-0">
              <img className="h-10 w-10 rounded-full" src={project.author.avatar} alt={project.author.name} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{project.author.name}</p>
              <p className="text-sm text-gray-500">{project.author.projects} projects</p>
            </div>
            <div className="ml-auto flex space-x-4">
              <button type="button" className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Like ({project.likes})
              </button>
              <button type="button" className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save ({project.saves})
              </button>
              <button type="button" className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
        
        {/* Project content */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="col-span-2">
                <img src={project.images[0]} alt={project.title} className="w-full h-96 object-cover rounded-lg" />
              </div>
              <div>
                <img src={project.images[1]} alt={project.title} className="w-full h-64 object-cover rounded-lg" />
              </div>
              <div>
                <img src={project.images[2]} alt={project.title} className="w-full h-64 object-cover rounded-lg" />
              </div>
            </div>
            
            {/* Description */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900">Description</h2>
              <div className="mt-4 text-gray-700">
                <p>{project.description}</p>
              </div>
            </div>
            
            {/* Steps */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900">Project Steps</h2>
              <div className="mt-4 flow-root">
                <ul className="-mb-8">
                  {project.steps.map((step, stepIdx) => (
                    <li key={step.title}>
                      <div className="relative pb-8">
                        {stepIdx !== project.steps.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <span className="text-white font-medium">{stepIdx + 1}</span>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-lg font-medium text-gray-900">{step.title}</p>
                              <p className="mt-1 text-gray-500">{step.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Materials */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900">Materials Used</h2>
              <div className="mt-4">
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {project.materials.map((material) => (
                    <li key={material} className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-700">{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Tips */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900">Pro Tips</h2>
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  {project.tips.map((tip) => (
                    <li key={tip} className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Comments */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
              <div className="mt-4 space-y-6">
                {project.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={comment.avatar} alt={comment.author} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                      <p className="text-sm text-gray-500">{comment.date}</p>
                      <div className="mt-1 text-gray-700">{comment.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add comment form */}
              <div className="mt-6">
                <form onSubmit={handleCommentSubmit} className="relative">
                  <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <label htmlFor="comment" className="sr-only">Add your comment</label>
                    <textarea
                      rows={3}
                      name="comment"
                      id="comment"
                      className="block w-full py-3 border-0 resize-none focus:ring-0 sm:text-sm"
                      placeholder="Add your comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="py-2 px-3 border-t border-gray-200">
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Project details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Project Details</h3>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Budget</dt>
                  <dd className="mt-1 text-sm text-gray-900">{project.details.budget}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Duration</dt>
                  <dd className="mt-1 text-sm text-gray-900">{project.details.duration}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Completion Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{project.details.completionDate}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{project.details.location}</dd>
                </div>
              </dl>
            </div>
            
            {/* Tags */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Tags</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Service providers */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Service Providers Used</h3>
              <ul className="mt-4 space-y-4">
                {project.providers.map((provider) => (
                  <li key={provider.name} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{provider.name}</h4>
                        <p className="mt-1 text-sm text-gray-500">{provider.service}</p>
                      </div>
                      <div className="flex items-center">
                        <svg className="text-yellow-400 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm text-gray-500">{provider.rating}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        View Profile
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Similar projects */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Similar Projects</h3>
              <ul className="mt-4 space-y-4">
                <li className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex space-x-4">
                    <img src="https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" className="h-16 w-16 object-cover rounded" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Farmhouse Kitchen Renovation</h4>
                      <p className="mt-1 text-sm text-gray-500">By Jessica Martinez</p>
                    </div>
                  </div>
                </li>
                <li className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex space-x-4">
                    <img src="https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" className="h-16 w-16 object-cover rounded" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Minimalist Kitchen Makeover</h4>
                      <p className="mt-1 text-sm text-gray-500">By David Wilson</p>
                    </div>
                  </div>
                </li>
                <li className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex space-x-4">
                    <img src="https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" className="h-16 w-16 object-cover rounded" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Industrial Style Kitchen</h4>
                      <p className="mt-1 text-sm text-gray-500">By Robert Taylor</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
