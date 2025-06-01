import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function PagePreview({ page }) {
  if (!page) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No page to preview</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <Helmet>
        <title>{page.meta_title || page.title}</title>
        <meta name="description" content={page.meta_description} />
        {page.meta_keywords && <meta name="keywords" content={page.meta_keywords} />}
        {page.og_image && <meta property="og:image" content={page.og_image} />}
      </Helmet>
      
      {/* Custom CSS */}
      {page.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: page.custom_css }} />
      )}
      
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{page.title}</h1>
        
        {/* Main Content */}
        <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: page.content }} />
        
        {/* Sections */}
        {page.sections && page.sections.length > 0 && (
          <div className="space-y-12">
            {page.sections.map((section) => (
              <div key={section.id} className="border-t pt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                
                {section.type === 'custom' && section.custom_css && (
                  <style dangerouslySetInnerHTML={{ __html: section.custom_css }} />
                )}
                
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Custom JavaScript */}
      {page.custom_js && (
        <script dangerouslySetInnerHTML={{ __html: page.custom_js }} />
      )}
      
      {/* Tracking Code */}
      {page.tracking_code && (
        <div dangerouslySetInnerHTML={{ __html: page.tracking_code }} />
      )}
    </div>
  );
}
