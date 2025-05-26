import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useHomeowner } from '../../contexts/HomeownerContext'

function Inspiration() {
  const { createVisionBoard, visionBoards } = useHomeowner()
  const [inspirationItems, setInspirationItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddToVisionBoard, setShowAddToVisionBoard] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedVisionBoard, setSelectedVisionBoard] = useState('')
  const [newVisionBoardName, setNewVisionBoardName] = useState('')
  const [newVisionBoardCategory, setNewVisionBoardCategory] = useState('Kitchen')
  const [createNewBoard, setCreateNewBoard] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  const categories = [
    'all',
    'Kitchen',
    'Bathroom',
    'Living Room',
    'Bedroom',
    'Outdoor',
    'Home Office',
    'Landscaping'
  ]
  
  useEffect(() => {
    fetchInspirationItems()
  }, [selectedCategory])
  
  const fetchInspirationItems = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('inspiration_gallery')
        .select('*')
      
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      
      setInspirationItems(data || [])
    } catch (error) {
      console.error('Error fetching inspiration items:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (e) => {
    e.preventDefault()
    // Filter items based on search query
    // This is a client-side search for simplicity
  }
  
  const filteredItems = searchQuery
    ? inspirationItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : inspirationItems
  
  const openAddToVisionBoard = (item) => {
    setSelectedItem(item)
    setShowAddToVisionBoard(true)
    setSelectedVisionBoard('')
    setCreateNewBoard(false)
    setNewVisionBoardName('')
    setNewVisionBoardCategory('Kitchen')
  }
  
  const handleAddToVisionBoard = async () => {
    try {
      setSaving(true)
      setError(null)
      
      let targetVisionBoardId = selectedVisionBoard
      
      // Create a new vision board if needed
      if (createNewBoard) {
        if (!newVisionBoardName) {
          setError('Please enter a name for the new vision board')
          return
        }
        
        const newBoard = await createVisionBoard({
          title: newVisionBoardName,
          description: `Vision board for ${newVisionBoardCategory} inspiration`,
          category: newVisionBoardCategory
        })
        
        targetVisionBoardId = newBoard.id
      } else if (!targetVisionBoardId) {
        setError('Please select a vision board')
        return
      }
      
      // Add the item to the vision board
      const { data, error } = await supabase
        .from('vision_board_items')
        .insert([
          {
            vision_board_id: targetVisionBoardId,
            title: selectedItem.title,
            description: selectedItem.description,
            image_url: selectedItem.image_url,
            source_url: selectedItem.source_url,
            tags: selectedItem.tags
          }
        ])
      
      if (error) throw error
      
      setSuccess('Added to vision board successfully!')
      setShowAddToVisionBoard(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error adding to vision board:', error)
      setError('Failed to add to vision board. Please try again.')
    } finally {
      setSaving(false)
    }
  }
  
  if (loading && inspirationItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inspiration Gallery</h1>
        <p className="mt-1 text-sm text-gray-500">
          Browse ideas and inspiration for your home projects.
        </p>
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
      
      {/* Filters and Search */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <form onSubmit={handleSearch} className="flex rounded-md shadow-sm">
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md sm:text-sm border-gray-300"
                placeholder="Search inspiration..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Inspiration Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="relative pb-2/3">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="absolute h-64 w-full object-cover"
                />
              </div>
              <div className="px-4 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                </div>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {item.category}
                  </span>
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <button
                    onClick={() => openAddToVisionBoard(item)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add to Vision Board
                  </button>
                </div>
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No inspiration found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        </div>
      )}
      
      {/* Add to Vision Board Modal */}
      {showAddToVisionBoard && selectedItem && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Add to Vision Board
                    </h3>
                    <div className="mt-2">
                      <div className="flex items-center space-x-4">
                        <img
                          src={selectedItem.image_url}
                          alt={selectedItem.title}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{selectedItem.title}</h4>
                          <p className="text-sm text-gray-500">{selectedItem.category}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center">
                        <input
                          id="use-existing"
                          name="board-option"
                          type="radio"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          checked={!createNewBoard}
                          onChange={() => setCreateNewBoard(false)}
                        />
                        <label htmlFor="use-existing" className="ml-2 block text-sm text-gray-900">
                          Add to existing vision board
                        </label>
                      </div>
                      
                      {!createNewBoard && (
                        <div className="mt-2">
                          <select
                            id="vision-board"
                            name="vision-board"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={selectedVisionBoard}
                            onChange={(e) => setSelectedVisionBoard(e.target.value)}
                          >
                            <option value="">Select a vision board</option>
                            {visionBoards.map((board) => (
                              <option key={board.id} value={board.id}>
                                {board.title} ({board.category})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      <div className="mt-4 flex items-center">
                        <input
                          id="create-new"
                          name="board-option"
                          type="radio"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          checked={createNewBoard}
                          onChange={() => setCreateNewBoard(true)}
                        />
                        <label htmlFor="create-new" className="ml-2 block text-sm text-gray-900">
                          Create new vision board
                        </label>
                      </div>
                      
                      {createNewBoard && (
                        <div className="mt-2 space-y-4">
                          <div>
                            <label htmlFor="board-name" className="block text-sm font-medium text-gray-700">
                              Vision Board Name
                            </label>
                            <input
                              type="text"
                              name="board-name"
                              id="board-name"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={newVisionBoardName}
                              onChange={(e) => setNewVisionBoardName(e.target.value)}
                              placeholder="My Kitchen Inspiration"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="board-category" className="block text-sm font-medium text-gray-700">
                              Category
                            </label>
                            <select
                              id="board-category"
                              name="board-category"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                              value={newVisionBoardCategory}
                              onChange={(e) => setNewVisionBoardCategory(e.target.value)}
                            >
                              {categories.filter(c => c !== 'all').map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddToVisionBoard}
                  disabled={saving}
                >
                  {saving ? 'Adding...' : 'Add to Vision Board'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddToVisionBoard(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inspiration
