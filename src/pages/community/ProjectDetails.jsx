import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  ChatBubbleLeftRightIcon, 
  HeartIcon, 
  ShareIcon,
  HandThumbUpIcon,
  ArrowLeftIcon,
  PaperClipIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch project details from your database
      // For demo purposes, we'll use mock data
      
      // Mock project data
      const mockProject = {
        id: parseInt(id),
        title: 'Modern Kitchen Renovation',
        description: 'Complete kitchen renovation with custom cabinets, quartz countertops, and new appliances. The project took approximately 6 weeks to complete and was done by a professional contractor.',
        longDescription: `
          <p>When we first moved into our home, the kitchen was functional but outdated. The cabinets were from the 90s, the countertops were laminate, and the appliances were showing their age. After saving for a few years, we decided it was time for a complete renovation.</p>
          
          <h3>Planning Phase</h3>
          <p>We started by researching kitchen designs and creating a mood board. We wanted a modern look with clean lines, but also something that would stand the test of time. We worked with a kitchen designer to finalize the layout and select materials.</p>
          
          <h3>Demo and Construction</h3>
          <p>The demo took about a week. Everything was removed down to the studs. This gave us the opportunity to update the electrical and plumbing to current code. The construction phase included:</p>
          <ul>
            <li>New drywall and ceiling</li>
            <li>Recessed lighting and pendant lights over the island</li>
            <li>Custom white shaker cabinets with soft-close hinges</li>
            <li>Quartz countertops in a marble-look finish</li>
            <li>Subway tile backsplash</li>
            <li>New hardwood flooring to match the rest of the house</li>
            <li>Stainless steel appliances (refrigerator, range, dishwasher, microwave)</li>
          </ul>
          
          <h3>Challenges</h3>
          <p>We discovered some water damage behind the sink that required additional work. This added about a week to the timeline and increased the budget by about $2,000. We also had a delay with the countertop installation due to a measurement error, which pushed things back another week.</p>
          
          <h3>Final Result</h3>
          <p>Despite the challenges, we're thrilled with the final result. The kitchen is now the heart of our home, and we enjoy spending time cooking and entertaining. The investment has definitely been worth it, both for our enjoyment and for the value it's added to our home.</p>
          
          <h3>Budget Breakdown</h3>
          <p>For those interested in the costs:</p>
          <ul>
            <li>Cabinets: $12,000</li>
            <li>Countertops: $4,500</li>
            <li>Appliances: $6,000</li>
            <li>Flooring: $3,000</li>
            <li>Lighting: $1,500</li>
            <li>Plumbing fixtures: $800</li>
            <li>Backsplash: $1,200</li>
            <li>Labor: $15,000</li>
            <li>Total: Approximately $44,000</li>
          </ul>
          
          <p>Feel free to ask any questions in the comments!</p>
        `,
        author: 'John Smith',
        authorRole: 'homeowner',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        date: new Date(2023, 3, 15),
        category: 'kitchen',
        images: [
          'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          'https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          'https://images.pexels.com/photos/3926542/pexels-photo-3926542.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        ],
        likes: 24,
        comments: 8,
        shares: 3,
        tags: ['kitchen', 'renovation', 'modern', 'quartz', 'custom cabinets']
      };
      
      // Mock comments
      const mockComments = [
        {
          id: 1,
          author: 'Sarah Johnson',
          authorRole: 'homeowner',
          authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          text: 'This looks amazing! I love the quartz countertops. How long did the entire renovation take?',
          date: new Date(2023, 3, 16),
          likes: 3
        },
        {
          id: 2,
          author: 'Michael Brown',
          authorRole: 'provider',
          authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          text: 'Great work! As a contractor, I appreciate the attention to detail. The subway tile backsplash is installed perfectly.',
          date: new Date(2023, 3, 17),
          likes: 5
        },
        {
          id: 3,
          author: 'Emily Wilson',
          authorRole: 'homeowner',
          authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          text: 'I\'m planning a similar renovation. Would you mind sharing your budget breakdown?',
          date: new Date(2023, 3, 18),
          likes: 2
        },
        {
          id: 4,
          author: 'John Smith',
          authorRole: 'homeowner',
          authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          text: 'Thanks everyone! @Sarah - It took about 6 weeks total. @Emily - I\'ve updated the post with a budget breakdown. Let me know if you have any other questions!',
          date: new Date(2023, 3, 19),
          likes: 4
        }
      ];
      
      setProject(mockProject);
      setComments(mockComments);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    try {
      setSubmitting(true);
      
      // In a real app, you would save the comment to your database
      // For demo purposes, we'll just add it to the local state
      
      const newComment = {
        id: comments.length + 1,
        author: 'Current User',
        authorRole: 'homeowner',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        text: commentText,
        date: new Date(),
        likes: 0
      };
      
      setComments([...comments, newComment]);
      setCommentText('');
      
      // Update comment count
      setProject({
        ...project,
        comments: project.comments + 1
      });
      
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    return format(date, 'MMM d, yyyy');
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

  if (!project) {
    return (
      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Project not found</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                The project you're looking for doesn't exist or has been removed.
              </p>
              <div className="mt-6">
                <Link
                  to="/community"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Back to Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <Link
            to="/community"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <ArrowLeftIcon className="mr-1 h-5 w-5" aria-hidden="true" />
            Back to Community
          </Link>
        </div>
        
        {/* Project details */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-12 w-12 rounded-full"
                  src={project.authorAvatar}
                  alt={project.author}
                />
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-900">{project.author}</h3>
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
          </div>
          
          {/* Project images */}
          {project.images.length > 0 && (
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-2">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="h-64 w-full object-cover rounded-lg"
                    />
                  </div>
                  {project.images.slice(1).map((image, index) => (
                    <div key={index}>
                      <img
                        src={image}
                        alt={`${project.title} ${index + 2}`}
                        className="h-40 w-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Project content */}
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
              <p className="mt-2 text-sm text-gray-500">{project.description}</p>
              
              <div className="mt-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: project.longDescription }} />
              
              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Actions */}
              <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
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
              </div>
            </div>
          </div>
          
          {/* Comments section */}
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Comments ({comments.length})</h3>
              
              {/* Comment form */}
              <div className="mt-4">
                <form onSubmit={handleSubmitComment}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Current user"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <textarea
                          rows={3}
                          name="comment"
                          id="comment"
                          className="block w-full py-3 border-0 resize-none focus:ring-0 sm:text-sm"
                          placeholder="Add a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <div className="py-2 px-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <button
                                type="button"
                                className="-m-2.5 w-10 h-10 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                              >
                                <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                                <span className="sr-only">Attach a file</span>
                              </button>
                            </div>
                            <div className="flex-shrink-0">
                              <button
                                type="submit"
                                disabled={!commentText.trim() || submitting}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {submitting ? (
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <PaperAirplaneIcon className="-ml-1 mr-2 h-4 w-4" />
                                )}
                                Post
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              
              {/* Comments list */}
              <div className="mt-6 space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={comment.authorAvatar}
                        alt={comment.author}
                      />
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2 sm:px-6 sm:py-4">
                      <div className="sm:flex sm:justify-between sm:items-baseline">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">{comment.author}</h3>
                            {comment.authorRole === 'provider' && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Pro
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 sm:mt-0">{formatDate(comment.date)}</p>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>{comment.text}</p>
                      </div>
                      <div className="mt-2 text-sm">
                        <button
                          type="button"
                          className="inline-flex items-center text-gray-500 hover:text-gray-700"
                        >
                          <HandThumbUpIcon className="h-4 w-4 mr-1" />
                          <span>{comment.likes}</span>
                        </button>
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
  );
};

export default ProjectDetails;
