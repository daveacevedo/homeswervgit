import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import VisionBoardItem from '../../components/visionboard/VisionBoardItem';
import VisionBoardItemForm from '../../components/visionboard/VisionBoardItemForm';

const VisionBoard = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [visionBoardItems, setVisionBoardItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const categories = [
    { id: 'all', name: 'All', color: 'bg-gray-100 text-gray-800' },
    { id: 'kitchen', name: 'Kitchen', color: 'bg-blue-100 text-blue-800' },
    { id: 'bathroom', name: 'Bathroom', color: 'bg-green-100 text-green-800' },
    { id: 'living', name: 'Living Room', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'outdoor', name: 'Outdoor', color: 'bg-purple-100 text-purple-800' },
    { id: 'bedroom', name: 'Bedroom', color: 'bg-pink-100 text-pink-800' },
    { id: 'other', name: 'Other', color: 'bg-gray-100 text-gray-800' }
  ];

  // Demo items for users who don't have any vision board items yet
  const demoItems = [
    {
      id: 'demo-1',
      title: 'Modern Kitchen Renovation',
      category: 'kitchen',
      image_url: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Clean lines, minimalist design, and high-end appliances create a sleek cooking space.',
      target_date: '2023-12-31',
      assets: [
        { id: 'd1-a1', type: 'image', url: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', cost: 5000, quantity: 1 },
        { id: 'd1-a2', type: 'link', url: 'https://www.houzz.com/photos/kitchen-ideas-phbr0-bp~t_709', cost: null, quantity: 1 }
      ]
    },
    {
      id: 'demo-2',
      title: 'Luxury Master Bathroom',
      category: 'bathroom',
      image_url: 'https://images.pexels.com/photos/1910472/pexels-photo-1910472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Spa-like retreat with freestanding tub, walk-in shower, and elegant fixtures.',
      target_date: '2024-03-15',
      assets: [
        { id: 'd2-a1', type: 'image', url: 'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', cost: 3500, quantity: 1 },
        { id: 'd2-a2', type: 'link', url: 'https://www.houzz.com/photos/bathroom-ideas-phbr0-bp~t_709', cost: null, quantity: 1 }
      ]
    },
    {
      id: 'demo-3',
      title: 'Backyard Oasis',
      category: 'outdoor',
      image_url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Landscaped garden with pool, outdoor kitchen, and comfortable seating areas.',
      target_date: '2024-05-30',
      assets: [
        { id: 'd3-a1', type: 'image', url: 'https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', cost: 8000, quantity: 1 },
        { id: 'd3-a2', type: 'link', url: 'https://www.houzz.com/photos/landscape-ideas-phbr0-bp~t_709', cost: null, quantity: 1 }
      ]
    }
  ];

  useEffect(() => {
    if (user) {
      fetchVisionBoardItems();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchVisionBoardItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('vision_board_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Fetch assets for each vision board item
      const itemsWithAssets = await Promise.all(data.map(async (item) => {
        const { data: assets, error: assetsError } = await supabase
          .from('vision_board_assets')
          .select('*')
          .eq('vision_board_item_id', item.id);
          
        if (assetsError) throw assetsError;
        
        return {
          ...item,
          assets: assets || []
        };
      }));
      
      setVisionBoardItems(itemsWithAssets);
    } catch (error) {
      console.error('Error fetching vision board items:', error.message);
      setError('Failed to load vision board items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      setLoading(true);
      
      // Insert the new vision board item
      const { data: itemData, error: itemError } = await supabase
        .from('vision_board_items')
        .insert([
          {
            user_id: user.id,
            title: newItem.title,
            description: newItem.description,
            category: newItem.category,
            image_url: newItem.image_url,
            target_date: newItem.target_date
          }
        ])
        .select();
        
      if (itemError) throw itemError;
      
      // Insert assets if any
      if (newItem.assets && newItem.assets.length > 0) {
        const assetsToInsert = newItem.assets.map(asset => ({
          vision_board_item_id: itemData[0].id,
          type: asset.type,
          url: asset.url,
          cost: asset.cost,
          quantity: asset.quantity || 1,
          comments: asset.comments
        }));
        
        const { error: assetsError } = await supabase
          .from('vision_board_assets')
          .insert(assetsToInsert);
          
        if (assetsError) throw assetsError;
      }
      
      // Refresh the list
      fetchVisionBoardItems();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding vision board item:', error.message);
      setError('Failed to add vision board item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleUpdateItem = async (updatedItem) => {
    try {
      setLoading(true);
      
      // Update the vision board item
      const { error: itemError } = await supabase
        .from('vision_board_items')
        .update({
          title: updatedItem.title,
          description: updatedItem.description,
          category: updatedItem.category,
          image_url: updatedItem.image_url,
          target_date: updatedItem.target_date
        })
        .eq('id', updatedItem.id);
        
      if (itemError) throw itemError;
      
      // Handle assets updates
      if (updatedItem.assets) {
        // Delete existing assets
        const { error: deleteError } = await supabase
          .from('vision_board_assets')
          .delete()
          .eq('vision_board_item_id', updatedItem.id);
          
        if (deleteError) throw deleteError;
        
        // Insert new assets
        if (updatedItem.assets.length > 0) {
          const assetsToInsert = updatedItem.assets.map(asset => ({
            vision_board_item_id: updatedItem.id,
            type: asset.type,
            url: asset.url,
            cost: asset.cost,
            quantity: asset.quantity || 1,
            comments: asset.comments
          }));
          
          const { error: assetsError } = await supabase
            .from('vision_board_assets')
            .insert(assetsToInsert);
            
          if (assetsError) throw assetsError;
        }
      }
      
      // Refresh the list
      fetchVisionBoardItems();
      setShowAddForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating vision board item:', error.message);
      setError('Failed to update vision board item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      
      // Delete assets first (foreign key constraint)
      const { error: assetsError } = await supabase
        .from('vision_board_assets')
        .delete()
        .eq('vision_board_item_id', itemToDelete.id);
        
      if (assetsError) throw assetsError;
      
      // Delete the vision board item
      const { error: itemError } = await supabase
        .from('vision_board_items')
        .delete()
        .eq('id', itemToDelete.id);
        
      if (itemError) throw itemError;
      
      // Refresh the list
      fetchVisionBoardItems();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting vision board item:', error.message);
      setError('Failed to delete vision board item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingItem(null);
  };

  const filteredItems = activeCategory === 'all' 
    ? visionBoardItems 
    : visionBoardItems.filter(item => item.category === activeCategory);

  const displayItems = visionBoardItems.length > 0 ? filteredItems : demoItems;

  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Your Vision Board
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Collect and organize inspiration for your home improvement projects
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              onClick={() => {
                setEditingItem(null);
                setShowAddForm(true);
              }}
              className="ml-3 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Inspiration
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="mt-4 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${
                  category.id === categories[0].id
                    ? 'rounded-l-md'
                    : category.id === categories[categories.length - 1].id
                    ? 'rounded-r-md'
                    : ''
                } border border-gray-300`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {/* Inspiration Grid */}
            <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {displayItems.map((item) => (
                <VisionBoardItem
                  key={item.id}
                  item={item}
                  categories={categories}
                  onEdit={() => handleEditItem(item)}
                  onDelete={() => handleDeleteClick(item)}
                  isDemo={visionBoardItems.length === 0}
                />
              ))}
            </div>

            {visionBoardItems.length === 0 && (
              <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No vision board items yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding your first inspiration item.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setShowAddForm(true);
                      }}
                      className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Your First Inspiration
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh]">
              <VisionBoardItemForm
                item={editingItem}
                categories={categories}
                onSubmit={editingItem ? handleUpdateItem : handleAddItem}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Vision Board Item
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionBoard;
