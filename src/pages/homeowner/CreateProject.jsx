import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHomeowner } from '../../contexts/HomeownerContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';

const CreateProject = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { homeownerProfile } = useHomeowner();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visionBoardItem, setVisionBoardItem] = useState(null);
  const [visionBoardAssets, setVisionBoardAssets] = useState([]);
  const [loadingVisionBoardData, setLoadingVisionBoardData] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'medium',
    estimatedBudget: '',
    estimatedStartDate: '',
    estimatedEndDate: '',
    notes: ''
  });

  // Parse query parameters to check if coming from vision board
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const fromVisionBoard = queryParams.get('from') === 'visionboard';
    const visionBoardId = queryParams.get('id');
    
    if (fromVisionBoard && visionBoardId && user) {
      fetchVisionBoardData(visionBoardId);
    }
  }, [location, user]);

  const fetchVisionBoardData = async (visionBoardId) => {
    try {
      setLoadingVisionBoardData(true);
      
      // Fetch the vision board item
      const { data: itemData, error: itemError } = await supabase
        .from('vision_board_items')
        .select('*')
        .eq('id', visionBoardId)
        .eq('user_id', user.id)
        .single();
        
      if (itemError) throw itemError;
      
      // Fetch the assets for this item
      const { data: assetsData, error: assetsError } = await supabase
        .from('vision_board_assets')
        .select('*')
        .eq('vision_board_item_id', visionBoardId);
        
      if (assetsError) throw assetsError;
      
      // Set the vision board data
      setVisionBoardItem(itemData);
      setVisionBoardAssets(assetsData || []);
      
      // Pre-fill the form with vision board data
      setFormData(prev => ({
        ...prev,
        title: itemData.title || '',
        description: itemData.description || '',
        estimatedStartDate: itemData.target_date || '',
        // Calculate estimated budget from assets
        estimatedBudget: assetsData
          ? assetsData
              .filter(asset => asset.cost !== null && asset.cost !== undefined)
              .reduce((sum, asset) => sum + (asset.cost * asset.quantity), 0).toString()
          : ''
      }));
    } catch (error) {
      console.error('Error fetching vision board data:', error.message);
      setError('Failed to load vision board data. Please try again.');
    } finally {
      setLoadingVisionBoardData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would send data to the backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to projects page
      navigate('/homeowner/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format currency input
  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Create New Project
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Define your home improvement project details to get started
          </p>
        </div>
      </div>
      
      {/* Vision Board Data Banner */}
      {visionBoardItem && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Creating project from Vision Board item: <strong>{visionBoardItem.title}</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                We've pre-filled some information based on your vision board. Feel free to adjust as needed.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {loadingVisionBoardData && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Project Title *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g., Kitchen Renovation"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Describe your project in detail"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Include key details about what you want to accomplish.
                </p>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location in Home *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g., Kitchen, Bathroom, Backyard"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <div className="mt-1">
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="estimatedBudget" className="block text-sm font-medium text-gray-700">
                  Estimated Budget
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    name="estimatedBudget"
                    id="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={handleChange}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0"
                    aria-describedby="budget-currency"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm" id="budget-currency">
                      USD
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="estimatedStartDate" className="block text-sm font-medium text-gray-700">
                  Estimated Start Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="estimatedStartDate"
                    id="estimatedStartDate"
                    value={formData.estimatedStartDate}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="estimatedEndDate" className="block text-sm font-medium text-gray-700">
                  Estimated End Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="estimatedEndDate"
                    id="estimatedEndDate"
                    value={formData.estimatedEndDate}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Any additional details or requirements"
                  />
                </div>
              </div>
              
              {/* Vision Board Assets Section */}
              {visionBoardAssets.length > 0 && (
                <div className="sm:col-span-6">
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Assets from Vision Board</h3>
                    
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Asset</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cost</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Comments</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {visionBoardAssets.map((asset) => (
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
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {asset.cost ? formatCurrency(asset.cost) : '-'}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-500">
                                <div className="max-w-xs truncate">
                                  {asset.comments || '-'}
                                </div>
                              </td>
                            </tr>
                          ))}
                          
                          {/* Total row */}
                          {visionBoardAssets.some(asset => asset.cost !== null && asset.cost !== undefined) && (
                            <tr className="bg-gray-50">
                              <td colSpan={3} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 text-right sm:pl-6">
                                Total:
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                {formatCurrency(visionBoardAssets
                                  .filter(asset => asset.cost !== null && asset.cost !== undefined)
                                  .reduce((sum, asset) => sum + (asset.cost * asset.quantity), 0))}
                              </td>
                              <td></td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              onClick={() => navigate('/homeowner/projects')}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            What happens next?
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                1. Project Creation
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Your project will be created and added to your dashboard.
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                2. Find Service Providers
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                You can search for qualified service providers and send them your project details as a Request for Proposal (RFP).
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                3. Receive Quotes
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Service providers will review your project and send you quotes and proposals.
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                4. Choose a Provider
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Review quotes, check provider profiles and ratings, and select the best match for your project.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
