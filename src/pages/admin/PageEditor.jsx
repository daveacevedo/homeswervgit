import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { useAdmin } from '../../contexts/AdminContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { Octokit } from 'octokit';
import { useDropzone } from 'react-dropzone';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function PageEditor() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAdmin();
  const isNewPage = pageId === 'new';
  
  const [page, setPage] = useState({
    title: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    content: '',
    is_published: false,
    layout: 'default',
    sections: []
  });
  
  const [loading, setLoading] = useState(!isNewPage);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [gitHubSettings, setGitHubSettings] = useState({
    token: '',
    repo: '',
    owner: '',
    branch: 'main',
    path: '',
    commitMessage: ''
  });
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [gitHubSyncing, setGitHubSyncing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Check permissions
  const canEditPages = hasPermission('content_management', 'edit_pages');
  
  useEffect(() => {
    if (!canEditPages) {
      toast.error('You do not have permission to edit pages');
      navigate('/admin/content');
      return;
    }

    if (!isNewPage) {
      fetchPage();
      fetchMedia();
    }
    
    // Load GitHub settings from localStorage if available
    const savedGitHubSettings = localStorage.getItem('githubSettings');
    if (savedGitHubSettings) {
      try {
        setGitHubSettings(JSON.parse(savedGitHubSettings));
      } catch (e) {
        console.error('Failed to parse GitHub settings', e);
      }
    }
  }, [pageId, canEditPages]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .eq('id', pageId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Ensure sections is an array
        const sections = data.sections || [];
        setPage({ ...data, sections });
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      toast.error('Failed to load page data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('content_media')
        .select('*')
        .eq('page_id', pageId);
        
      if (error) throw error;
      
      if (data) {
        setMediaFiles(data);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPage({
      ...page,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleContentChange = (content) => {
    setPage({ ...page, content });
  };

  const handleSlugChange = (e) => {
    // Convert to URL-friendly slug
    const value = e.target.value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
      
    setPage({ ...page, slug: value });
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...page.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    setPage({ ...page, sections: updatedSections });
  };

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      type: 'text',
      title: 'New Section',
      content: '',
      order: page.sections.length
    };
    
    setPage({
      ...page,
      sections: [...page.sections, newSection]
    });
    
    setCurrentSection(newSection);
  };

  const removeSection = (index) => {
    const updatedSections = [...page.sections];
    updatedSections.splice(index, 1);
    
    // Update order for remaining sections
    const reorderedSections = updatedSections.map((section, idx) => ({
      ...section,
      order: idx
    }));
    
    setPage({ ...page, sections: reorderedSections });
    setCurrentSection(null);
  };

  const moveSectionUp = (index) => {
    if (index === 0) return;
    
    const updatedSections = [...page.sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[index - 1];
    updatedSections[index - 1] = temp;
    
    // Update order for all sections
    const reorderedSections = updatedSections.map((section, idx) => ({
      ...section,
      order: idx
    }));
    
    setPage({ ...page, sections: reorderedSections });
  };

  const moveSectionDown = (index) => {
    if (index === page.sections.length - 1) return;
    
    const updatedSections = [...page.sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[index + 1];
    updatedSections[index + 1] = temp;
    
    // Update order for all sections
    const reorderedSections = updatedSections.map((section, idx) => ({
      ...section,
      order: idx
    }));
    
    setPage({ ...page, sections: reorderedSections });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setUploadingMedia(true);
    
    try {
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${pageId}/${fileName}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('content_media')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('content_media')
          .getPublicUrl(filePath);
          
        // Save media reference to database
        const { data: mediaData, error: mediaError } = await supabase
          .from('content_media')
          .insert([{
            page_id: pageId,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type,
            file_size: file.size,
            public_url: publicUrl
          }]);
          
        if (mediaError) throw mediaError;
        
        // Refresh media list
        fetchMedia();
      }
      
      toast.success('Media uploaded successfully');
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload media');
    } finally {
      setUploadingMedia(false);
    }
  }, [pageId]);
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg'],
      'application/pdf': ['.pdf']
    }
  });

  const insertMedia = (mediaUrl) => {
    // Insert media URL into the editor at cursor position
    // This depends on the specific editor implementation
    if (activeTab === 'content') {
      const newContent = page.content + `\n<img src="${mediaUrl}" alt="Media" />\n`;
      setPage({ ...page, content: newContent });
    } else if (currentSection) {
      const sectionIndex = page.sections.findIndex(s => s.id === currentSection.id);
      if (sectionIndex !== -1) {
        const newContent = page.sections[sectionIndex].content + `\n<img src="${mediaUrl}" alt="Media" />\n`;
        handleSectionChange(sectionIndex, 'content', newContent);
      }
    }
  };

  const deleteMedia = async (mediaId, filePath) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('content_media')
        .remove([filePath]);
        
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('content_media')
        .delete()
        .eq('id', mediaId);
        
      if (dbError) throw dbError;
      
      // Refresh media list
      fetchMedia();
      toast.success('Media deleted successfully');
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media');
    }
  };

  const savePage = async () => {
    if (!page.title || !page.slug) {
      toast.error('Title and slug are required');
      return;
    }
    
    try {
      setSaving(true);
      
      const pageData = {
        title: page.title,
        slug: page.slug,
        meta_title: page.meta_title || page.title,
        meta_description: page.meta_description || '',
        content: page.content,
        is_published: page.is_published,
        layout: page.layout,
        sections: page.sections
      };
      
      let result;
      
      if (isNewPage) {
        // Create new page
        result = await supabase
          .from('content_pages')
          .insert([pageData])
          .select()
          .single();
      } else {
        // Update existing page
        result = await supabase
          .from('content_pages')
          .update(pageData)
          .eq('id', pageId)
          .select()
          .single();
      }
      
      const { data, error } = result;
      
      if (error) throw error;
      
      toast.success(`Page ${isNewPage ? 'created' : 'updated'} successfully`);
      
      if (isNewPage && data) {
        // Redirect to edit page with the new ID
        navigate(`/admin/content/${data.id}/edit`);
      }
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error(`Failed to ${isNewPage ? 'create' : 'update'} page`);
    } finally {
      setSaving(false);
    }
  };

  const handleGitHubSettingsChange = (e) => {
    const { name, value } = e.target;
    setGitHubSettings({
      ...gitHubSettings,
      [name]: value
    });
  };

  const saveGitHubSettings = () => {
    localStorage.setItem('githubSettings', JSON.stringify(gitHubSettings));
    setShowGitHubModal(false);
    toast.success('GitHub settings saved');
  };

  const syncWithGitHub = async () => {
    const { token, repo, owner, branch, path, commitMessage } = gitHubSettings;
    
    if (!token || !repo || !owner) {
      toast.error('GitHub settings are incomplete');
      setShowGitHubModal(true);
      return;
    }
    
    try {
      setGitHubSyncing(true);
      
      const octokit = new Octokit({ auth: token });
      
      // Prepare file content
      const fileContent = JSON.stringify({
        title: page.title,
        slug: page.slug,
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        content: page.content,
        sections: page.sections,
        updated_at: new Date().toISOString()
      }, null, 2);
      
      // Encode content to base64
      const contentEncoded = btoa(unescape(encodeURIComponent(fileContent)));
      
      // Determine file path
      const filePath = path || `content/${page.slug}.json`;
      
      // Check if file exists to determine if we need to create or update
      let sha;
      try {
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: filePath,
          ref: branch
        });
        
        sha = fileData.sha;
      } catch (error) {
        // File doesn't exist, will create new
        console.log('File does not exist, will create new');
      }
      
      // Create or update file
      const response = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath,
        message: commitMessage || `Update ${page.title} page`,
        content: contentEncoded,
        branch,
        sha
      });
      
      toast.success('Successfully synced with GitHub');
    } catch (error) {
      console.error('Error syncing with GitHub:', error);
      toast.error('Failed to sync with GitHub');
    } finally {
      setGitHubSyncing(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video', 'code-block'],
      ['clean']
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Helmet>
        <title>{isNewPage ? 'Create New Page' : `Edit: ${page.title}`} | Admin</title>
      </Helmet>
      
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {isNewPage ? 'Create New Page' : `Edit: ${page.title}`}
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            {previewMode ? 'Exit Preview' : 'Preview'}
          </button>
          
          <button
            type="button"
            onClick={() => setShowGitHubModal(true)}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Sync with GitHub
          </button>
          
          <button
            type="button"
            onClick={savePage}
            disabled={saving}
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {saving ? (
              <>
                <LoadingSpinner size="small" className="mr-2" />
                Saving...
              </>
            ) : (
              'Save Page'
            )}
          </button>
        </div>
      </div>
      
      {previewMode ? (
        <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">{page.title}</h1>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
          
          {page.sections.map((section, index) => (
            <div key={section.id} className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('content')}
                className={`${
                  activeTab === 'content'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-6 text-sm font-medium`}
              >
                Main Content
              </button>
              <button
                onClick={() => setActiveTab('sections')}
                className={`${
                  activeTab === 'sections'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-6 text-sm font-medium`}
              >
                Sections
              </button>
              <button
                onClick={() => setActiveTab('media')}
                className={`${
                  activeTab === 'media'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-6 text-sm font-medium`}
              >
                Media
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`${
                  activeTab === 'settings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-6 text-sm font-medium`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab('meta')}
                className={`${
                  activeTab === 'meta'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-6 text-sm font-medium`}
              >
                SEO & Meta
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Main Content Tab */}
            {activeTab === 'content' && (
              <div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mb-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                      Page Title
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={page.title}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900">
                      URL Slug
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="slug"
                        id="slug"
                        value={page.slug}
                        onChange={handleSlugChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">
                    Page Content
                  </label>
                  <div className="mt-2">
                    <ReactQuill
                      theme="snow"
                      value={page.content}
                      onChange={handleContentChange}
                      modules={modules}
                      className="h-64 mb-12"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Sections Tab */}
            {activeTab === 'sections' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Page Sections</h3>
                  <button
                    type="button"
                    onClick={addSection}
                    className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    Add Section
                  </button>
                </div>
                
                <div className="grid grid-cols-12 gap-6">
                  {/* Sections List */}
                  <div className="col-span-4 bg-gray-50 p-4 rounded-lg">
                    {page.sections.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No sections added yet</p>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {page.sections.map((section, index) => (
                          <li key={section.id} className="py-3">
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => setCurrentSection(section)}
                                className={`text-left ${currentSection?.id === section.id ? 'font-semibold text-primary-600' : 'text-gray-700'}`}
                              >
                                {section.title}
                              </button>
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => moveSectionUp(index)}
                                  disabled={index === 0}
                                  className={`text-gray-400 hover:text-gray-500 ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveSectionDown(index)}
                                  disabled={index === page.sections.length - 1}
                                  className={`text-gray-400 hover:text-gray-500 ${index === page.sections.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeSection(index)}
                                  className="text-red-400 hover:text-red-500"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {section.type} • Order: {section.order}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {/* Section Editor */}
                  <div className="col-span-8">
                    {currentSection ? (
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="section-title" className="block text-sm font-medium text-gray-700">
                              Section Title
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                id="section-title"
                                value={currentSection.title}
                                onChange={(e) => {
                                  const index = page.sections.findIndex(s => s.id === currentSection.id);
                                  handleSectionChange(index, 'title', e.target.value);
                                  setCurrentSection({ ...currentSection, title: e.target.value });
                                }}
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-3">
                            <label htmlFor="section-type" className="block text-sm font-medium text-gray-700">
                              Section Type
                            </label>
                            <div className="mt-1">
                              <select
                                id="section-type"
                                value={currentSection.type}
                                onChange={(e) => {
                                  const index = page.sections.findIndex(s => s.id === currentSection.id);
                                  handleSectionChange(index, 'type', e.target.value);
                                  setCurrentSection({ ...currentSection, type: e.target.value });
                                }}
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              >
                                <option value="text">Text</option>
                                <option value="hero">Hero</option>
                                <option value="gallery">Gallery</option>
                                <option value="features">Features</option>
                                <option value="cta">Call to Action</option>
                                <option value="testimonials">Testimonials</option>
                                <option value="custom">Custom HTML</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="sm:col-span-6">
                            <label htmlFor="section-content" className="block text-sm font-medium text-gray-700">
                              Section Content
                            </label>
                            <div className="mt-1">
                              <ReactQuill
                                theme="snow"
                                value={currentSection.content || ''}
                                onChange={(content) => {
                                  const index = page.sections.findIndex(s => s.id === currentSection.id);
                                  handleSectionChange(index, 'content', content);
                                  setCurrentSection({ ...currentSection, content });
                                }}
                                modules={modules}
                                className="h-64 mb-12"
                              />
                            </div>
                          </div>
                          
                          {currentSection.type === 'custom' && (
                            <div className="sm:col-span-6">
                              <label htmlFor="section-css" className="block text-sm font-medium text-gray-700">
                                Custom CSS
                              </label>
                              <div className="mt-1">
                                <textarea
                                  id="section-css"
                                  rows={6}
                                  value={currentSection.custom_css || ''}
                                  onChange={(e) => {
                                    const index = page.sections.findIndex(s => s.id === currentSection.id);
                                    handleSectionChange(index, 'custom_css', e.target.value);
                                    setCurrentSection({ ...currentSection, custom_css: e.target.value });
                                  }}
                                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono"
                                  placeholder=".my-custom-class { color: blue; }"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-8 rounded-lg border border-dashed border-gray-300 text-center">
                        <p className="text-gray-500">
                          Select a section to edit or create a new section
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Media Tab */}
            {activeTab === 'media' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Media</h3>
                  <div 
                    {...getRootProps()} 
                    className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                  >
                    <div className="text-center">
                      <input {...getInputProps()} />
                      {uploadingMedia ? (
                        <LoadingSpinner size="medium" />
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-300"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500"
                            >
                              <span>Upload files</span>
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">
                            PNG, JPG, GIF, WEBP, MP4, WEBM up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Media Library</h3>
                  
                  {mediaFiles.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No media files uploaded yet</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {mediaFiles.map((file) => (
                        <div key={file.id} className="relative group">
                          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                            {file.file_type.startsWith('image/') ? (
                              <img
                                src={file.public_url}
                                alt={file.file_name}
                                className="h-full w-full object-cover object-center"
                              />
                            ) : file.file_type.startsWith('video/') ? (
                              <video
                                src={file.public_url}
                                className="h-full w-full object-cover object-center"
                                controls
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="text-xs text-gray-500 truncate" title={file.file_name}>
                              {file.file_name}
                            </p>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => insertMedia(file.public_url)}
                                className="text-xs text-primary-600 hover:text-primary-900"
                              >
                                Insert
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteMedia(file.id, file.file_path)}
                                className="text-xs text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Page Settings</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Configure general page settings and publishing options.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="layout" className="block text-sm font-medium text-gray-700">
                        Page Layout
                      </label>
                      <div className="mt-1">
                        <select
                          id="layout"
                          name="layout"
                          value={page.layout}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="default">Default</option>
                          <option value="full-width">Full Width</option>
                          <option value="sidebar-right">Sidebar Right</option>
                          <option value="sidebar-left">Sidebar Left</option>
                          <option value="landing">Landing Page</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <div className="flex items-center h-full pt-6">
                        <div className="relative flex items-start">
                          <div className="flex h-6 items-center">
                            <input
                              id="is_published"
                              name="is_published"
                              type="checkbox"
                              checked={page.is_published}
                              onChange={handleInputChange}
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                            />
                          </div>
                          <div className="ml-3 text-sm leading-6">
                            <label htmlFor="is_published" className="font-medium text-gray-900">
                              Published
                            </label>
                            <p className="text-gray-500">
                              Make this page visible to visitors
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Advanced Settings</h3>
                    
                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="tracking_code" className="block text-sm font-medium text-gray-700">
                          Custom Tracking Code
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="tracking_code"
                            name="tracking_code"
                            rows={4}
                            value={page.tracking_code || ''}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono"
                            placeholder="<!-- Google Analytics, Facebook Pixel, etc. -->"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Add custom tracking or analytics code that will be included in this page only.
                        </p>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="custom_css" className="block text-sm font-medium text-gray-700">
                          Custom CSS
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="custom_css"
                            name="custom_css"
                            rows={4}
                            value={page.custom_css || ''}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono"
                            placeholder=".my-custom-class { color: blue; }"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Add custom CSS styles that will be applied to this page only.
                        </p>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="custom_js" className="block text-sm font-medium text-gray-700">
                          Custom JavaScript
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="custom_js"
                            name="custom_js"
                            rows={4}
                            value={page.custom_js || ''}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono"
                            placeholder="document.addEventListener('DOMContentLoaded', function() { ... });"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Add custom JavaScript that will be executed on this page only.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* SEO & Meta Tab */}
            {activeTab === 'meta' && (
              <div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">SEO & Meta Information</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Optimize your page for search engines and social sharing.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700">
                        Meta Title
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="meta_title"
                          id="meta_title"
                          value={page.meta_title || ''}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder={page.title}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Appears in browser tabs and search engine results. Recommended length: 50-60 characters.
                      </p>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700">
                        Meta Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="meta_description"
                          name="meta_description"
                          rows={3}
                          value={page.meta_description || ''}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Brief description of this page for search engines and social media..."
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Appears in search engine results. Recommended length: 150-160 characters.
                      </p>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-700">
                        Meta Keywords
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="meta_keywords"
                          id="meta_keywords"
                          value={page.meta_keywords || ''}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Comma-separated keywords related to the page content.
                      </p>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="og_image" className="block text-sm font-medium text-gray-700">
                        Social Media Image URL
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="og_image"
                          id="og_image"
                          value={page.og_image || ''}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Image that appears when sharing on social media. Recommended size: 1200x630 pixels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* GitHub Sync Modal */}
      {showGitHubModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    GitHub Sync Settings
                  </h3>
                  <div className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="token" className="block text-sm font-medium text-gray-700 text-left">
                          GitHub Personal Access Token
                        </label>
                        <input
                          type="password"
                          name="token"
                          id="token"
                          value={gitHubSettings.token}
                          onChange={handleGitHubSettingsChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="ghp_xxxxxxxxxxxx"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="owner" className="block text-sm font-medium text-gray-700 text-left">
                          Repository Owner
                        </label>
                        <input
                          type="text"
                          name="owner"
                          id="owner"
                          value={gitHubSettings.owner}
                          onChange={handleGitHubSettingsChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="username or organization"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="repo" className="block text-sm font-medium text-gray-700 text-left">
                          Repository Name
                        </label>
                        <input
                          type="text"
                          name="repo"
                          id="repo"
                          value={gitHubSettings.repo}
                          onChange={handleGitHubSettingsChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="repository-name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="branch" className="block text-sm font-medium text-gray-700 text-left">
                          Branch
                        </label>
                        <input
                          type="text"
                          name="branch"
                          id="branch"
                          value={gitHubSettings.branch}
                          onChange={handleGitHubSettingsChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="main"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="path" className="block text-sm font-medium text-gray-700 text-left">
                          File Path (optional)
                        </label>
                        <input
                          type="text"
                          name="path"
                          id="path"
                          value={gitHubSettings.path}
                          onChange={handleGitHubSettingsChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="content/pages/about.json"
                        />
                        <p className="mt-1 text-xs text-gray-500 text-left">
                          Leave empty to use default: content/{page.slug}.json
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="commitMessage" className="block text-sm font-medium text-gray-700 text-left">
                          Commit Message
                        </label>
                        <input
                          type="text"
                          name="commitMessage"
                          id="commitMessage"
                          value={gitHubSettings.commitMessage}
                          onChange={handleGitHubSettingsChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder={`Update ${page.title} page`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2"
                  onClick={saveGitHubSettings}
                >
                  Save Settings
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  onClick={() => setShowGitHubModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
