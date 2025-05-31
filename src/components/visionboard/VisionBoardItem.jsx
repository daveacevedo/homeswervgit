import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VisionBoardItem = ({ item, categories, onEdit, onDelete, isDemo = false }) => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const navigate = useNavigate();
  
  // Find the category object that matches the item's category
  const category = categories.find(cat => cat.id === item.category) || categories.find(cat => cat.id === 'other');
  
  // Format the target date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Count assets by type
  const assetCounts = item.assets ? {
    images: item.assets.filter(asset => asset.type === 'image').length,
    links: item.assets.filter(asset => asset.type === 'link').length,
    total: item.assets.length
  } : { images: 0, links: 0, total: 0 };

  // Calculate total estimated cost
  const totalCost = item.assets ? 
    item.assets
      .filter(asset => asset.cost !== null && asset.cost !== undefined && asset.cost !== '')
      .reduce((sum, asset) => sum + (asset.cost * asset.quantity), 0) 
    : 0;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleCreateProject = () => {
    setShowProjectModal(false);
    // Navigate to project creation with vision board data using React Router
    navigate(`/homeowner/projects/new?from=visionboard&id=${item.id}`);
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        {/* Image */}
        <div className="h-48 w-full overflow-hidden">
          {item.image_url ? (
            <img 
              src={item.image_url} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Category badge */}
        {category && (
          <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
            {category.name}
          </span>
        )}
        
        {/* Demo badge */}
        {isDemo && (
          <span className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Example
          </span>
        )}

        {/* Asset count badge */}
        {assetCounts.total > 0 && (
          <span className="absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {assetCounts.total} {assetCounts.total === 1 ? 'Asset' : 'Assets'}
          </span>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-medium text-gray-900 truncate">{item.title}</h3>
        
        <p className="mt-2 text-sm text-gray-500 line-clamp-3">
          {item.description || 'No description provided'}
        </p>
        
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Target: {formatDate(item.target_date)}</span>
        </div>

        {/* Asset summary */}
        {assetCounts.total > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {assetCounts.images > 0 && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {assetCounts.images} {assetCounts.images === 1 ? 'Image' : 'Images'}
              </span>
            )}
            
            {assetCounts.links > 0 && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {assetCounts.links} {assetCounts.links === 1 ? 'Link' : 'Links'}
              </span>
            )}
            
            {totalCost > 0 && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Est. {formatCurrency(totalCost)}
              </span>
            )}
          </div>
        )}
        
        {!isDemo && (
          <div className="mt-5 flex justify-between">
            <div className="flex space-x-2">
              <button
                onClick={onEdit}
                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={onDelete}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
            
            <button
              onClick={() => setShowProjectModal(true)}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              Create Project
            </button>
          </div>
        )}
      </div>

      {/* Project Creation Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Create a Project
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Would you like to create a new project based on this vision board item? 
                    This will take you to the project creation form with pre-filled information.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleCreateProject}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Create Project
              </button>
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionBoardItem;
