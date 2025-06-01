import React from 'react';

export default function MetaDataEditor({ page, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...page, [name]: value });
  };

  return (
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
  );
}
