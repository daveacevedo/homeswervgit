import React from 'react';

const VisionBoardAssetTable = ({ assets, onEdit, onDelete, isDemo = false }) => {
  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === '') return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate total cost
  const totalCost = assets
    .filter(asset => asset.cost !== null && asset.cost !== undefined && asset.cost !== '')
    .reduce((sum, asset) => sum + (asset.cost * asset.quantity), 0);

  if (assets.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 italic">
        No assets added yet. Add images, links, and items to your vision board.
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Asset</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cost</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Comments</th>
            {!isDemo && (
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                {asset.type === 'image' ? (
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={asset.url} 
                        alt="" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/40?text=Error';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 truncate max-w-xs">
                        <a href={asset.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {new URL(asset.url).hostname}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 truncate max-w-xs">
                        <a href={asset.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {new URL(asset.url).hostname}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  asset.type === 'image' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {asset.type === 'image' ? 'Image' : 'Link'}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{asset.quantity}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(asset.cost)}</td>
              <td className="px-3 py-4 text-sm text-gray-500">
                <div className="max-w-xs truncate">
                  {asset.comments || '-'}
                </div>
              </td>
              {!isDemo && (
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    onClick={() => onEdit(asset)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(asset.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
          
          {/* Total row */}
          {assets.some(asset => asset.cost !== null && asset.cost !== undefined && asset.cost !== '') && (
            <tr className="bg-gray-50">
              <td colSpan={3} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 text-right sm:pl-6">
                Total:
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                {formatCurrency(totalCost)}
              </td>
              <td colSpan={isDemo ? 1 : 2}></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VisionBoardAssetTable;
