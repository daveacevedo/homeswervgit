import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CommunityService } from '../../../lib/community';
import { ProjectService } from '../../../lib/projects';
import { XMarkIcon, PhotoIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [suggestedTags, setSuggestedTags] = useState([
    'kitchen', 'bathroom', 'renovation', 'diy', 'landscaping', 
    'flooring', 'painting', 'lighting', 'furniture', 'outdoor'
  ]);
  
  useEffect(() => {
    fetchPost();
    fetchProjects();
  }, [id]);
  
  async function fetchPost() {
    try {
      setLoading(true);
      setError(null);
      
      const post = await CommunityService.getPostById(id);
      
      setTitle(post.title);
      setDescription(post.content || '');
      setImages(post.images || []);
      setTags(post.tags || []);
      setSelectedProject(post.project_id || '');
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  async function fetchProjects() {
    try {
      const projectsData = await ProjectService.getProjects({ role: 'homeowner' });
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title for your post.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const postData = {
        title,
        description,
        images,
        tags,
        projectId: selectedProject || null
      };
      
      await CommunityService.updatePost(id, postData);
      
      // Redirect to the post detail page
      navigate(`/community/posts/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };
  
  const handleAddSuggestedTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Backspace' && tagInput === '') {
      setTags(tags.slice(0, -1));
    }
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // In a real app, you would upload these files to a storage service
    // For now, we'll just create object URLs for preview
    const newImages = files.map(file => URL.createObjectURL(file));
    
    setImages([...images, ...newImages]);
  };
  
  const handleRemoveImage = (imageToRemove) => {
    setImages(images.filter(image => image !== imageToRemove));
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3361E1]"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white min-h-screen pb-16 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 pt-20">
        <div className="mb-6">
          <Link
            to={`/community/posts/${id}`}
            className="inline-flex items-center text-sm font-medium text-[#3361E1] hover:text-primary-500"
          >
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back to Post
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#3361E1]">Edit Your Post</h1>
          <p className="mt-2 text-sm text-gray-500">
            Update your community post with new information or images.
          </p>
        </div>
        
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
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="space-y-8">
            <div>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                    Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3361E1] sm:text-sm sm:leading-6"
                      placeholder="e.g., Kitchen Renovation"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                    Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3361E1] sm:text-sm sm:leading-6"
                      placeholder="Share details about your project, including challenges, solutions, and tips for others."
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-4">
                  <label htmlFor="project" className="block text-sm font-medium leading-6 text-gray-900">
                    Link to Project (Optional)
                  </label>
                  <div className="mt-2">
                    <select
                      id="project"
                      name="project"
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#3361E1] sm:text-sm sm:leading-6"
                    >
                      <option value="">Select a project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title || `Project #${project.id.substring(0, 8)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Linking to a project will allow others to see the provider you worked with.
                  </p>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="tags" className="block text-sm font-medium leading-6 text-gray-900">
                    Tags
                  </label>
                  <div className="mt-2">
                    <div className="flex flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-[#3361E1] bg-opacity-10 px-3 py-0.5 text-sm font-medium text-[#3361E1]"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[#3361E1] hover:bg-[#3361E1] hover:text-white focus:bg-[#3361E1] focus:text-white focus:outline-none"
                          >
                            <span className="sr-only">Remove tag {tag}</span>
                            <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        onBlur={handleAddTag}
                        className="flex-1 border-0 bg-transparent p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder={tags.length === 0 ? "e.g., kitchen, renovation, diy (press Enter to add)" : ""}
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">
                      Suggested tags:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags
                        .filter(tag => !tags.includes(tag))
                        .slice(0, 8)
                        .map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleAddSuggestedTag(tag)}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 hover:bg-gray-200"
                          >
                            + {tag}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Photos
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-[#3361E1] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#3361E1] focus-within:ring-offset-2 hover:text-primary-500"
                        >
                          <span>Upload photos</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                {images.length > 0 && (
                  <div className="sm:col-span-6">
                    <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="h-40 w-full rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(image)}
                            className="absolute right-2 top-2 rounded-full bg-gray-800 bg-opacity-75 p-1 text-white hover:bg-opacity-100 focus:outline-none"
                          >
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-x-3">
              <button
                type="button"
                onClick={() => navigate(`/community/posts/${id}`)}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex justify-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Post'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      
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
