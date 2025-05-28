import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { CommunityService } from '../../lib/community';
import { useAuth } from '../../contexts/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLiked, setUserLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch post details
        const postData = await CommunityService.getPost(id);
        if (!postData) {
          throw new Error('Post not found');
        }
        setPost(postData);
        
        // Fetch comments
        const commentsData = await CommunityService.getComments(id);
        setComments(commentsData);
        
        // Check if user has liked the post
        if (user) {
          const hasLiked = await CommunityService.hasUserLikedPost(id);
          setUserLiked(hasLiked);
        }
      } catch (error) {
        console.error('Error fetching post details:', error);
        setError(error.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostAndComments();
  }, [id, user]);
  
  const handleLikeToggle = async () => {
    if (!user) {
      // Prompt user to sign in
      return;
    }
    
    try {
      if (userLiked) {
        await CommunityService.unlikePost(id);
        setUserLiked(false);
        setPost({
          ...post,
          likes_count: post.likes_count - 1
        });
      } else {
        await CommunityService.likePost(id);
        setUserLiked(true);
        setPost({
          ...post,
          likes_count: post.likes_count + 1
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      // Prompt user to sign in
      return;
    }
    
    if (!newComment.trim()) {
      return;
    }
    
    try {
      setSubmittingComment(true);
      const comment = await CommunityService.addComment(id, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
      setPost({
        ...post,
        comments_count: post.comments_count + 1
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };
  
  const nextImage = () => {
    if (post?.images && post.images.length > 1) {
      setCurrentImageIndex((currentImageIndex + 1) % post.images.length);
    }
  };
  
  const prevImage = () => {
    if (post?.images && post.images.length > 1) {
      setCurrentImageIndex((currentImageIndex - 1 + post.images.length) % post.images.length);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3361E1]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="sm:flex">
            <p className="text-4xl font-extrabold text-[#3361E1] sm:text-5xl">404</p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Project not found</h1>
                <p className="mt-1 text-base text-gray-500">{error}</p>
              </div>
              <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link
                  to="/community"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#3361E1] hover:bg-[#2D55C7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3361E1]"
                >
                  Back to Community
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return null;
  }
  
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <Link
            to="/community"
            className="inline-flex items-center text-sm font-medium text-[#3361E1] hover:text-[#2D55C7]"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" aria-hidden="true" />
            Back to Community
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-6">
              {post.images && post.images.length > 0 ? (
                <>
                  <img
                    src={post.images[currentImageIndex]}
                    alt={post.title}
                    className="w-full h-96 object-cover"
                  />
                  {post.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 text-gray-800 hover:bg-opacity-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 text-gray-800 hover:bg-opacity-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {post.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-2 w-2 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex h-96 w-full items-center justify-center bg-gray-200">
                  <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Post content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {post.user?.user_metadata?.full_name?.charAt(0) || post.user?.email?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {post.user?.user_metadata?.full_name || post.user?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                {post.is_featured && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
              
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700">{post.content}</p>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex space-x-4">
                  <button
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                    onClick={handleLikeToggle}
                  >
                    {userLiked ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500 mr-1.5" />
                    ) : (
                      <HeartIcon className="h-5 w-5 mr-1.5" />
                    )}
                    {post.likes_count} {post.likes_count === 1 ? 'Like' : 'Likes'}
                  </button>
                  <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <ChatBubbleLeftIcon className="h-5 w-5 mr-1.5" />
                    {post.comments_count} {post.comments_count === 1 ? 'Comment' : 'Comments'}
                  </button>
                </div>
                <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <ShareIcon className="h-5 w-5 mr-1.5" />
                  Share
                </button>
              </div>
            </div>
            
            {/* Comments section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Comments</h2>
              
              {/* Comment form */}
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="mb-4">
                  <label htmlFor="comment" className="sr-only">
                    Add a comment
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3361E1] focus:ring-[#3361E1] sm:text-sm"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={submittingComment}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md border border-transparent bg-[#3361E1] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2D55C7] focus:outline-none focus:ring-2 focus:ring-[#3361E1] focus:ring-offset-2"
                    disabled={submittingComment || !newComment.trim()}
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
              
              {/* Comments list */}
              {comments.length > 0 ? (
                <ul className="space-y-6">
                  {comments.map((comment) => (
                    <li key={comment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {comment.user?.user_metadata?.full_name?.charAt(0) || comment.user?.email?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {comment.user?.user_metadata?.full_name || comment.user?.email?.split('@')[0]}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 ml-11">
                        <p>{comment.content}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* User card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">About the Author</h3>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-lg">
                      {post.user?.user_metadata?.full_name?.charAt(0) || post.user?.email?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium text-gray-900">
                      {post.user?.user_metadata?.full_name || post.user?.email?.split('@')[0]}
                    </h4>
                    <p className="text-sm text-gray-500">Homeowner</p>
                  </div>
                </div>
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  View Profile
                </button>
              </div>
              
              {/* Related projects */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Similar Projects</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 rounded bg-gray-200"></div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Another {post.tags?.[0] || 'renovation'} project</h4>
                        <p className="text-xs text-gray-500 mt-0.5">By Another User</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link
                    to="/community"
                    className="text-sm font-medium text-[#3361E1] hover:text-[#2D55C7]"
                  >
                    View more projects
                  </Link>
                </div>
              </div>
              
              {/* Call to action */}
              <div className="bg-[#3361E1] rounded-lg shadow-sm p-6 text-white">
                <h3 className="text-lg font-medium mb-2">Ready to start your own project?</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Connect with top-rated professionals in your area and get started today.
                </p>
                <Link
                  to="/homeowner/projects/new"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-[#3361E1] bg-white hover:bg-blue-50"
                >
                  Start a Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
