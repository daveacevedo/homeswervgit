import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PlusIcon, ArrowDownTrayIcon, ShareIcon, TrashIcon } from '@heroicons/react/24/outline';

const VisionBoard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    imageUrl: '',
    sourceUrl: '',
    notes: ''
  });
  const [draggedItem, setDraggedItem] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('visionBoardItems');
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (error) {
        console.error('Error parsing saved vision board items:', error);
        setItems([]);
      }
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('visionBoardItems', JSON.stringify(items));
    }
  }, [items]);

  const handleAddItem = () => {
    if (!newItem.title || !newItem.imageUrl) {
      return;
    }

    const itemToAdd = {
      id: Date.now().toString(),
      ...newItem,
      createdAt: new Date().toISOString()
    };

    setItems([...items, itemToAdd]);
    setNewItem({
      title: '',
      imageUrl: '',
      sourceUrl: '',
      notes: ''
    });
    setShowAddModal(false);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleDragStart = (e, id) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedItem === targetId) {
      return;
    }

    const itemsCopy = [...items];
    const draggedItemIndex = itemsCopy.findIndex(item => item.id === draggedItem);
    const targetItemIndex = itemsCopy.findIndex(item => item.id === targetId);
    
    if (draggedItemIndex !== -1 && targetItemIndex !== -1) {
      const [movedItem] = itemsCopy.splice(draggedItemIndex, 1);
      itemsCopy.splice(targetItemIndex, 0, movedItem);
      setItems(itemsCopy);
    }
    
    setDraggedItem(null);
  };

  const handleSaveBoard = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    // If user is logged in, we would save to the database
    // For now, just show a success message
    alert('Vision board saved successfully!');
  };

  const handleShareBoard = () => {
    // Implement sharing functionality
    alert('Sharing functionality coming soon!');
  };

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Your Home Renovation Vision Board
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Collect and organize inspiration for your home renovation projects.
            Drag and drop to arrange your ideas.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Item
            </button>
            <button
              onClick={handleSaveBoard}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Save Board
            </button>
            <button
              onClick={handleShareBoard}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ShareIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Share
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No items</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding some inspiration to your vision board.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Item
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item.id)}
              >
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="object-cover w-full h-48"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-500 mt-1 block truncate"
                    >
                      Source Link
                    </a>
                  )}
                  {item.notes && (
                    <p className="mt-2 text-sm text-gray-500 line-clamp-3">{item.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-75 text-gray-600 hover:text-red-500 focus:outline-none"
                >
                  <TrashIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Add to Vision Board</h3>
                  <div className="mt-2">
                    <div className="mb-4">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 text-left">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Kitchen Backsplash"
                        value={newItem.title}
                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 text-left">
                        Image URL *
                      </label>
                      <input
                        type="url"
                        name="imageUrl"
                        id="imageUrl"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="https://example.com/image.jpg"
                        value={newItem.imageUrl}
                        onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700 text-left">
                        Source URL (optional)
                      </label>
                      <input
                        type="url"
                        name="sourceUrl"
                        id="sourceUrl"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="https://pinterest.com/pin/123456789"
                        value={newItem.sourceUrl}
                        onChange={(e) => setNewItem({ ...newItem, sourceUrl: e.target.value })}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 text-left">
                        Notes (optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="I like the subway tile pattern and the gray grout."
                        value={newItem.notes}
                        onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  onClick={handleAddItem}
                >
                  Add to Board
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Sign in to save your vision board</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Create an account or sign in to save your vision board and access it from any device.
                      You'll also be able to share it with service providers.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <Link
                  to="/register"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Sign In
                </Link>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  className="w-full text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  Continue without saving
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionBoard;
