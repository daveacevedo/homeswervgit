import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function SectionEditor({ section, onChange, onDelete }) {
  if (!section) return null;

  const handleChange = (field, value) => {
    onChange({ ...section, [field]: value });
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Edit Section</h3>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-red-600 hover:text-red-900"
          >
            Delete Section
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="section-title" className="block text-sm font-medium text-gray-700">
            Section Title
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="section-title"
              value={section.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="section-type" className="block text-sm font-medium text-gray-700">
            Section Type
          </label>
          <div className="mt-1">
            <select
              id="section-type"
              value={section.type}
              onChange={(e) => handleChange('type', e.target.value)}
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
        
        <div>
          <label htmlFor="section-content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <div className="mt-1">
            <ReactQuill
              theme="snow"
              value={section.content || ''}
              onChange={(content) => handleChange('content', content)}
              modules={modules}
              className="h-64 mb-12"
            />
          </div>
        </div>
        
        {section.type === 'custom' && (
          <div>
            <label htmlFor="section-css" className="block text-sm font-medium text-gray-700">
              Custom CSS
            </label>
            <div className="mt-1">
              <textarea
                id="section-css"
                rows={6}
                value={section.custom_css || ''}
                onChange={(e) => handleChange('custom_css', e.target.value)}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono"
                placeholder=".my-custom-class { color: blue; }"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
