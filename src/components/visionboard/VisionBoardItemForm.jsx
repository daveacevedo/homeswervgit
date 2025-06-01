import React, { useState, useEffect } from 'react';

const VisionBoardItemForm = ({ item, categories, onSubmit, onCancel }) => {
  const initialFormState = {
    id: item?.id || null,
    title: item?.title || '',
    description: item?.description || '',
    category: item?.category || 'other',
    image_url: item?.image_url || '',
    target_date: item?.target_date || '',
    assets: item?.assets || []
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [newAsset, setNewAsset] = useState({
    type: 'image',
    url: '',
    cost: '',
    quantity: 1,
    comments: ''
  });
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        category: item.category || 'other',
        image_url: item.image_url || '',
        target_date: item.target_date || '',
        assets: item.assets || []
      });
    }
  }, [item]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleAssetChange = (e) => {
    const { name, value } = e.target;
    setNewAsset(prev => ({
      ...prev,
      [name]: name === 'cost' || name === 'quantity' ? (value === '' ? '' : Number(value)) : value
    }));
  };
  
  const handleAddAsset = () => {
    if (!newAsset.url) {
      setErrors(prev => ({
        ...prev,
        assetUrl: 'URL is required'
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      assets: [
        ...prev.assets,
        {
          id: `temp-${Date.now()}`,
          ...newAsset
        }
      ]
    }));
    
    // Reset new asset form
    setNewAsset({
      type: 'image',
      url: '',
      cost: '',
      quantity: 1,
      comments: ''
    });
    
    // Clear error
    setErrors(prev => ({
      ...prev,
      assetUrl: null
    }));
  };
  
  const handleRemoveAsset = (assetId) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.filter(asset => asset.id !== assetId)
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {item ? 'Edit Vision Board Item' : 'Add New Vision Board Item'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {item ? 'Update your inspiration item details' : 'Add a new inspiration item to your vision board'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.title ? 'border-red-300' : ''
                }`}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <div className="mt-1">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.category ? 'border-red-300' : ''
                }`}
              >
                {categories.filter(cat => cat.id !== 'all').map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
          </div>
          
          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Describe your vision for this item
            </p>
          </div>
          
          <div className="sm:col-span-6">
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
              Main Image URL
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="image_url"
                id="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter a URL for the main image that represents your vision
            </p>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="target_date" className="block text-sm font-medium text-gray-700">
              Target Date
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="target_date"
                id="target_date"
                value={formData.target_date}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              When do you hope to achieve this?
            </p>
          </div>
        </div>
        
        {/* Assets Section */}
        <div>
          <h4 className="text-base font-medium text-gray-900">Assets</h4>
          <p className="mt-1 text-sm text-gray-500">
            Add images, links, or other resources related to your vision
          </p>
          
          <div className="mt-4 border-t border-b border-gray-200 py-4">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <div className="mt-1">
                  <select
                    id="type"
                    name="type"
                    value={newAsset.type}
                    onChange={handleAssetChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="image">Image</option>
                    <option value="link">Link</option>
                    <option value="product">Product</option>
                    <option value="note">Note</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-4">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  URL *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="url"
                    id="url"
                    value={newAsset.url}
                    onChange={handleAssetChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.assetUrl ? 'border-red-300' : ''
                    }`}
                    placeholder={newAsset.type === 'image' ? 'https://example.com/image.jpg' : 'https://example.com'}
                  />
                  {errors.assetUrl && (
                    <p className="mt-2 text-sm text-red-600">{errors.assetUrl}</p>
                  )}
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
                  Cost
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="cost"
                    id="cost"
                    value={newAsset.cost}
                    onChange={handleAssetChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    value={newAsset.quantity}
                    onChange={handleAssetChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    min="1"
                    step="1"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                  Comments
                </label>
                <div className="mt-1">
                  <textarea
                    id="comments"
                    name="comments"
                    rows={2}
                    value={newAsset.comments}
                    onChange={handleAssetChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Notes about this asset"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <button
                  type="button"
                  onClick={handleAddAsset}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Asset
                </button>
              </div>
            </div>
          </div>
          
          {/* Asset List */}
          {formData.assets.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700">Added Assets</h5>
              <ul className="mt-2 divide-y divide-gray-200">
                {formData.assets.map((asset, index) => (
                  <li key={asset.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-800">
                        {index + 1}
                      </span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-md">
                          {asset.url}
                        </p>
                        {asset.cost && (
                          <p className="text-xs text-gray-500">
                            ${asset.cost} × {asset.quantity} = ${asset.cost * asset.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAsset(asset.id)}
                      className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="pt-5 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {item ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default VisionBoardItemForm;
