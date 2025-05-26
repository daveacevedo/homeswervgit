import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHomeowner } from '../../contexts/HomeownerContext'

function VisionBoards() {
  const { visionBoards, properties, createVisionBoard, loading } = useHomeowner()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Kitchen',
    property_id: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  const categories = [
    'Kitchen',
    'Bathroom',
    'Living Room',
    'Bedroom',
    'Outdoor',
    'Home Office',
    'Landscaping',
    'Other'
  ]
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleCreateVisionBoard = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)
      
      await createVisionBoard(formData)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Kitchen',
        property_id: ''
      })
      
      setShowCreateForm(false)
      setSuccess('Vision board created successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error creating vision board:', error)
      setError('Failed to create vision board. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Kitchen':
        return 'M19 15v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2m3-4H8a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2v-4a2 2 0 00-2-2h-1m-1-4l-3-3m0 0l-3 3m3-3v12'
      case 'Bathroom':
        return 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
      case 'Living Room':
        return 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      case 'Bedroom':
        return 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'
      case 'Outdoor':
        return 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
      case 'Home Office':
        return 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
      case 'Landscaping':
        return 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
      default:
        return 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vision Boards</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create and manage your project vision boards.
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
      
      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Vision Board
        </button>
        <Link
          to="/homeowner/inspiration"
          className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          Browse Inspiration
        </Link>
      </div>
      
      {/* Create Vision Board Form */}
      {showCreateForm && (
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Create Vision Board</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create a new vision board to collect and organize your project ideas.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleCreateVisionBoard}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.title}
                      onChange={handleInputChange}
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
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="property_id" className="block text-sm font-medium text-gray-700">
                      Property (Optional)
                    </label>
                    <select
                      id="property_id"
                      name="property_id"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.property_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a property</option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Vision Boards Grid */}
      {visionBoards.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visionBoards.map((board) => (
            <Link
              key={board.id}
              to={`/homeowner/vision-boards/${board.id}`}
              className="block bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={getCategoryIcon(board.category)} />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{board.title}</h3>
                    <p className="text-sm text-gray-500">{board.category}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {board.description || 'No description provided.'}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                      <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-500">
                      {board.vision_board_items?.length || 0} items
                    </span>
                  </div>
                  
                  <span className="text-sm text-gray-500">
                    {new Date(board.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No vision boards</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new vision board.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Vision Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VisionBoards
