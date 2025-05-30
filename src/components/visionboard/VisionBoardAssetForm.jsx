import React, { useState } from 'react';

const VisionBoardAssetForm = ({ onSubmit, onCancel }) => {
  const [assetData, setAssetData] = useState({
    type: 'image',
    url: '',
    quantity: 1,
    cost: '',
    comments: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Handle numeric inputs
    if (name === 'quantity') {
      processedValue = parseInt(value) || 1;
    } else if (name === 'cost') {
      // Allow empty string or valid decimal
      processedValue = value === '' ? '' : parseFloat(value) || 0;
    }
    
    setAssetData(prev => ({ ...prev, [name]: processedValue }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!assetData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(assetData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }
    
    if (assetData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    
    if (assetData.cost !== '' && (isNaN(assetData.cost) || assetData.cost < 0)) {
      newErrors.cost = 'Cost must be a positive number';
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
      onSubmit(assetData);
    }
  };

  // Sample image URLs for inspiration
  const sampleImages = [
    'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/3935350/pexels-photo-3935350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/6444256/pexels-photo-6444256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ];

  const handleSampleImageClick = (url) => {
    setAssetData(prev => ({ ...prev, url, type: 'image' }));
    if (errors.url) {
      setErrors(prev => ({ ...prev, url: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Add Asset</h3>
        <p className="text-sm text-gray-500 mb-4">
          Add images, links, and details about items for your vision board.
        </p>
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <select
          name="type"
          id="type"
          value={assetData.type}
          onChange={handleChange}
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="image">Image</option>
          <option value="link">Link</option>
        </select>
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          {assetData.type === 'image' ? 'Image URL' : 'Link URL'} *
        </label>
        <input
          type="text"
          name="url"
          id="url"
          value={assetData.url}
          onChange={handleChange}
          className={`block w-full border ${errors.url ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          placeholder={assetData.type === 'image' ? 'https://example.com/image.jpg' : 'https://example.com/product'}
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url}</p>
        )}
        
        {/* Image preview for image type */}
        {assetData.type === 'image' && assetData.url && (
          <div className="mt-2">
            <img 
              src={assetData.url} 
              alt="Preview" 
              className="h-32 w-full object-cover rounded-md"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}
        
        {/* Sample images for image type */}
        {assetData.type === 'image' && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Or choose from sample images:</p>
            <div className="grid grid-cols-3 gap-2">
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            min="1"
            value={assetData.quantity}
            onChange={handleChange}
            className={`block w-full border ${errors.quantity ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
            Cost (Optional)
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="cost"
              id="cost"
              step="0.01"
              min="0"
              value={assetData.cost}
              onChange={handleChange}
              className={`block w-full border ${errors.cost ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 pl-7 pr-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="0.00"
            />
          </div>
          {errors.cost && (
            <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
          Comments (Optional)
        </label>
        <textarea
          name="comments"
          id="comments"
          rows="2"
          value={assetData.comments}
          onChange={handleChange}
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Add any notes about this item..."
        ></textarea>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
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
          Add Asset
        </button>
      </div>
    </form>
  );
};

export default VisionBoardAssetForm;
