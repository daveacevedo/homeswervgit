import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const HomeownerProfileSetup = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    property_type: 'single_family',
    property_age: '',
    property_size: '',
    renovation_interests: [],
    maintenance_interests: []
  });

  // Check if user already has a completed homeowner profile
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('homeowner_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        // If profile exists and is complete, redirect to dashboard
        if (data && data.is_profile_complete) {
          navigate('/homeowner/dashboard');
        } 
        // If profile exists but is incomplete, load the data
        else if (data) {
          setFormData(prevData => ({
            ...prevData,
            full_name: data.full_name || '',
            phone_number: data.phone_number || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zip_code: data.zip_code || '',
            property_type: data.property_type || 'single_family',
            property_age: data.property_age || '',
            property_size: data.property_size || '',
            renovation_interests: data.renovation_interests || [],
            maintenance_interests: data.maintenance_interests || []
          }));
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };
    
    checkProfile();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    
    setFormData(prevData => {
      const currentArray = [...(prevData[name] || [])];
      
      if (checked) {
        // Add value to array if not already present
        if (!currentArray.includes(value)) {
          return {
            ...prevData,
            [name]: [...currentArray, value]
          };
        }
      } else {
        // Remove value from array
        return {
          ...prevData,
          [name]: currentArray.filter(item => item !== value)
        };
      }
      
      return prevData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Update homeowner profile
      const { error } = await supabase
        .from('homeowner_profiles')
        .update({
          ...formData,
          is_profile_complete: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setSuccess('Profile updated successfully!');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/homeowner/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Complete Your Homeowner Profile</h1>
        <p className="mt-2 text-lg text-gray-600">
          Help us personalize your experience and connect you with the right service providers
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Property Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input
                type="text"
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                id="property_type"
                name="property_type"
                value={formData.property_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="single_family">Single Family Home</option>
                <option value="multi_family">Multi-Family Home</option>
                <option value="townhouse">Townhouse</option>
                <option value="condo">Condominium</option>
                <option value="apartment">Apartment</option>
                <option value="mobile_home">Mobile Home</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="property_age" className="block text-sm font-medium text-gray-700 mb-1">Property Age (years)</label>
              <input
                type="number"
                id="property_age"
                name="property_age"
                value={formData.property_age}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
            
            <div>
              <label htmlFor="property_size" className="block text-sm font-medium text-gray-700 mb-1">Property Size (sq ft)</label>
              <input
                type="number"
                id="property_size"
                name="property_size"
                value={formData.property_size}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Your Interests</h2>
          
          <div className="mb-6">
            <p className="block text-sm font-medium text-gray-700 mb-2">Renovation Interests (select all that apply)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'kitchen', label: 'Kitchen Remodeling' },
                { value: 'bathroom', label: 'Bathroom Remodeling' },
                { value: 'basement', label: 'Basement Finishing' },
                { value: 'addition', label: 'Home Addition' },
                { value: 'outdoor', label: 'Outdoor/Landscaping' },
                { value: 'roofing', label: 'Roofing' },
                { value: 'flooring', label: 'Flooring' },
                { value: 'painting', label: 'Painting' },
                { value: 'windows', label: 'Windows & Doors' }
              ].map(item => (
                <div key={item.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`renovation_${item.value}`}
                    name="renovation_interests"
                    value={item.value}
                    checked={formData.renovation_interests.includes(item.value)}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`renovation_${item.value}`} className="ml-2 text-sm text-gray-700">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">Maintenance Interests (select all that apply)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'plumbing', label: 'Plumbing' },
                { value: 'electrical', label: 'Electrical' },
                { value: 'hvac', label: 'HVAC' },
                { value: 'appliance', label: 'Appliance Repair' },
                { value: 'cleaning', label: 'Cleaning Services' },
                { value: 'lawn', label: 'Lawn & Garden' },
                { value: 'pest', label: 'Pest Control' },
                { value: 'security', label: 'Home Security' },
                { value: 'smart_home', label: 'Smart Home' }
              ].map(item => (
                <div key={item.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`maintenance_${item.value}`}
                    name="maintenance_interests"
                    value={item.value}
                    checked={formData.maintenance_interests.includes(item.value)}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`maintenance_${item.value}`} className="ml-2 text-sm text-gray-700">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : 'Complete Profile & Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomeownerProfileSetup;
