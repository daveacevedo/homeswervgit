import React from 'react';

const VisionBoardAssetTable = ({ assets, onEdit, onDelete }) => {
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
      <div className="text-center py-6 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-500">No assets added yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Type</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Notes</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Cost</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Qty</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Total</th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                <div className="flex items-center">
                  {asset.type === 'image' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  )}
                  {asset.type === 'image' ? 'Image' : 'Link'}
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                {asset.url ? (
                  <a 
                    href={asset.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {asset.title}
                  </a>
                ) : (
                  asset.title
                )}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                {asset.notes || '-'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                {formatCurrency(asset.cost)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                {asset.quantity || 1}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium text-right">
                {asset.cost !== null && asset.cost !== undefined && asset.cost !== '' 
                  ? formatCurrency(asset.cost * asset.quantity) 
                  : '-'}
              </td>
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
            </tr>
          ))}
          
          {/* Total row */}
          {totalCost > 0 && (
            <tr className="bg-gray-50">
              <td colSpan={4} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                Total Estimated Cost
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                {assets.reduce((sum, asset) => sum + (asset.quantity || 1), 0)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-gray-900 text-right">
                {formatCurrency(totalCost)}
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VisionBoardAssetTable;
