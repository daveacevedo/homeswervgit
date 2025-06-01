import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { Helmet } from 'react-helmet-async';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ContentPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('content_pages')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            // Page not found
            navigate('/not-found');
            return;
          }
          throw error;
        }
        
        setPage(data);
      } catch (error) {
        console.error('Error fetching page:', error);
        setError('Failed to load page content');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPage();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 p-4 rounded-md">
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
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{page.meta_title || page.title}</title>
        {page.meta_description && <meta name="description" content={page.meta_description} />}
        {page.meta_keywords && <meta name="keywords" content={page.meta_keywords} />}
        {page.og_image && <meta property="og:image" content={page.og_image} />}
        {page.custom_css && <style>{page.custom_css}</style>}
        {page.tracking_code && <script>{page.tracking_code}</script>}
      </Helmet>
      
      <div className={`content-page content-page-${page.layout || 'default'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{page.title}</h1>
          
          {/* Main Content */}
          <div className="prose max-w-none mb-12" dangerouslySetInnerHTML={{ __html: page.content }} />
          
          {/* Sections */}
          {page.sections && page.sections.length > 0 && (
            <div className="space-y-16">
              {page.sections.map((section) => (
                <div key={section.id} className={`section section-${section.type}`}>
                  {section.title && (
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                  )}
                  
                  {section.custom_css && (
                    <style dangerouslySetInnerHTML={{ __html: section.custom_css }} />
                  )}
                  
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {page.custom_js && (
        <script dangerouslySetInnerHTML={{ __html: page.custom_js }} />
      )}
    </>
  );
}
