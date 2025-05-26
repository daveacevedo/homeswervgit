import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon, PencilIcon, TrashIcon, BookmarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { CommunityService } from '../../../lib/community';
import { supabase } from '../../../lib/supabase';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLiked, setUserLiked] = useState(false);
  const [userSaved, setUserSaved] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  
  useEffect(() => {
    fetchPost();
    fetchComments();
    checkUserLike();
    checkUserSaved();
    getCurrentUser();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);
  
  async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  }
  
  async function fetchPost() {
    try {
      setLoading(true);
      setError(null);
      
      const data = await CommunityService.getPostById(id);
      setPost(data);
      
      // Fetch related posts based on tags
      if (data && data.tags && data.tags.length > 0) {
        fetchRelatedPosts(data.tags, data.id);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  async function fetchRelatedPosts(tags, currentPostId) {
    try {
      // Mock implementation - in a real app, you would fetch posts with similar tags
      const allPosts = await CommunityService.getPosts();
      const filtered = allPosts
        .filter(p => p.id !== currentPostId) // Exclude current post
        .filter(p => p.tags && p.tags.some(tag => tags.includes(tag))) // Must have at least one matching tag
        .slice(0, 3); // Limit to 3 posts
      
      setRelatedPosts(filtered);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  }
  
  async function fetchComments() {
    try {
      const data = await CommunityService.getComments(id);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }
  
  async function checkUserLike() {
    try {
      const hasLiked = await CommunityService.hasUserLikedPost(id);
      setUserLiked(hasLiked);
    } catch (error) {
      console.error('Error checking user like:', error);
    }
  }
  
  async function checkUserSaved() {
    // Mock implementation - in a real app, you would check if the user has saved this post
    setUserSaved(false);
  }
  
  const handleLikePost = async () => {
    try {
      if (userLiked) {
        await CommunityService.unlikePost(id);
        setUserLiked(false);
        setPost({ ...post, likes_count: post.likes_count - 1 });
      } else {
        await CommunityService.likePost(id);
        setUserLiked(true);
        setPost({ ...post, likes_count: post.likes_count + 1 });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  const handleSavePost = () => {
    // Mock implementation - in a real app, you would save/unsave the post
    setUserSaved(!userSaved);
  };
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      setSubmittingComment(true);
      
      const comment = await CommunityService.addComment(id, newComment);
      setComments([...comments, comment]);
      setNewComment('');
      setPost({ ...post, comments_count: post.comments_count + 1 });
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };
  
  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    try {
      await CommunityService.deletePost(id);
      navigate('/community');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      await CommunityService.deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      setPost({ ...post, comments_count: post.comments_count - 1 });
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };
  
  const handleShare = () => {
    setShareModalOpen(true);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3361E1]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
        <div className="rounded-md bg-red-50 p-4">
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
              <div className="mt-4">
                <Link
                  to="/community"
                  className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
                >
                  Back to Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return null;
  }
  
  const isPostOwner = currentUser && post.user_id === currentUser.id;
  
  return (
    <div className="bg-white min-h-screen pb-16 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 pt-20">
        <div className="mb-6">
          <Link
            to="/community"
            className="inline-flex items-center text-sm font-medium text-[#3361E1] hover:text-primary-500"
          >
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back to Community
          </Link>
        </div>
        
        <div className="lg:grid lg:grid-cols-3 lg:gap-x-8">
          {/* Left column - Images */}
          <div className="lg:col-span-2">
            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg shadow-sm border border-gray-100">
              {post.images && post.images.length > 0 ? (
                <>
                  <img
                    src={post.images[activeImageIndex]}
                    alt={post.title}
                    className="h-full w-full object-cover object-center"
                  />
                  {post.images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0">
                      <div className="flex justify-center">
                        <div className="flex space-x-2 overflow-auto py-2 px-4 bg-black bg-opacity-50 rounded-full">
                          {post.images.map((_, index) => (
                            <button
                              key={index}
                              className={`h-2 w-2 rounded-full ${
                                index === activeImageIndex ? 'bg-white' : 'bg-gray-400'
                              }`}
                              onClick={() => setActiveImageIndex(index)}
                            >
                              <span className="sr-only">View image {index + 1}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-200">
                  <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            
            {post.images && post.images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {post.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative overflow-hidden rounded-md ${
                      index === activeImageIndex ? 'ring-2 ring-[#3361E1]' : 'ring-1 ring-gray-200'
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-16 w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Post content */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-500">
                      {post.user?.user_metadata?.full_name?.[0] || post.user?.email?.[0] || '?'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {post.user?.user_metadata?.full_name || post.user?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500">
                      Posted on {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>
                
                {isPostOwner && (
                  <div className="flex space-x-2">
                    <Link
                      to={`/community/posts/${post.id}/edit`}
                      className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    <button
                      className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={handleDeletePost}
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
              
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#3361E1]">{post.title}</h1>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {post.is_featured && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Featured
                  </span>
                )}
                
                {post.tags && post.tags.length > 0 && post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/community?tag=${tag}`}
                    className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 hover:bg-gray-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              
              <div className="mt-6 prose prose-sm max-w-none text-gray-500">
                <p className="text-base">{post.content}</p>
              </div>
              
              {post.project && (
                <div className="mt-8 rounded-lg border border-gray-100 p-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-900">Linked Project</h3>
                  <div className="mt-2 flex items-center">
                    {post.project.provider?.logo_url ? (
                      <img 
                        src={post.project.provider.logo_url} 
                        alt={post.project.provider.business_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-500">
                          {post.project.provider?.business_name?.[0] || '?'}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {post.project.title}
                      </p>
                      {post.project.provider && (
                        <p className="text-sm text-gray-500">
                          Provider: {post.project.provider.business_name}
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/projects/${post.project.id}`}
                      className="ml-auto inline-flex items-center rounded-md bg-orange-500 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                    >
                      View Project
                    </Link>
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex items-center space-x-6 border-t border-b border-gray-100 py-4">
                <button
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                  onClick={handleLikePost}
                >
                  {userLiked ? (
                    <HeartIconSolid className="h-5 w-5 text-red-500 mr-1.5" />
                  ) : (
                    <HeartIcon className="h-5 w-5 mr-1.5" />
                  )}
                  <span>{post.likes_count} {post.likes_count === 1 ? 'Like' : 'Likes'}</span>
                </button>
                <div className="flex items-center text-sm text-gray-500">
                  <ChatBubbleLeftIcon className="h-5 w-5 mr-1.5" />
                  <span>{post.comments_count} {post.comments_count === 1 ? 'Comment' : 'Comments'}</span>
                </div>
                <button
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                  onClick={handleShare}
                >
                  <ShareIcon className="h-5 w-5 mr-1.5" />
                  <span>Share</span>
                </button>
                <button
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700 ml-auto"
                  onClick={handleSavePost}
                >
                  {userSaved ? (
                    <BookmarkIconSolid className="h-5 w-5 text-[#3361E1] mr-1.5" />
                  ) : (
                    <BookmarkIcon className="h-5 w-5 mr-1.5" />
                  )}
                  <span>{userSaved ? 'Saved' : 'Save'}</span>
                </button>
              </div>
              
              {/* Comments section */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-[#3361E1]">Comments</h2>
                
                {/* Comment form */}
                <div className="mt-4">
                  <form onSubmit={handleSubmitComment}>
                    <div>
                      <label htmlFor="comment" className="sr-only">
                        Add your comment
                      </label>
                      <textarea
                        id="comment"
                        name="comment"
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3361E1] sm:text-sm sm:leading-6"
                        placeholder="Add your comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingComment}
                        className="inline-flex items-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                      >
                        {submittingComment ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Posting...
                          </>
                        ) : (
                          'Post Comment'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Comments list */}
                <div className="mt-8 flow-root">
                  <ul className="-mb-8">
                    {comments.length === 0 ? (
                      <li className="py-4">
                        <div className="text-center text-sm text-gray-500">
                          No comments yet. Be the first to comment!
                        </div>
                      </li>
                    ) : (
                      comments.map((comment, commentIdx) => (
                        <li key={comment.id}>
                          <div className="relative pb-8">
                            {commentIdx !== comments.length - 1 ? (
                              <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex items-start space-x-3">
                              <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-500">
                                    {comment.user?.user_metadata?.full_name?.[0] || comment.user?.email?.[0] || '?'}
                                  </span>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1 bg-gray-50 rounded-lg p-3">
                                <div>
                                  <div className="text-sm">
                                    <span className="font-medium text-gray-900">
                                      {comment.user?.user_metadata?.full_name || comment.user?.email?.split('@')[0]}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-xs text-gray-500">
                                    {formatDate(comment.created_at)}
                                  </p>
                                </div>
                                <div className="mt-2 text-sm text-gray-700">
                                  <p>{comment.content}</p>
                                </div>
                                {currentUser && comment.user_id === currentUser.id && (
                                  <div className="mt-2">
                                    <button
                                      className="text-xs text-red-600 hover:text-red-900"
                                      onClick={() => handleDeleteComment(comment.id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Sidebar */}
          <div className="mt-10 lg:mt-0 lg:pl-8">
            <div className="sticky top-24 space-y-8">
              {/* Author info */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-[#3361E1] mb-4">About the Author</h3>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-500">
                      {post.user?.user_metadata?.full_name?.[0] || post.user?.email?.[0] || '?'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {post.user?.user_metadata?.full_name || post.user?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500">
                      Member since {formatDate(post.user?.created_at || post.created_at)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="w-full inline-flex justify-center items-center rounded-md bg-[#3361E1] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                    View Profile
                  </button>
                </div>
              </div>
              
              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium text-[#3361E1] mb-4">Related Projects</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <div key={relatedPost.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                          {relatedPost.images && relatedPost.images.length > 0 ? (
                            <img
                              src={relatedPost.images[0]}
                              alt={relatedPost.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/community/posts/${relatedPost.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-[#3361E1]"
                          >
                            {relatedPost.title}
                          </Link>
                          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                            {relatedPost.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Call to action */}
              <div className="bg-gradient-to-r from-[#3361E1] to-blue-500 p-6 rounded-lg shadow-sm text-white">
                <h3 className="text-lg font-medium mb-2">Ready to start your own project?</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Get personalized recommendations and find the perfect provider for your home improvement needs.
                </p>
                <button className="w-full inline-flex justify-center items-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500">
                  Start a Project
                </button>
              </div>
              
              {/* Help section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-[#3361E1] mb-4">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about this project or want to learn more?
                </p>
                <button className="w-full inline-flex justify-center items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-100">
                  Ask AI Concierge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#3361E1] bg-opacity-10">
                  <ShareIcon className="h-6 w-6 text-[#3361E1]" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Share this project
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Copy the link below or share directly to your favorite platform.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 sm:mt-6">
                <div className="flex rounded-md shadow-sm">
                  <div className="relative flex flex-grow items-stretch focus-within:z-10">
                    <input
                      type="text"
                      name="share-url"
                      id="share-url"
                      className="block w-full rounded-none rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3361E1] sm:text-sm sm:leading-6"
                      value={window.location.href}
                      readOnly
                    />
                  </div>
                  <button
                    type="button"
                    className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-white bg-[#3361E1] hover:bg-primary-500"
                    onClick={copyToClipboard}
                  >
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-3">Share on social media</p>
                  <div className="flex justify-center space-x-4">
                    <button className="p-2 rounded-full bg-blue-500 text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-full bg-blue-400 text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-full bg-red-500 text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.5 6.75h-9a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h9a.75.75 0 0 0 .75-.75v-9a.75.75 0 0 0-.75-.75zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm5.25-9.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-full bg-blue-600 text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="mt-5">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => setShareModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around items-center h-16">
          <Link to="/dashboard" className="flex flex-col items-center justify-center w-full h-full text-gray-500">
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
          <Link to="/community" className="flex flex-col items-center justify-center w-full h-full text-[#3361E1]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs mt-1">Community</span>
          </Link>
          <Link to="/providers" className="flex flex-col items-center justify-center w-full h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs mt-1">Providers</span>
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
