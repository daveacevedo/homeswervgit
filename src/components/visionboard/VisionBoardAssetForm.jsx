import React, { useState, useEffect } from 'react';

const VisionBoardAssetForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    type: 'image',
    title: '',
    url: '',
    notes: '',
    cost: '',
    quantity: 1
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  // If editing an existing asset, populate the form with its data
  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'image',
        title: initialData.title || '',
        url: initialData.url || '',
        notes: initialData.notes || '',
        cost: initialData.cost !== undefined ? initialData.cost : '',
        quantity: initialData.quantity || 1
      });
      
      if (initialData.type === 'image' && initialData.url) {
        setImagePreview(initialData.url);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (name === 'cost') {
      // Allow empty string or numbers
      if (value === '' || (!isNaN(value) && value >= 0)) {
        setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) }));
      }
    } else if (name === 'quantity') {
      // Only allow positive integers
      if (!isNaN(value) && parseInt(value) > 0) {
        setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Update image preview when URL changes and type is image
    if (name === 'url' && formData.type === 'image' && value) {
      setImagePreview(value);
    } else if (name === 'type' && value === 'image' && formData.url) {
      setImagePreview(formData.url);
    } else if (name === 'type' && value !== 'image') {
      setImagePreview('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Sample image URLs for inspiration
  const sampleImages = [
    'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/3935350/pexels-photo-3935350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ];

  const handleSampleImageClick = (url) => {
    setFormData(prev => ({ ...prev, url }));
    setImagePreview(url);
    if (errors.url) {
      setErrors(prev => ({ ...prev, url: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            {initialData ? 'Edit Asset' : 'Add New Asset'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Add images, links, or items to your vision board.
          </p>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Asset Type
          </label>
          <select
            name="type"
            id="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="image">Image</option>
            <option value="link">Link</option>
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            placeholder={formData.type === 'image' ? 'e.g., Kitchen Backsplash' : 'e.g., Favorite Faucet'}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            {formData.type === 'image' ? 'Image URL *' : 'Link URL *'}
          </label>
          <input
            type="text"
            name="url"
            id="url"
            value={formData.url}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.url ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-600">{errors.url}</p>
          )}
          
          {/* Image preview for image type */}
          {formData.type === 'image' && imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-32 w-full object-cover rounded-md"
                onError={() => setImagePreview('')}
              />
            </div>
          )}
          
          {/* Sample images for image type */}
          {formData.type === 'image' && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Or choose from sample images:</p>
              <div className="grid grid-cols-4 gap-2">
                {sampleImages.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSampleImageClick(url)}
                    className="h-16 w-full overflow-hidden rounded border border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <img 
                      src={url} 
                      alt={`Sample ${index + 1}`} 
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Add any details or notes about this item..."
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
              Estimated Cost ($)
            </label>
            <input
              type="number"
              name="cost"
              id="cost"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {initialData ? 'Update Asset' : 'Add Asset'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default VisionBoardAssetForm;
