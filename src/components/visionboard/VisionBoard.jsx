import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import VisionBoardItem from './VisionBoardItem';
import VisionBoardForm from './VisionBoardForm';

const VisionBoard = () => {
  const { user } = useAuth() || { user: null };
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch vision board items from Supabase if user is logged in
  useEffect(() => {
    if (user) {
      fetchVisionBoardItems();
    } else {
      // Load from localStorage if not logged in
      const savedItems = localStorage.getItem('visionBoardItems');
      if (savedItems) {
        try {
          setItems(JSON.parse(savedItems));
        } catch (e) {
          console.error('Error parsing vision board items from localStorage:', e);
          setItems([]);
        }
      }
    }
  }, [user]);

  // Save items to localStorage when they change (for non-authenticated users)
  useEffect(() => {
    if (!user && items.length > 0) {
      localStorage.setItem('visionBoardItems', JSON.stringify(items));
    }
  }, [items, user]);

  const fetchVisionBoardItems = async () => {
    try {
      setLoading(true);
      
      // First fetch the vision board items
      const { data: itemsData, error: itemsError } = await supabase
        .from('vision_board_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;
      
      // For each item, fetch its assets
      const itemsWithAssets = await Promise.all(itemsData.map(async (item) => {
        const { data: assetsData, error: assetsError } = await supabase
          .from('vision_board_assets')
          .select('*')
          .eq('vision_board_item_id', item.id)
          .order('created_at', { ascending: true });
          
        if (assetsError) throw assetsError;
        
        return {
          ...item,
          assets: assetsData || []
        };
      }));
      
      setItems(itemsWithAssets || []);
    } catch (error) {
      console.error('Error fetching vision board items:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (newItem) => {
    if (user) {
      try {
        setLoading(true);
        
        // Extract assets from the newItem
        const { assets, ...itemData } = newItem;
        
        // Insert the main vision board item
        const { data, error } = await supabase
          .from('vision_board_items')
          .insert([
            { 
              user_id: user.id,
              title: itemData.title,
              description: itemData.description,
              image_url: itemData.image_url,
              category: itemData.category,
              target_date: itemData.target_date
            }
          ])
          .select();

        if (error) throw error;
        
        const newItemId = data[0].id;
        
        // If there are assets, insert them
        if (assets && assets.length > 0) {
          const assetsToInsert = assets.map(asset => ({
            vision_board_item_id: newItemId,
            type: asset.type,
            url: asset.url,
            quantity: asset.quantity,
            cost: asset.cost === '' ? null : asset.cost,
            comments: asset.comments
          }));
          
          const { data: assetsData, error: assetsError } = await supabase
            .from('vision_board_assets')
            .insert(assetsToInsert)
            .select();
            
          if (assetsError) throw assetsError;
          
          // Add the inserted assets to the new item
          data[0].assets = assetsData;
        } else {
          data[0].assets = [];
        }
        
        setItems(prevItems => [data[0], ...prevItems]);
        setShowForm(false);
      } catch (error) {
        console.error('Error adding vision board item:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      // For non-authenticated users, just add to local state
      const newItemWithId = {
        ...newItem,
        id: Date.now().toString(), // Use timestamp as ID
        created_at: new Date().toISOString(),
        assets: newItem.assets || []
      };
      setItems(prevItems => [newItemWithId, ...prevItems]);
      setShowForm(false);
    }
  };

  const handleEditItem = async (item) => {
    if (user) {
      try {
        // Fetch the latest assets for this item
        const { data: assetsData, error: assetsError } = await supabase
          .from('vision_board_assets')
          .select('*')
          .eq('vision_board_item_id', item.id)
          .order('created_at', { ascending: true });
          
        if (assetsError) throw assetsError;
        
        // Set the editing item with the latest assets
        setEditingItem({
          ...item,
          assets: assetsData || []
        });
      } catch (error) {
        console.error('Error fetching assets for editing:', error.message);
        setError(error.message);
        // Still set the editing item, but without assets
        setEditingItem(item);
      }
    } else {
      // For non-authenticated users, just use the item as is
      setEditingItem(item);
    }
    
    setShowForm(true);
  };

  const handleUpdateItem = async (updatedItem) => {
    if (user) {
      try {
        setLoading(true);
        
        // Extract assets from the updatedItem
        const { assets, ...itemData } = updatedItem;
        
        // Update the main vision board item
        const { data, error } = await supabase
          .from('vision_board_items')
          .update({ 
            title: itemData.title,
            description: itemData.description,
            image_url: itemData.image_url,
            category: itemData.category,
            target_date: itemData.target_date
          })
          .eq('id', updatedItem.id)
          .select();

        if (error) throw error;
        
        // Handle assets updates
        if (assets && assets.length > 0) {
          // First, delete all existing assets for this item
          const { error: deleteError } = await supabase
            .from('vision_board_assets')
            .delete()
            .eq('vision_board_item_id', updatedItem.id);
            
          if (deleteError) throw deleteError;
          
          // Then insert the new/updated assets
          const assetsToInsert = assets.map(asset => ({
            vision_board_item_id: updatedItem.id,
            type: asset.type,
            url: asset.url,
            quantity: asset.quantity,
            cost: asset.cost === '' ? null : asset.cost,
            comments: asset.comments
          }));
          
          const { data: assetsData, error: assetsError } = await supabase
            .from('vision_board_assets')
            .insert(assetsToInsert)
            .select();
            
          if (assetsError) throw assetsError;
          
          // Add the inserted assets to the updated item
          data[0].assets = assetsData;
        } else {
          // If no assets, delete any existing ones
          const { error: deleteError } = await supabase
            .from('vision_board_assets')
            .delete()
            .eq('vision_board_item_id', updatedItem.id);
            
          if (deleteError) throw deleteError;
          
          data[0].assets = [];
        }
        
        setItems(prevItems => 
          prevItems.map(item => item.id === updatedItem.id ? data[0] : item)
        );
        setShowForm(false);
        setEditingItem(null);
      } catch (error) {
        console.error('Error updating vision board item:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      // For non-authenticated users, update in local state
      const { assets, ...itemData } = updatedItem;
      
      setItems(prevItems => 
        prevItems.map(item => item.id === updatedItem.id ? {
          ...item,
          ...itemData,
          assets: assets || []
        } : item)
      );
      setShowForm(false);
      setEditingItem(null);
    }
  };

  const handleDeleteItem = async (id) => {
    if (user) {
      try {
        setLoading(true);
        
        // Delete the vision board item (assets will be deleted via cascade)
        const { error } = await supabase
          .from('vision_board_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        setItems(prevItems => prevItems.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting vision board item:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      // For non-authenticated users, just remove from local state
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      handleUpdateItem({ ...editingItem, ...formData });
    } else {
      handleAddItem(formData);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  // Sample categories for vision board items
  const categories = [
    { id: 'home', name: 'Home Improvement', color: 'bg-blue-100 text-blue-800' },
    { id: 'garden', name: 'Garden & Outdoor', color: 'bg-green-100 text-green-800' },
    { id: 'renovation', name: 'Renovation', color: 'bg-purple-100 text-purple-800' },
    { id: 'decor', name: 'Decoration', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'furniture', name: 'Furniture', color: 'bg-red-100 text-red-800' },
    { id: 'other', name: 'Other', color: 'bg-gray-100 text-gray-800' }
  ];

  // Sample vision board items for new users
  const sampleItems = [
    {
      id: 'sample-1',
      title: 'Modern Kitchen Renovation',
      description: 'Open concept kitchen with island and new appliances',
      image_url: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'renovation',
      target_date: '2023-12-31',
      assets: [
        {
          id: 'sample-asset-1',
          type: 'image',
          url: 'https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          quantity: 1,
          cost: 3500,
          comments: 'Marble countertop option'
        },
        {
          id: 'sample-asset-2',
          type: 'link',
          url: 'https://www.homedepot.com/b/Appliances-Kitchen-Appliances-Refrigerators/N-5yc1vZc3pi',
          quantity: 1,
          cost: 2200,
          comments: 'Refrigerator options'
        }
      ]
    },
    {
      id: 'sample-2',
      title: 'Backyard Patio',
      description: 'Create an outdoor living space with fire pit and seating',
      image_url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'garden',
      target_date: '2023-08-15',
      assets: [
        {
          id: 'sample-asset-3',
          type: 'image',
          url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          quantity: 4,
          cost: 250,
          comments: 'Outdoor chairs'
        },
        {
          id: 'sample-asset-4',
          type: 'image',
          url: 'https://images.pexels.com/photos/6969926/pexels-photo-6969926.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          quantity: 1,
          cost: 400,
          comments: 'Fire pit'
        }
      ]
    },
    {
      id: 'sample-3',
      title: 'Home Office Setup',
      description: 'Ergonomic desk, good lighting, and storage solutions',
      image_url: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'furniture',
      target_date: '2023-06-30',
      assets: [
        {
          id: 'sample-asset-5',
          type: 'link',
          url: 'https://www.ikea.com/us/en/cat/desks-20649/',
          quantity: 1,
          cost: 350,
          comments: 'Standing desk options'
        },
        {
          id: 'sample-asset-6',
          type: 'image',
          url: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          quantity: 1,
          cost: 200,
          comments: 'Office chair'
        },
        {
          id: 'sample-asset-7',
          type: 'link',
          url: 'https://www.amazon.com/s?k=desk+lamp',
          quantity: 2,
          cost: 75,
          comments: 'Desk lamps'
        }
      ]
    }
  ];

  // Display sample items if user has no items yet
  const displayItems = items.length > 0 ? items : (!user ? sampleItems : []);

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Vision Board</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Visualize Your Dream Home
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Create a collection of ideas and inspirations for your home improvement projects.
            {!user && (
              <span className="block mt-2 text-sm font-medium text-blue-600">
                <a href="/login" className="underline">Sign in</a> or <a href="/register" className="underline">register</a> to save your vision board.
              </span>
            )}
          </p>
        </div>

        <div className="mt-10">
          <div className="flex justify-center mb-8">
            <button
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Inspiration
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <VisionBoardForm 
                  onSubmit={handleFormSubmit} 
                  onCancel={handleFormCancel}
                  categories={categories}
                  initialData={editingItem}
                />
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
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

          {displayItems.length === 0 && !loading ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new inspiration to your vision board.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Inspiration
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayItems.map(item => (
                <VisionBoardItem
                  key={item.id}
                  item={item}
                  categories={categories}
                  onEdit={() => handleEditItem(item)}
                  onDelete={() => handleDeleteItem(item.id)}
                  isDemo={!user && items.length === 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisionBoard;
