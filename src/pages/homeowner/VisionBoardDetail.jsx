import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useHomeowner } from '../../contexts/HomeownerContext'

function VisionBoardDetail() {
  const { id } = useParams()
  const { getVisionBoardById, updateVisionBoard, deleteVisionBoardItem, addVisionBoardItem, loading } = useHomeowner()
  const [visionBoard, setVisionBoard] = useState(null)
  const [activeTab, setActiveTab] = useState('inspiration')
  const [showAddItemForm, setShowAddItemForm] = useState(false)
  const [itemFormData, setItemFormData] = useState({
    image_url: '',
    title: '',
    description: '',
    source_url: '',
    tags: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  // Mock data for demonstration purposes
  const mockVisionBoard = {
    id: parseInt(id),
    title: 'Modern Kitchen Renovation',
    description: 'Ideas for my upcoming kitchen remodel with a focus on minimalist design and functionality.',
    category: 'Kitchen',
    created_at: '2023-09-15T10:30:00Z',
    updated_at: '2023-10-05T14:45:00Z',
    property: {
      id: 1,
      name: 'Main Residence',
      address: '123 Home Street, Anytown, USA'
    },
    vision_board_items: [
      {
        id: 1,
        image_url: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: 'White Marble Countertops',
        description: 'Elegant white marble countertops with subtle gray veining for a clean, modern look.',
        source_url: 'https://example.com/marble-countertops',
        tags: ['countertops', 'marble', 'white', 'modern'],
        created_at: '2023-09-16T11:20:00Z'
      },
      {
        id: 2,
        image_url: 'https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: 'Minimalist Cabinet Design',
        description: 'Handle-less cabinets with push-to-open mechanism for a sleek, uncluttered appearance.',
        source_url: 'https://example.com/minimalist-cabinets',
        tags: ['cabinets', 'minimalist', 'modern', 'storage'],
        created_at: '2023-09-18T09:15:00Z'
      },
      {
        id: 3,
        image_url: 'https://images.pexels.com/photos/6207014/pexels-photo-6207014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: 'Pendant Lighting',
        description: 'Contemporary pendant lights to hang over the kitchen island, providing both style and functionality.',
        source_url: 'https://example.com/pendant-lights',
        tags: ['lighting', 'pendant', 'modern', 'fixtures'],
        created_at: '2023-09-20T16:40:00Z'
      },
      {
        id: 4,
        image_url: 'https://images.pexels.com/photos/6489123/pexels-photo-6489123.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: 'Undermount Sink',
        description: 'Deep single-basin undermount sink in stainless steel for a clean look and maximum functionality.',
        source_url: 'https://example.com/undermount-sinks',
        tags: ['sink', 'stainless', 'undermount', 'functional'],
        created_at: '2023-09-22T13:10:00Z'
      },
      {
        id: 5,
        image_url: 'https://images.pexels.com/photos/6444256/pexels-photo-6444256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: 'Hardwood Flooring',
        description: 'Engineered hardwood flooring in a light oak finish to brighten the space and provide durability.',
        source_url: 'https://example.com/hardwood-flooring',
        tags: ['flooring', 'hardwood', 'oak', 'durable'],
        created_at: '2023-09-25T10:05:00Z'
      },
      {
        id: 6,
        image_url: 'https://images.pexels.com/photos/6312364/pexels-photo-6312364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: 'Smart Refrigerator',
        description: 'Built-in smart refrigerator with customizable temperature zones and WiFi connectivity.',
        source_url: 'https://example.com/smart-refrigerators',
        tags: ['appliances', 'refrigerator', 'smart', 'technology'],
        created_at: '2023-09-28T14:30:00Z'
      }
    ]
  }
  
  // Mock inspiration items for the inspiration tab
  const inspirationItems = [
    {
      id: 101,
      image_url: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Open Concept Kitchen',
      description: 'Spacious open concept kitchen with island and bar seating.',
      source_url: 'https://example.com/open-concept',
      tags: ['open concept', 'island', 'modern']
    },
    {
      id: 102,
      image_url: 'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Subway Tile Backsplash',
      description: 'Classic white subway tile backsplash with dark grout for contrast.',
      source_url: 'https://example.com/subway-tile',
      tags: ['backsplash', 'subway tile', 'white', 'classic']
    },
    {
      id: 103,
      image_url: 'https://images.pexels.com/photos/3926542/pexels-photo-3926542.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Butcher Block Island',
      description: 'Kitchen island with butcher block countertop for a warm, natural element.',
      source_url: 'https://example.com/butcher-block',
      tags: ['island', 'butcher block', 'wood', 'natural']
    },
    {
      id: 104,
      image_url: 'https://images.pexels.com/photos/6969926/pexels-photo-6969926.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Matte Black Fixtures',
      description: 'Modern matte black faucet and cabinet hardware for a bold statement.',
      source_url: 'https://example.com/matte-black',
      tags: ['fixtures', 'matte black', 'modern', 'hardware']
    },
    {
      id: 105,
      image_url: 'https://images.pexels.com/photos/6186504/pexels-photo-6186504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Glass Cabinet Doors',
      description: 'Upper cabinets with glass doors to display dishware and add visual interest.',
      source_url: 'https://example.com/glass-cabinets',
      tags: ['cabinets', 'glass', 'display', 'storage']
    },
    {
      id: 106,
      image_url: 'https://images.pexels.com/photos/6508947/pexels-photo-6508947.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Pot Filler',
      description: 'Wall-mounted pot filler above the stove for convenience when cooking.',
      source_url: 'https://example.com/pot-filler',
      tags: ['fixtures', 'pot filler', 'convenience', 'cooking']
    }
  ]
  
  useEffect(() => {
    // In a real implementation, this would fetch data from Supabase
    // For now, we'll use mock data
    const fetchVisionBoard = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // In a real implementation, this would be:
        // const data = await getVisionBoardById(id)
        // setVisionBoard(data)
        
        setVisionBoard(mockVisionBoard)
      } catch (error) {
        console.error('Error fetching vision board:', error)
        setError('Failed to load vision board. Please try again later.')
      }
    }
    
    fetchVisionBoard()
  }, [id])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setItemFormData({
      ...itemFormData,
      [name]: value
    })
  }
  
  const handleAddItem = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)
      
      // In a real implementation, this would be:
      // await addVisionBoardItem(id, itemFormData)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Add the new item to the local state
      const newItem = {
        id: Math.floor(Math.random() * 1000) + 10, // Generate a random ID for demo
        ...itemFormData,
        tags: itemFormData.tags.split(',').map(tag => tag.trim()),
        created_at: new Date().toISOString()
      }
      
      setVisionBoard({
        ...visionBoard,
        vision_board_items: [...visionBoard.vision_board_items, newItem]
      })
      
      // Reset form
      setItemFormData({
        image_url: '',
        title: '',
        description: '',
        source_url: '',
        tags: ''
      })
      
      setShowAddItemForm(false)
      setSuccess('Item added successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error adding vision board item:', error)
      setError('Failed to add item. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to remove this item from your vision board?')) {
      return
    }
    
    try {
      // In a real implementation, this would be:
      // await deleteVisionBoardItem(id, itemId)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Remove the item from the local state
      setVisionBoard({
        ...visionBoard,
        vision_board_items: visionBoard.vision_board_items.filter(item => item.id !== itemId)
      })
      
      setSuccess('Item removed successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error deleting vision board item:', error)
      setError('Failed to remove item. Please try again.')
    }
  }
  
  const handleAddFromInspiration = async (item) => {
    try {
      // In a real implementation, this would be:
      // await addVisionBoardItem(id, {
      //   image_url: item.image_url,
      //   title: item.title,
      //   description: item.description,
      //   source_url: item.source_url,
      //   tags: item.tags.join(',')
      // })
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Add the item to the local state
      const newItem = {
        id: Math.floor(Math.random() * 1000) + 10, // Generate a random ID for demo
        ...item,
        created_at: new Date().toISOString()
      }
      
      setVisionBoard({
        ...visionBoard,
        vision_board_items: [...visionBoard.vision_board_items, newItem]
      })
      
      setSuccess('Item added to your vision board!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error adding vision board item:', error)
      setError('Failed to add item. Please try again.')
    }
  }
  
  if (loading || !visionBoard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{visionBoard.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {visionBoard.description}
            </p>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {visionBoard.category}
              </span>
              {visionBoard.property && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {visionBoard.property.name}
                </span>
              )}
              <span className="ml-2 text-xs text-gray-500">
                Created {new Date(visionBoard.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddItemForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Item
            </button>
            <Link
              to={`/homeowner/projects/new?vision_board=${visionBoard.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Create Project
            </Link>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Board
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Item Form */}
      {showAddItemForm && (
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Add Vision Board Item</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a new item to your vision board. Include an image URL, title, and description.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleAddItem}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      id="image_url"
                      required
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={itemFormData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={itemFormData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="source_url" className="block text-sm font-medium text-gray-700">
                      Source URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="source_url"
                      id="source_url"
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={itemFormData.source_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/source"
                    />
                  </div>
                  
                  <div className="col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={itemFormData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="col-span-6">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      id="tags"
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={itemFormData.tags}
                      onChange={handleInputChange}
                      placeholder="modern, kitchen, white, marble"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => setShowAddItemForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    disabled={submitting}
                  >
                    {submitting ? 'Adding...' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('items')}
            className={`${
              activeTab === 'items'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            My Items ({visionBoard.vision_board_items.length})
          </button>
          <button
            onClick={() => setActiveTab('inspiration')}
            className={`${
              activeTab === 'inspiration'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Inspiration
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`${
              activeTab === 'ai'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            AI Suggestions
          </button>
        </nav>
      </div>
      
      {/* My Items Tab */}
      {activeTab === 'items' && (
        <div>
          {visionBoard.vision_board_items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visionBoard.vision_board_items.map((item) => (
                <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="relative pb-2/3">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="absolute h-64 w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{item.description}</p>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1">
                        {item.tags && item.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {item.source_url && (
                      <div className="mt-4">
                        <a 
                          href={item.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                          View Source
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No items</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding items to your vision board.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddItemForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Inspiration Tab */}
      {activeTab === 'inspiration' && (
        <div>
          <div className="mb-4">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search for inspiration..."
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {inspirationItems.map((item) => (
              <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="relative pb-2/3">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="absolute h-64 w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                    <button
                      onClick={() => handleAddFromInspiration(item)}
                      className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{item.description}</p>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-1">
                      {item.tags && item.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {item.source_url && (
                    <div className="mt-4">
                      <a 
                        href={item.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary-600 hover:text-primary-500"
                      >
                        View Source
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* AI Suggestions Tab */}
      {activeTab === 'ai' && (
        <div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">AI Design Assistant</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Describe what you're looking for, and our AI will generate personalized design suggestions for your {visionBoard.category.toLowerCase()}.
                </p>
              </div>
              <form className="mt-5">
                <div className="flex-1">
                  <textarea
                    rows={3}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder={`Example: I want a modern ${visionBoard.category.toLowerCase()} with white cabinets, marble countertops, and gold fixtures.`}
                  ></textarea>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Generate Suggestions
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No AI suggestions yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Use the form above to generate personalized design suggestions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VisionBoardDetail
