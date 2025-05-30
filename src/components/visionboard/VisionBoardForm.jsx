import React, { useState, useEffect } from 'react';
import VisionBoardAssetForm from './VisionBoardAssetForm';
import VisionBoardAssetTable from './VisionBoardAssetTable';

const VisionBoardForm = ({ onSubmit, onCancel, categories, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'home',
    target_date: ''
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [assets, setAssets] = useState([]);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  // If editing an existing item, populate the form with its data
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        image_url: initialData.image_url || '',
        category: initialData.category || 'home',
        target_date: initialData.target_date || ''
      });
      setImagePreview(initialData.image_url || '');
      
      // If there are assets, set them
      if (initialData.assets && Array.isArray(initialData.assets)) {
        setAssets(initialData.assets);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Update image preview when URL changes
    if (name === 'image_url' && value) {
      setImagePreview(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = 'Please enter a valid URL';
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
      // Include assets in the submission
      onSubmit({
        ...formData,
        assets
      });
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
    setFormData(prev => ({ ...prev, image_url: url }));
    setImagePreview(url);
    if (errors.image_url) {
      setErrors(prev => ({ ...prev, image_url: null }));
    }
  };

  const handleAddAsset = () => {
    setEditingAsset(null);
    setShowAssetForm(true);
  };

  const handleEditAsset = (asset) => {
    setEditingAsset(asset);
    setShowAssetForm(true);
  };

  const handleDeleteAsset = (assetId) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
  };

  const handleAssetSubmit = (assetData) => {
    if (editingAsset) {
      // Update existing asset
      setAssets(prev => 
        prev.map(asset => 
          asset.id === editingAsset.id 
            ? { ...asset, ...assetData } 
            : asset
        )
      );
    } else {
      // Add new asset with temporary ID
      const newAsset = {
        ...assetData,
        id: `temp-${Date.now()}`
      };
      setAssets(prev => [...prev, newAsset]);
    }
    
    setShowAssetForm(false);
    setEditingAsset(null);
  };

  const handleAssetFormCancel = () => {
    setShowAssetForm(false);
    setEditingAsset(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            {initialData ? 'Edit Inspiration' : 'Add New Inspiration'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {initialData 
              ? 'Update your vision board item details below.' 
              : 'Add a new item to your vision board to keep track of your home improvement goals.'}
          </p>
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
            placeholder="e.g., Modern Kitchen Renovation"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe your vision or add notes..."
          ></textarea>
        </div>

        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
            Main Image URL
          </label>
          <input
            type="text"
            name="image_url"
            id="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.image_url ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.image_url && (
            <p className="mt-1 text-sm text-red-600">{errors.image_url}</p>
          )}
          
          {/* Image preview */}
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-32 w-full object-cover rounded-md"
                onError={() => setImagePreview('')}
              />
            </div>
          )}
          
          {/* Sample images */}
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
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="target_date" className="block text-sm font-medium text-gray-700">
            Target Date
          </label>
          <input
            type="date"
            name="target_date"
            id="target_date"
            value={formData.target_date}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Assets Section */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Assets</h3>
            <button
              type="button"
              onClick={handleAddAsset}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Asset
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Add multiple images, links, and items related to this vision board item.
          </p>
          
          {/* Asset Form Modal */}
          {showAssetForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <VisionBoardAssetForm 
                  onSubmit={handleAssetSubmit}
                  onCancel={handleAssetFormCancel}
                  initialData={editingAsset}
                />
              </div>
            </div>
          )}
          
          {/* Asset Table */}
          <VisionBoardAssetTable 
            assets={assets}
            onEdit={handleEditAsset}
            onDelete={handleDeleteAsset}
          />
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
            {initialData ? 'Update' : 'Add to Vision Board'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default VisionBoardForm;
