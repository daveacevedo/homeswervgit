import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProvider } from '../../contexts/ProviderContext';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  CameraIcon,
  KeyIcon,
  TagIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  GlobeAltIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateUserProfile, updatePassword } = useAuth();
  const { providerProfile, updateProviderProfile } = useProvider();
  
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    website: '',
    description: ''
  });
  
  const [serviceInfo, setServiceInfo] = useState({
    categories: [],
    services: [],
    serviceArea: '',
    serviceRadius: 25,
    availability: {
      monday: { available: true, start: '08:00', end: '17:00' },
      tuesday: { available: true, start: '08:00', end: '17:00' },
      wednesday: { available: true, start: '08:00', end: '17:00' },
      thursday: { available: true, start: '08:00', end: '17:00' },
      friday: { available: true, start: '08:00', end: '17:00' },
      saturday: { available: false, start: '09:00', end: '15:00' },
      sunday: { available: false, start: '09:00', end: '15:00' }
    }
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Available service categories
  const availableCategories = [
    { id: 'plumbing', name: 'Plumbing' },
    { id: 'electrical', name: 'Electrical' },
    { id: 'hvac', name: 'HVAC' },
    { id: 'carpentry', name: 'Carpentry' },
    { id: 'painting', name: 'Painting' },
    { id: 'landscaping', name: 'Landscaping' },
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'roofing', name: 'Roofing' },
    { id: 'flooring', name: 'Flooring' },
    { id: 'general', name: 'General Contracting' }
  ];
  
  // Available services by category
  const availableServices = {
    plumbing: [
      { id: 'plumbing-repair', name: 'Plumbing Repair' },
      { id: 'pipe-installation', name: 'Pipe Installation' },
      { id: 'drain-cleaning', name: 'Drain Cleaning' },
      { id: 'water-heater', name: 'Water Heater Installation/Repair' },
      { id: 'bathroom-remodel', name: 'Bathroom Remodeling' }
    ],
    electrical: [
      { id: 'electrical-repair', name: 'Electrical Repair' },
      { id: 'panel-upgrade', name: 'Panel Upgrade' },
      { id: 'lighting-installation', name: 'Lighting Installation' },
      { id: 'outlet-installation', name: 'Outlet Installation' },
      { id: 'ceiling-fan', name: 'Ceiling Fan Installation' }
    ],
    hvac: [
      { id: 'hvac-repair', name: 'HVAC Repair' },
      { id: 'ac-installation', name: 'AC Installation' },
      { id: 'heating-installation', name: 'Heating Installation' },
      { id: 'duct-cleaning', name: 'Duct Cleaning' },
      { id: 'thermostat', name: 'Thermostat Installation' }
    ],
    carpentry: [
      { id: 'cabinet-installation', name: 'Cabinet Installation' },
      { id: 'deck-building', name: 'Deck Building' },
      { id: 'framing', name: 'Framing' },
      { id: 'trim-work', name: 'Trim Work' },
      { id: 'door-installation', name: 'Door Installation' }
    ],
    painting: [
      { id: 'interior-painting', name: 'Interior Painting' },
      { id: 'exterior-painting', name: 'Exterior Painting' },
      { id: 'cabinet-painting', name: 'Cabinet Painting' },
      { id: 'deck-staining', name: 'Deck Staining' },
      { id: 'wallpaper', name: 'Wallpaper Installation/Removal' }
    ],
    landscaping: [
      { id: 'lawn-maintenance', name: 'Lawn Maintenance' },
      { id: 'garden-design', name: 'Garden Design' },
      { id: 'tree-service', name: 'Tree Service' },
      { id: 'irrigation', name: 'Irrigation Installation/Repair' },
      { id: 'hardscaping', name: 'Hardscaping' }
    ],
    cleaning: [
      { id: 'house-cleaning', name: 'House Cleaning' },
      { id: 'deep-cleaning', name: 'Deep Cleaning' },
      { id: 'move-in-out', name: 'Move In/Out Cleaning' },
      { id: 'carpet-cleaning', name: 'Carpet Cleaning' },
      { id: 'window-cleaning', name: 'Window Cleaning' }
    ],
    roofing: [
      { id: 'roof-repair', name: 'Roof Repair' },
      { id: 'roof-replacement', name: 'Roof Replacement' },
      { id: 'gutter-installation', name: 'Gutter Installation' },
      { id: 'skylight-installation', name: 'Skylight Installation' },
      { id: 'roof-inspection', name: 'Roof Inspection' }
    ],
    flooring: [
      { id: 'hardwood-installation', name: 'Hardwood Installation' },
      { id: 'tile-installation', name: 'Tile Installation' },
      { id: 'carpet-installation', name: 'Carpet Installation' },
      { id: 'vinyl-installation', name: 'Vinyl Installation' },
      { id: 'floor-refinishing', name: 'Floor Refinishing' }
    ],
    general: [
      { id: 'home-renovation', name: 'Home Renovation' },
      { id: 'handyman', name: 'Handyman Services' },
      { id: 'kitchen-remodel', name: 'Kitchen Remodeling' },
      { id: 'bathroom-remodel', name: 'Bathroom Remodeling' },
      { id: 'basement-finishing', name: 'Basement Finishing' }
    ]
  };
  
  useEffect(() => {
    if (providerProfile) {
      setBusinessInfo({
        businessName: providerProfile.businessName || '',
        contactName: providerProfile.contactName || '',
        email: user?.email || '',
        phone: providerProfile.phone || '',
        address: providerProfile.address || '',
        city: providerProfile.city || '',
        state: providerProfile.state || '',
        zipCode: providerProfile.zipCode || '',
        website: providerProfile.website || '',
        description: providerProfile.description || ''
      });
      
      if (providerProfile.categories) {
        setServiceInfo(prev => ({
          ...prev,
          categories: providerProfile.categories || [],
          services: providerProfile.services || [],
          serviceArea: providerProfile.serviceArea || '',
          serviceRadius: providerProfile.serviceRadius || 25,
          availability: providerProfile.availability || prev.availability
        }));
      }
    }
  }, [providerProfile, user]);
  
  const handleBusinessInfoChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      // Add category
      setServiceInfo(prev => ({
        ...prev,
        categories: [...prev.categories, value]
      }));
    } else {
      // Remove category and its services
      setServiceInfo(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat !== value),
        services: prev.services.filter(service => {
          // Check if the service belongs to the category being removed
          const serviceCategory = Object.keys(availableServices).find(cat => 
            availableServices[cat].some(s => s.id === service)
          );
          return serviceCategory !== value;
        })
      }));
    }
  };
  
  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      // Add service
      setServiceInfo(prev => ({
        ...prev,
        services: [...prev.services, value]
      }));
    } else {
      // Remove service
      setServiceInfo(prev => ({
        ...prev,
        services: prev.services.filter(service => service !== value)
      }));
    }
  };
  
  const handleAvailabilityChange = (day, field, value) => {
    setServiceInfo(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: field === 'available' ? value === 'true' : value
        }
      }
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBusinessInfoSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // Update profile in database
      await updateProviderProfile({
        businessName: businessInfo.businessName,
        contactName: businessInfo.contactName,
        phone: businessInfo.phone,
        address: businessInfo.address,
        city: businessInfo.city,
        state: businessInfo.state,
        zipCode: businessInfo.zipCode,
        website: businessInfo.website,
        description: businessInfo.description
      });
      
      setMessage({
        type: 'success',
        text: 'Business information updated successfully!'
      });
    } catch (error) {
      console.error('Error updating business information:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update business information. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleServiceInfoSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // Update service info in database
      await updateProviderProfile({
        categories: serviceInfo.categories,
        services: serviceInfo.services,
        serviceArea: serviceInfo.serviceArea,
        serviceRadius: serviceInfo.serviceRadius,
        availability: serviceInfo.availability
      });
      
      setMessage({
        type: 'success',
        text: 'Service information updated successfully!'
      });
    } catch (error) {
      console.error('Error updating service information:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update service information. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'New passwords do not match.'
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters long.'
      });
      return;
    }
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // Update password
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setMessage({
        type: 'success',
        text: 'Password updated successfully!'
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update password. Please check your current password and try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Business Profile
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your business information and service offerings
          </p>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="bg-white shadow sm:rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('business')}
              className={`${
                activeTab === 'business'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Business Information
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`${
                activeTab === 'services'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Services & Availability
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`${
                activeTab === 'security'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Security
            </button>
          </nav>
        </div>
        
        {/* Message Alert */}
        {message.text && (
          <div className={`mx-6 mt-6 rounded-md p-4 ${
            message.type === 'success' ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.text}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Business Information Tab */}
        {activeTab === 'business' && (
          <div className="px-6 py-6">
            <form onSubmit={handleBusinessInfoSubmit}>
              <div className="space-y-6">
                {/* Business Logo */}
                <div className="flex items-center">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {providerProfile?.logoURL ? (
                      <img
                        src={providerProfile.logoURL}
                        alt="Business Logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-5">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <CameraIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      Change logo
                    </button>
                    <p className="mt-2 text-xs text-gray-500">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>
                
                {/* Business Name */}
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="businessName"
                      id="businessName"
                      value={businessInfo.businessName}
                      onChange={handleBusinessInfoChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                {/* Contact Name */}
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                    Contact Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="contactName"
                      id="contactName"
                      value={businessInfo.contactName}
                      onChange={handleBusinessInfoChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={businessInfo.email}
                        disabled
                        className="bg-gray-50 block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Contact support to change your email address
                    </p>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={businessInfo.phone}
                        onChange={handleBusinessInfoChange}
                        className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GlobeAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="website"
                      id="website"
                      value={businessInfo.website}
                      onChange={handleBusinessInfoChange}
                      placeholder="https://"
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Business Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={businessInfo.address}
                      onChange={handleBusinessInfoChange}
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={businessInfo.city}
                        onChange={handleBusinessInfoChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="state"
                        id="state"
                        value={businessInfo.state}
                        onChange={handleBusinessInfoChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                      ZIP / Postal code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="zipCode"
                        id="zipCode"
                        value={businessInfo.zipCode}
                        onChange={handleBusinessInfoChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Business Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Business Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={businessInfo.description}
                      onChange={handleBusinessInfoChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Describe your business, experience, and what sets you apart..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      loading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Services & Availability Tab */}
        {activeTab === 'services' && (
          <div className="px-6 py-6">
            <form onSubmit={handleServiceInfoSubmit}>
              <div className="space-y-6">
                {/* Service Categories */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Service Categories</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select the categories of services you offer
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
                    {availableCategories.map((category) => (
                      <div key={category.id} className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id={`category-${category.id}`}
                            name={`category-${category.id}`}
                            type="checkbox"
                            value={category.id}
                            checked={serviceInfo.categories.includes(category.id)}
                            onChange={handleCategoryChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`category-${category.id}`} className="font-medium text-gray-700">
                            {category.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Specific Services */}
                {serviceInfo.categories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Specific Services</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select the specific services you offer in each category
                    </p>
                    
                    <div className="mt-4 space-y-6">
                      {serviceInfo.categories.map((categoryId) => {
                        const category = availableCategories.find(c => c.id === categoryId);
                        return (
                          <div key={categoryId}>
                            <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                            <div className="mt-2 grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-6">
                              {availableServices[categoryId].map((service) => (
                                <div key={service.id} className="relative flex items-start">
                                  <div className="flex h-5 items-center">
                                    <input
                                      id={`service-${service.id}`}
                                      name={`service-${service.id}`}
                                      type="checkbox"
                                      value={service.id}
                                      checked={serviceInfo.services.includes(service.id)}
                                      onChange={handleServiceChange}
                                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                  </div>
                                  <div className="ml-3 text-sm">
                                    <label htmlFor={`service-${service.id}`} className="font-medium text-gray-700">
                                      {service.name}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Service Area */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Service Area</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Define the geographic area where you provide services
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="serviceArea" className="block text-sm font-medium text-gray-700">
                        Service Area Center
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="serviceArea"
                          id="serviceArea"
                          value={serviceInfo.serviceArea}
                          onChange={(e) => setServiceInfo(prev => ({ ...prev, serviceArea: e.target.value }))}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="City or ZIP code"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Enter the city or ZIP code that is the center of your service area
                      </p>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="serviceRadius" className="block text-sm font-medium text-gray-700">
                        Service Radius (miles)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="serviceRadius"
                          id="serviceRadius"
                          min="1"
                          max="100"
                          value={serviceInfo.serviceRadius}
                          onChange={(e) => setServiceInfo(prev => ({ ...prev, serviceRadius: parseInt(e.target.value) }))}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Availability */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Availability</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Set your regular working hours
                  </p>
                  
                  <div className="mt-4">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                              Day
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Available
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Start Time
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              End Time
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {Object.entries(serviceInfo.availability).map(([day, dayInfo]) => (
                            <tr key={day}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <select
                                  value={dayInfo.available.toString()}
                                  onChange={(e) => handleAvailabilityChange(day, 'available', e.target.value)}
                                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                >
                                  <option value="true">Yes</option>
                                  <option value="false">No</option>
                                </select>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <input
                                  type="time"
                                  value={dayInfo.start}
                                  onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                                  disabled={!dayInfo.available}
                                  className={`rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                                    !dayInfo.available ? 'bg-gray-100 text-gray-400' : ''
                                  }`}
                                />
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <input
                                  type="time"
                                  value={dayInfo.end}
                                  onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                                  disabled={!dayInfo.available}
                                  className={`rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                                    !dayInfo.available ? 'bg-gray-100 text-gray-400' : ''
                                  }`}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      loading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="px-6 py-6">
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your password to keep your account secure
                  </p>
                </div>
                
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm new password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      loading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </div>
            </form>
            
            <div className="mt-10 pt-10 border-t border-gray-200">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Account Security</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Additional security options for your account
                </p>
              </div>
              
              <div className="mt-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="twoFactor"
                      name="twoFactor"
                      type="checkbox"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="twoFactor" className="font-medium text-gray-700">
                      Enable two-factor authentication
                    </label>
                    <p className="text-gray-500">
                      Add an extra layer of security to your account by requiring a verification code in addition to your password.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Set up two-factor authentication
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
