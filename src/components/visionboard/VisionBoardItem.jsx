import React from 'react';
import { Link } from 'react-router-dom';

const VisionBoardItem = ({ item, categories, onEdit, onDelete, isDemo }) => {
  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : 'bg-gray-100 text-gray-800';
  };
  
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No target date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const calculateTotalCost = () => {
    if (!item.assets || item.assets.length === 0) return null;
    
    const total = item.assets
      .filter(asset => asset.cost !== null && asset.cost !== undefined)
      .reduce((sum, asset) => sum + (asset.cost * asset.quantity), 0);
      
    return total > 0 ? total : null;
  };
  
  const totalCost = calculateTotalCost();
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      {item.image_url && (
        <div className="h-48 w-full overflow-hidden">
          <img 
            src={item.image_url} 
            alt={item.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
            }}
          />
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 truncate" title={item.title}>
            {item.title}
          </h3>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(item.category)}`}>
            {getCategoryName(item.category)}
          </span>
        </div>
        
        <p className="mt-2 text-sm text-gray-500 line-clamp-3">
          {item.description}
        </p>
        
        {item.target_date && (
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Target: {formatDate(item.target_date)}
          </div>
        )}
        
        {totalCost !== null && (
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            Estimated: {formatCurrency(totalCost)}
          </div>
        )}
        
        {item.assets && item.assets.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-gray-500">
              {item.assets.length} {item.assets.length === 1 ? 'asset' : 'assets'} attached
            </p>
          </div>
        )}
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={isDemo}
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={isDemo}
            >
              Delete
            </button>
          </div>
          <Link
            to={`/homeowner/projects/new?from=visionboard&id=${item.id}`}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create Project
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VisionBoardItem;
