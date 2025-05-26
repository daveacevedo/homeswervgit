import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function Portfolio() {
  const { providerProfile } = useAuth()
  const [portfolioItems, setPortfolioItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_id: '',
    location: '',
    completion_date: '',
    images: [],
    featured: false
  })
  const [services, setServices] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  useEffect(() => {
    if (providerProfile) {
      fetchPortfolioItems()
      fetchServices()
    }
  }, [providerProfile])
  
  const fetchPortfolioItems = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('portfolio_items')
        .select(`
          *,
          services (
            id,
            name
          )
        `)
        .eq('provider_id', providerProfile.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setPortfolioItems(data || [])
    } catch (error) {
      console.error('Error fetching portfolio items:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_services')
        .select(`
          service_id,
          services (
            id,
            name
          )
        `)
        .eq('provider_id', providerProfile.id)
      
      if (error) throw error
      
      // Extract unique services
      const uniqueServices = data.reduce((acc, item) => {
        if (item.services && !acc.some(s => s.id === item.services.id)) {
          acc.push(item.services)
        }
        return acc
      }, [])
      
      setServices(uniqueServices)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isUnderLimit = file.size <= 5 * 1024 * 1024 // 5MB limit
      
      if (!isImage) {
        setError('Only image files are allowed.')
      } else if (!isUnderLimit) {
        setError('Images must be under 5MB.')
      }
      
      return isImage && isUnderLimit
    })
    
    if (validFiles.length > 0) {
      setError(null)
      setFormData({
        ...formData,
        images: [...formData.images, ...validFiles]
      })
    }
  }
  
  const removeImage = (index) => {
    const updatedImages = [...formData.images]
    updatedImages.splice(index, 1)
    setFormData({
      ...formData,
      images: updatedImages
    })
  }
  
  const uploadImages = async (images) => {
    const uploadedUrls = []
    setUploadingImages(true)
    setUploadProgress(0)
    
    try {
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `portfolio/${providerProfile.id}/${fileName}`
        
        const { data, error } = await supabase.storage
          .from('portfolio')
          .upload(filePath, file)
        
        if (error) throw error
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath)
        
        uploadedUrls.push(urlData.publicUrl)
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / images.length) * 100))
      }
      
      return uploadedUrls
    } catch (error) {
      console.error('Error uploading images:', error)
      throw error
    } finally {
      setUploadingImages(false)
    }
  }
  
  const handleAddPortfolioItem = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)
      
      let imageUrls = []
      
      if (formData.images.length > 0) {
        imageUrls = await uploadImages(formData.images)
      }
      
      const itemData = {
        provider_id: providerProfile.id,
        title: formData.title,
        description: formData.description,
        service_id: formData.service_id,
        location: formData.location,
        completion_date: formData.completion_date,
        images: imageUrls,
        featured: formData.featured
      }
      
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([itemData])
        .select(`
          *,
          services (
            id,
            name
          )
        `)
      
      if (error) throw error
      
      // Add the new item to the list
      setPortfolioItems([data[0], ...portfolioItems])
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        service_id: '',
        location: '',
        completion_date: '',
        images: [],
        featured: false
      })
      
      setShowAddForm(false)
      setSuccess('Portfolio item added successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error adding portfolio item:', error)
      setError('Failed to add portfolio item. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  const handleEditPortfolioItem = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)
      
      let imageUrls = currentItem.images || []
      
      if (formData.images.length > 0) {
        const newImageUrls = await uploadImages(formData.images)
        imageUrls = [...imageUrls, ...newImageUrls]
      }
      
      const itemData = {
        title: formData.title,
        description: formData.description,
        service_id: formData.service_id,
        location: formData.location,
        completion_date: formData.completion_date,
        images: imageUrls,
        featured: formData.featured
      }
      
      const { data, error } = await supabase
        .from('portfolio_items')
        .update(itemData)
        .eq('id', currentItem.id)
        .select(`
          *,
          services (
            id,
            name
          )
        `)
      
      if (error) throw error
      
      // Update the item in the list
      setPortfolioItems(
        portfolioItems.map(item => 
          item.id === currentItem.id ? data[0] : item
        )
      )
      
      setShowEditForm(false)
      setCurrentItem(null)
      setSuccess('Portfolio item updated successfully!')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        service_id: '',
        location: '',
        completion_date: '',
        images: [],
        featured: false
      })
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error updating portfolio item:', error)
      setError('Failed to update portfolio item. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  const handleDeletePortfolioItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this portfolio item?')) {
      return
    }
    
    try {
      setError(null)
      
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', itemId)
      
      if (error) throw error
      
      // Remove the item from the list
      setPortfolioItems(
        portfolioItems.filter(item => item.id !== itemId)
      )
      
      setSuccess('Portfolio item deleted successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
      setError('Failed to delete portfolio item. Please try again.')
    }
  }
  
  const openEditForm = (item) => {
    setCurrentItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      service_id: item.service_id,
      location: item.location,
      completion_date: item.completion_date ? new Date(item.completion_date).toISOString().split('T')[0] : '',
      images: [],
      featured: item.featured
    })
    setShowEditForm(true)
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  if (loading && portfolioItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        <p className="mt-1 text-sm text-gray-500">
          Showcase your best work to attract new customers.
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
      
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Portfolio Item
        </button>
      </div>
      
      {/* Portfolio Grid */}
      {portfolioItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="relative pb-2/3">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="absolute h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute h-full w-full bg-gray-200 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {item.featured && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 text-xs font-bold">
                    Featured
                  </div>
                )}
              </div>
              <div className="px-4 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditForm(item)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeletePortfolioItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {formatDate(item.completion_date)}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {item.location || 'Location not specified'}
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {item.services?.name || 'General Service'}
                  </span>
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No portfolio items</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first portfolio item.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Portfolio Item
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Portfolio Item Modal */}
      {showAddForm && (
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
                      Add Portfolio Item
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleAddPortfolioItem}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                              Title
                            </label>
                            <input
                              type="text"
                              name="title"
                              id="title"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={formData.title}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              rows="3"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={formData.description}
                              onChange={handleInputChange}
                              required
                            ></textarea>
                          </div>
                          
                          <div>
                            <label htmlFor="service_id" className="block text-sm font-medium text-gray-700">
                              Service Type
                            </label>
                            <select
                              id="service_id"
                              name="service_id"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                              value={formData.service_id}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select a service</option>
                              {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                  {service.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                              Location
                            </label>
                            <input
                              type="text"
                              name="location"
                              id="location"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              placeholder="e.g., Chicago, IL"
                              value={formData.location}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="completion_date" className="block text-sm font-medium text-gray-700">
                              Completion Date
                            </label>
                            <input
                              type="date"
                              name="completion_date"
                              id="completion_date"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={formData.completion_date}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Images
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                              <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                    <span>Upload images</span>
                                    <input
                                      id="images"
                                      name="images"
                                      type="file"
                                      className="sr-only"
                                      multiple
                                      accept="image/*"
                                      onChange={handleImageChange}
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 5MB
                                </p>
                              </div>
                            </div>
                            
                            {formData.images.length > 0 && (
                              <div className="mt-4 grid grid-cols-3 gap-2">
                                {formData.images.map((image, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={URL.createObjectURL(image)}
                                      alt={`Preview ${index}`}
                                      className="h-20 w-20 object-cover rounded-md"
                                    />
                                    <button
                                      type="button"
                                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                      onClick={() => removeImage(index)}
                                    >
                                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="featured"
                              name="featured"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={formData.featured}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                              Feature this item in your portfolio
                            </label>
                          </div>
                        </div>
                        
                        {uploadingImages && (
                          <div className="mt-4">
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200">
                                    Uploading Images
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-semibold inline-block text-primary-600">
                                    {uploadProgress}%
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                                <div
                                  style={{ width: `${uploadProgress}%` }}
                                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                            disabled={submitting || uploadingImages}
                          >
                            {submitting ? 'Adding...' : 'Add Portfolio Item'}
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={() => setShowAddForm(false)}
                            disabled={submitting || uploadingImages}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Portfolio Item Modal */}
      {showEditForm && currentItem && (
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
                      Edit Portfolio Item
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleEditPortfolioItem}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                              Title
                            </label>
                            <input
                              type="text"
                              name="title"
                              id="title"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={formData.title}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              rows="3"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={formData.description}
                              onChange={handleInputChange}
                              required
                            ></textarea>
                          </div>
                          
                          <div>
                            <label htmlFor="service_id" className="block text-sm font-medium text-gray-700">
                              Service Type
                            </label>
                            <select
                              id="service_id"
                              name="service_id"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                              value={formData.service_id}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select a service</option>
                              {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                  {service.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                              Location
                            </label>
                            <input
                              type="text"
                              name="location"
                              id="location"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              placeholder="e.g., Chicago, IL"
                              value={formData.location}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="completion_date" className="block text-sm font-medium text-gray-700">
                              Completion Date
                            </label>
                            <input
                              type="date"
                              name="completion_date"
                              id="completion_date"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={formData.completion_date}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Current Images
                            </label>
                            {currentItem.images && currentItem.images.length > 0 ? (
                              <div className="mt-2 grid grid-cols-3 gap-2">
                                {currentItem.images.map((image, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={image}
                                      alt={`Image ${index}`}
                                      className="h-20 w-20 object-cover rounded-md"
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="mt-2 text-sm text-gray-500">No images uploaded</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Add More Images
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                              <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label htmlFor="edit-images" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                    <span>Upload images</span>
                                    <input
                                      id="edit-images"
                                      name="images"
                                      type="file"
                                      className="sr-only"
                                      multiple
                                      accept="image/*"
                                      onChange={handleImageChange}
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 5MB
                                </p>
                              </div>
                            </div>
                            
                            {formData.images.length > 0 && (
                              <div className="mt-4 grid grid-cols-3 gap-2">
                                {formData.images.map((image, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={URL.createObjectURL(image)}
                                      alt={`Preview ${index}`}
                                      className="h-20 w-20 object-cover rounded-md"
                                    />
                                    <button
                                      type="button"
                                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                      onClick={() => removeImage(index)}
                                    >
                                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="featured"
                              name="featured"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={formData.featured}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                              Feature this item in your portfolio
                            </label>
                          </div>
                        </div>
                        
                        {uploadingImages && (
                          <div className="mt-4">
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200">
                                    Uploading Images
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-semibold inline-block text-primary-600">
                                    {uploadProgress}%
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                                <div
                                  style={{ width: `${uploadProgress}%` }}
                                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                            disabled={submitting || uploadingImages}
                          >
                            {submitting ? 'Updating...' : 'Update Portfolio Item'}
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={() => {
                              setShowEditForm(false)
                              setCurrentItem(null)
                            }}
                            disabled={submitting || uploadingImages}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Portfolio
