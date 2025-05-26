import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAdmin } from '../../../contexts/AdminContext';
import { PlusIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function ContentManagement() {
  const { hasPermission } = useAdmin();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const canManagePages = hasPermission('content_management', 'manage_pages');

  useEffect(() => {
    async function fetchPages() {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('content_pages')
          .select('*')
          .order('title');
        
        if (error) throw error;
        
        setPages(data || []);
      } catch (error) {
        console.error('Error fetching content pages:', error);
        setError('Failed to load content pages. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPages();
  }, []);

  const handlePublishToggle = async (page) => {
    if (!canManagePages) return;
    
    try {
      const { error } = await supabase
        .from('content_pages')
        .update({
          is_published: !page.is_published,
          published_at: !page.is_published ? new Date().toISOString() : null
        })
        .eq('id', page.id);
      
      if (error) throw error;
      
      // Update local state
      setPages(pages.map(p => 
        p.id === page.id 
          ? { ...p, is_published: !p.is_published, published_at: !p.is_published ? new Date().toISOString() : null } 
          : p
      ));
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update publish status. Please try again.');
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Content Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage website content pages
          </p>
        </div>
        {canManagePages && (
          <Link
            to="/admin/content/new"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Create Page
          </Link>
        )}
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
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Slug
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Updated
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : pages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                        No content pages found
                      </td>
                    </tr>
                  ) : (
                    pages.map((page) => (
                      <tr key={page.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {page.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {page.slug}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            page.is_published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {page.is_published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(page.updated_at).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-3">
                            <Link
                              to={`/content/${page.slug}`}
                              target="_blank"
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <EyeIcon className="h-5 w-5" aria-hidden="true" />
                              <span className="sr-only">View {page.title}</span>
                            </Link>
                            
                            {canManagePages && (
                              <>
                                <Link
                                  to={`/admin/content/${page.id}/edit`}
                                  className="text-primary-600 hover:text-primary-900"
                                >
                                  <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                  <span className="sr-only">Edit {page.title}</span>
                                </Link>
                                
                                <button
                                  className={`${
                                    page.is_published
                                      ? 'text-yellow-600 hover:text-yellow-900'
                                      : 'text-green-600 hover:text-green-900'
                                  }`}
                                  onClick={() => handlePublishToggle(page)}
                                >
                                  {page.is_published ? 'Unpublish' : 'Publish'}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
