import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with actual data fetching from Supabase
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock project data
        setProject({
          id: parseInt(id),
          title: 'Modern Kitchen Renovation',
          description: 'Complete kitchen remodel with custom cabinets and quartz countertops.',
          longDescription: `
            Our kitchen was outdated and inefficient, so we decided to completely renovate it. We worked with a local contractor to design a modern, functional space that would be perfect for cooking and entertaining.
            
            The renovation included:
            - Custom maple cabinets with soft-close drawers
            - Quartz countertops in a marble-look finish
            - New stainless steel appliances
            - Porcelain tile flooring
            - Under-cabinet lighting
            - New plumbing fixtures
            
            The project took about 8 weeks to complete and cost approximately $35,000. We're thrilled with the results and have received many compliments from friends and family.
          `,
          category: 'kitchen',
          images: [
            'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            'https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            'https://images.pexels.com/photos/3926542/pexels-photo-3926542.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            'https://images.pexels.com/photos/6207014/pexels-photo-6207014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          ],
          author: 'John Smith',
          authorImage: null,
          likes: 42,
          comments: 12,
          date: '2023-11-15',
          duration: '8 weeks',
          cost: '$35,000',
          provider: 'ABC Contractors',
          materials: [
            'Maple cabinets',
            'Quartz countertops',
            'Stainless steel appliances',
            'Porcelain tile flooring',
            'LED lighting'
          ],
          steps: [
            {
              title: 'Planning and Design',
              description: 'Worked with a kitchen designer to create the layout and select materials.'
            },
            {
              title: 'Demolition',
              description: 'Removed all existing cabinets, countertops, flooring, and appliances.'
            },
            {
              title: 'Plumbing and Electrical',
              description: 'Updated plumbing and electrical to accommodate the new layout.'
            },
            {
              title: 'Cabinets and Countertops',
              description: 'Installed custom cabinets and quartz countertops.'
            },
            {
              title: 'Flooring',
              description: 'Installed new porcelain tile flooring.'
            },
            {
              title: 'Appliances and Fixtures',
              description: 'Installed new appliances, sink, and faucet.'
            },
            {
              title: 'Finishing Touches',
              description: 'Added backsplash, lighting, and hardware.'
            }
          ]
        });
        
        // Mock comments
        setComments([
          {
            id: 1,
            author: 'Sarah Johnson',
            authorImage: null,
            text: 'This looks amazing! I love the quartz countertops. Did you consider any other materials?',
            date: '2023-11-16',
            likes: 5
          },
          {
            id: 2,
            author: 'Michael Brown',
            authorImage: null,
            text: 'Great job! How did you find your contractor? I\'m looking to do a similar renovation.',
            date: '2023-11-17',
            likes: 3
          },
          {
            id: 3,
            author: 'Emily Davis',
            authorImage: null,
            text: 'The lighting makes such a difference. Beautiful work!',
            date: '2023-11-18',
            likes: 2
          }
        ]);
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    // In a real app, this would send the comment to the database
    const newComment = {
      id: comments.length + 1,
      author: user?.email?.split('@')[0] || 'Anonymous',
      authorImage: null,
      text: commentText,
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };
    
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const toggleLike = () => {
    setLiked(!liked);
    // In a real app, this would update the like count in the database
  };

  const toggleSave = () => {
    setSaved(!saved);
    // In a real app, this would save the project to the user's saved projects
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Project Not Found
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-6">
              <Link
                to="/community"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Back to Community Hub
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <div>
                <Link to="/community" className="text-gray-400 hover:text-gray-500">
                  Community Hub
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <span className="ml-4 text-gray-500" aria-current="page">
                  {project.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        
        {/* Project Header */}
        <div className="mt-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {project.title}
              </h1>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
              <button
                type="button"
                onClick={toggleLike}
                className={`inline-flex items-center px-4 py-2 border ${
                  liked ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                } rounded-md shadow-sm text-sm font-medium ${
                  liked ? 'text-red-700' : 'text-gray-700'
                } hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
              >
                <svg className={`-ml-1 mr-2 h-5 w-5 ${liked ? 'text-red-500' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {liked ? 'Liked' : 'Like'}
              </button>
              <button
                type="button"
                onClick={toggleSave}
                className={`inline-flex items-center px-4 py-2 border ${
                  saved ? 'border-primary-300 bg-primary-50' : 'border-gray-300 bg-white'
                } rounded-md shadow-sm text-sm font-medium ${
                  saved ? 'text-primary-700' : 'text-gray-700'
                } hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
              >
                <svg className={`-ml-1 mr-2 h-5 w-5 ${saved ? 'text-primary-500' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                {project.author.charAt(0)}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{project.author}</p>
              <div className="flex space-x-1 text-sm text-gray-500">
                <time dateTime={project.date}>{new Date(project.date).toLocaleDateString()}</time>
                <span aria-hidden="true">&middot;</span>
                <span>{project.category.charAt(0).toUpperCase() + project.category.slice(1)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Project Images */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <img 
                src={project.images[0]} 
                alt={project.title} 
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            </div>
            {project.images.slice(1).map((image, index) => (
              <div key={index}>
                <img 
                  src={image} 
                  alt={`${project.title} ${index + 2}`} 
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Project Details */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Project Description</h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-gray-700 whitespace-pre-line">{project.longDescription}</p>
              </div>
            </div>
            
            {/* Project Steps */}
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Project Steps</h2>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {project.steps.map((step, index) => (
                    <li key={index} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-primary-100 rounded-full h-8 w-8 flex items-center justify-center text-primary-700 font-medium">
                          {index + 1}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                          <p className="mt-1 text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Comments Section */}
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Comments ({comments.length})</h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                {user ? (
                  <form onSubmit={handleCommentSubmit} className="mb-6">
                    <div>
                      <label htmlFor="comment" className="sr-only">Comment</label>
                      <textarea
                        id="comment"
                        name="comment"
                        rows={3}
                        className="shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Post Comment
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <p className="text-sm text-gray-700">
                      <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                        Sign in
                      </Link> to leave a comment.
                    </p>
                  </div>
                )}
                
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                          {comment.author.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2 sm:px-6 sm:py-4">
                        <div className="sm:flex sm:justify-between sm:items-baseline">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {comment.author}
                            </p>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 sm:mt-0">
                            {new Date(comment.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>{comment.text}</p>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 flex items-center">
                          <button className="flex items-center text-gray-500 hover:text-gray-700">
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            {comment.likes} likes
                          </button>
                          <span className="mx-2">&middot;</span>
                          <button className="text-gray-500 hover:text-gray-700">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Project Sidebar */}
          <div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Project Details</h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Duration</dt>
                    <dd className="mt-1 text-sm text-gray-900">{project.duration}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Cost</dt>
                    <dd className="mt-1 text-sm text-gray-900">{project.cost}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Service Provider</dt>
                    <dd className="mt-1 text-sm text-gray-900">{project.provider}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Materials Used</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                        {project.materials.map((material, index) => (
                          <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                            <div className="w-0 flex-1 flex items-center">
                              <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                              <span className="ml-2 flex-1 w-0 truncate">
                                {material}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {/* Similar Projects */}
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Similar Projects</h2>
              </div>
              <div className="border-t border-gray-200">
                <div className="divide-y divide-gray-200">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                        <img 
                          src="https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                          alt="Modern Kitchen Design" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-primary-600 hover:text-primary-500">
                          <Link to="/community/project/2">Modern Kitchen Design</Link>
                        </h3>
                        <p className="text-xs text-gray-500">By Alex Johnson</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                        <img 
                          src="https://images.pexels.com/photos/6207014/pexels-photo-6207014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                          alt="Kitchen Island Upgrade" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-primary-600 hover:text-primary-500">
                          <Link to="/community/project/3">Kitchen Island Upgrade</Link>
                        </h3>
                        <p className="text-xs text-gray-500">By Maria Garcia</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                        <img 
                          src="https://images.pexels.com/photos/3926542/pexels-photo-3926542.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                          alt="Budget Kitchen Refresh" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-primary-600 hover:text-primary-500">
                          <Link to="/community/project/4">Budget Kitchen Refresh</Link>
                        </h3>
                        <p className="text-xs text-gray-500">By David Wilson</p>
                      </div>
                    </div>
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

export default ProjectDetails;
