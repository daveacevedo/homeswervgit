import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog';

const SAMPLE_VISION_ITEMS = [
  {
    id: 1,
    type: 'image',
    content: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Modern Kitchen Design',
    source: 'Pinterest',
    sourceUrl: 'https://pinterest.com'
  },
  {
    id: 2,
    type: 'image',
    content: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Cozy Living Room',
    source: 'Instagram',
    sourceUrl: 'https://instagram.com'
  },
  {
    id: 3,
    type: 'link',
    content: 'https://www.etsy.com',
    title: 'Handcrafted Decor Items',
    description: 'Beautiful handmade decorations for your home',
    source: 'Etsy',
    sourceUrl: 'https://etsy.com'
  },
  {
    id: 4,
    type: 'image',
    content: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Bathroom Renovation',
    source: 'Home Depot',
    sourceUrl: 'https://homedepot.com'
  },
  {
    id: 5,
    type: 'note',
    content: 'Remember to check dimensions before ordering furniture. The living room is 15x18 feet.',
    title: 'Room Measurements',
    color: 'bg-yellow-100'
  },
  {
    id: 6,
    type: 'image',
    content: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Backyard Patio Ideas',
    source: 'Pinterest',
    sourceUrl: 'https://pinterest.com'
  }
];

const POPULAR_SOURCES = [
  { name: 'Pinterest', url: 'https://pinterest.com', icon: 'pinterest' },
  { name: 'Etsy', url: 'https://etsy.com', icon: 'etsy' },
  { name: 'Home Depot', url: 'https://homedepot.com', icon: 'home' },
  { name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
  { name: 'Bed Bath & Beyond', url: 'https://bedbathandbeyond.com', icon: 'store' },
  { name: 'Wayfair', url: 'https://wayfair.com', icon: 'chair' }
];

const VisionBoard = () => {
  const { user } = useAuth();
  const [visionItems, setVisionItems] = useState([]);
  const [newItemType, setNewItemType] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    type: 'image',
    title: '',
    content: '',
    source: '',
    sourceUrl: '',
    description: ''
  });
  const [draggedItem, setDraggedItem] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Load sample items initially
    setVisionItems(SAMPLE_VISION_ITEMS);
    
    // Check local storage for saved items if user is logged in
    if (user) {
      const savedItems = localStorage.getItem(`visionBoard_${user.id}`);
      if (savedItems) {
        setVisionItems(JSON.parse(savedItems));
      }
    }
  }, [user]);

  const handleAddItem = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    setShowAddItemDialog(true);
  };

  const handleSaveItem = () => {
    if (!newItem.title || !newItem.content) {
      return; // Don't save incomplete items
    }
    
    const updatedItem = {
      ...newItem,
      id: Date.now()
    };
    
    const updatedItems = [...visionItems, updatedItem];
    setVisionItems(updatedItems);
    
    // Save to local storage if user is logged in
    if (user) {
      localStorage.setItem(`visionBoard_${user.id}`, JSON.stringify(updatedItems));
    }
    
    // Reset form and close dialog
    setNewItem({
      type: 'image',
      title: '',
      content: '',
      source: '',
      sourceUrl: '',
      description: ''
    });
    setShowAddItemDialog(false);
  };

  const handleRemoveItem = (id) => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    const updatedItems = visionItems.filter(item => item.id !== id);
    setVisionItems(updatedItems);
    
    // Save to local storage if user is logged in
    if (user) {
      localStorage.setItem(`visionBoard_${user.id}`, JSON.stringify(updatedItems));
    }
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
    
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (draggedItem === targetId) {
      return;
    }
    
    const items = [...visionItems];
    const draggedItemIndex = items.findIndex(item => item.id === draggedItem);
    const targetIndex = items.findIndex(item => item.id === targetId);
    
    if (draggedItemIndex < 0 || targetIndex < 0) {
      return;
    }
    
    // Reorder items
    const [movedItem] = items.splice(draggedItemIndex, 1);
    items.splice(targetIndex, 0, movedItem);
    
    setVisionItems(items);
    setDraggedItem(null);
    
    // Save to local storage if user is logged in
    if (user) {
      localStorage.setItem(`visionBoard_${user.id}`, JSON.stringify(items));
    }
  };

  const renderVisionItem = (item) => {
    switch (item.type) {
      case 'image':
        return (
          <div 
            key={item.id}
            className="relative group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item.id)}
          >
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
              <img 
                src={item.content} 
                alt={item.title} 
                className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
              {item.source && (
                <p className="mt-1 text-sm text-gray-500">
                  Source: 
                  <a 
                    href={item.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    {item.source}
                  </a>
                </p>
              )}
            </div>
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        );
      
      case 'link':
        return (
          <div 
            key={item.id}
            className="relative group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item.id)}
          >
            <div className="p-4 border-l-4 border-blue-500">
              <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              <a 
                href={item.content} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Visit {item.source}
                <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        );
      
      case 'note':
        return (
          <div 
            key={item.id}
            className={`relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${item.color || 'bg-yellow-100'}`}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item.id)}
          >
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-700">{item.content}</p>
            </div>
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Plan Your Dream Project
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Collect inspiration, save ideas, and organize your vision all in one place.
            {!user && " Sign up to save your vision board."}
          </p>
        </div>

        <div className="mt-12">
          {/* Vision Board Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddItem}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add to Vision Board
              </button>
              
              {!user && hasInteracted && (
                <span className="text-sm text-orange-600 animate-pulse">
                  Sign in to save changes
                </span>
              )}
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Import from:</span>
              <div className="flex space-x-2">
                {POPULAR_SOURCES.slice(0, 4).map(source => (
                  <a
                    key={source.name}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                    title={source.name}
                  >
                    {source.icon === 'pinterest' && (
                      <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                      </svg>
                    )}
                    {source.icon === 'etsy' && (
                      <svg className="h-4 w-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.559 2.576c-.139.303-.3.623-.3 1.182 0 .558.107 1.069.107 1.627 0 .675-.139 1.182-.303 1.627H6.252c-.139-.445-.303-.952-.303-1.627 0-.558.107-1.069.107-1.627 0-.558-.107-.878-.303-1.182H8.56zm6.905 2.364c1.1 0 2.199.558 2.199 2.364 0 1.738-1.1 2.364-2.199 2.364-1.099 0-2.198-.626-2.198-2.364 0-1.806 1.1-2.364 2.198-2.364zm-1.099 2.364c0 .952.433 1.182.866 1.182.433 0 .866-.23.866-1.182 0-.952-.433-1.182-.866-1.182-.433 0-.866.23-.866 1.182zm-9.103-2.364h2.198c1.1 0 1.732.626 1.732 1.738 0 .815-.433 1.294-.866 1.516.433.152.866.626.866 1.516 0 .889-.433 1.806-1.732 1.806H5.262V4.94zm1.099 2.67h.433c.433 0 .866-.152.866-.889 0-.626-.433-.778-.866-.778h-.433v1.667zm0 2.819h.433c.433 0 .866-.152.866-.889 0-.626-.433-.778-.866-.778h-.433v1.667zm5.772-5.489h1.099v2.364h2.198V4.94h1.099v5.687h-1.099V8.486h-2.198v2.141h-1.099V4.94zm-1.099 0h1.099v1.069h-1.099V4.94zm0 1.738h1.099v3.949h-1.099V6.678z" />
                      </svg>
                    )}
                    {source.icon === 'home' && (
                      <svg className="h-4 w-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                      </svg>
                    )}
                    {source.icon === 'instagram' && (
                      <svg className="h-4 w-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    )}
                    {source.icon === 'store' && (
                      <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
                      </svg>
                    )}
                    {source.icon === 'chair' && (
                      <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 10c0-5.51-4.49-10-10-10S0 4.49 0 10h2c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8-8-3.59-8-8H0c0 5.51 4.49 10 10 10s10-4.49 10-10zm-7 1H7v2h6v-2zm2-3.5c0-.83-.67-1.5-1.5-1.5S12 6.67 12 7.5 12.67 9 13.5 9s1.5-.67 1.5-1.5zM8.5 9c.83 0 1.5-.67 1.5-1.5S9.33 6 8.5 6 7 6.67 7 7.5 7.67 9 8.5 9z" />
                      </svg>
                    )}
                  </a>
                ))}
                <div className="relative group">
                  <button className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    {POPULAR_SOURCES.slice(4).map(source => (
                      <a
                        key={source.name}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {source.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Board Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visionItems.map(item => renderVisionItem(item))}
            
            {/* Add Item Card */}
            <div 
              className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              onClick={handleAddItem}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Add to your vision board</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add images, links, or notes to plan your project
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-blue-700 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:py-16">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ready to bring your vision to life?
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-blue-100">
                Sign up to save your vision board and connect with trusted service professionals who can help make your dream project a reality.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="sm:flex">
                <Link
                  to="/register"
                  className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-8"
                >
                  Sign up for free
                </Link>
                <Link
                  to="/login"
                  className="mt-3 flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 bg-opacity-60 hover:bg-opacity-70 sm:mt-0 sm:ml-3 md:py-4 md:text-lg md:px-8"
                >
                  Sign in
                </Link>
              </div>
              <p className="mt-3 text-sm text-blue-100">
                No credit card required. Start planning your project today.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-medium text-gray-900">
              Save your vision board
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Sign in or create an account to save your vision board and access it from any device.
            </p>
          </div>
          <DialogFooter className="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse">
            <Link
              to="/register"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setShowLoginPrompt(false)}
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={() => setShowLoginPrompt(false)}
            >
              Sign in
            </Link>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={() => setShowLoginPrompt(false)}
            >
              Continue without saving
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={showAddItemDialog} onClose={() => setShowAddItemDialog(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-900">
              Add to Vision Board
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="item-type" className="block text-sm font-medium text-gray-700">
                  Item Type
                </label>
                <select
                  id="item-type"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={newItem.type}
                  onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                >
                  <option value="image">Image</option>
                  <option value="link">Link</option>
                  <option value="note">Note</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="item-title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="item-title"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter a title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                />
              </div>
              
              {newItem.type === 'image' && (
                <div>
                  <label htmlFor="item-image" className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="item-image"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://example.com/image.jpg"
                    value={newItem.content}
                    onChange={(e) => setNewItem({...newItem, content: e.target.value})}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the URL of an image from the web
                  </p>
                </div>
              )}
              
              {newItem.type === 'link' && (
                <>
                  <div>
                    <label htmlFor="item-link" className="block text-sm font-medium text-gray-700">
                      Link URL
                    </label>
                    <input
                      type="text"
                      id="item-link"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="https://example.com"
                      value={newItem.content}
                      onChange={(e) => setNewItem({...newItem, content: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="item-description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="item-description"
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Describe this link"
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    />
                  </div>
                </>
              )}
              
              {newItem.type === 'note' && (
                <div>
                  <label htmlFor="item-note" className="block text-sm font-medium text-gray-700">
                    Note
                  </label>
                  <textarea
                    id="item-note"
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your note"
                    value={newItem.content}
                    onChange={(e) => setNewItem({...newItem, content: e.target.value})}
                  />
                </div>
              )}
              
              {(newItem.type === 'image' || newItem.type === 'link') && (
                <div>
                  <label htmlFor="item-source" className="block text-sm font-medium text-gray-700">
                    Source (Optional)
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      id="item-source"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Pinterest, Etsy, etc."
                      value={newItem.source}
                      onChange={(e) => setNewItem({...newItem, source: e.target.value})}
                    />
                    <input
                      type="text"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="https://source.com"
                      value={newItem.sourceUrl}
                      onChange={(e) => setNewItem({...newItem, sourceUrl: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowAddItemDialog(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="ml-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSaveItem}
            >
              Add to Board
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisionBoard;
