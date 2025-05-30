import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const ProviderProfileSetup = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    business_name: '',
    contact_name: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    service_categories: [],
    business_description: '',
    years_in_business: '',
    license_number: '',
    insurance_info: '',
    service_radius: '',
    website: '',
    social_media: {
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  });

  // Check if user already has a completed provider profile
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('provider_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        // If profile exists and is complete, redirect to dashboard
        if (data && data.is_profile_complete) {
          navigate('/provider/dashboard');
        } 
        // If profile exists but is incomplete, load the data
        else if (data) {
          setFormData(prevData => ({
            ...prevData,
            business_name: data.business_name || '',
            contact_name: data.contact_name || '',
            phone_number: data.phone_number || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zip_code: data.zip_code || '',
            service_categories: data.service_categories || [],
            business_description: data.business_description || '',
            years_in_business: data.years_in_business || '',
            license_number: data.license_number || '',
            insurance_info: data.insurance_info || '',
            service_radius: data.service_radius || '',
            website: data.website || '',
            social_media: data.social_media || {
              facebook: '',
              instagram: '',
              linkedin: ''
            }
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
    
    // Handle nested social media fields
    if (name.startsWith('social_media.')) {
      const socialField = name.split('.')[1];
      setFormData(prevData => ({
        ...prevData,
        social_media: {
          ...prevData.social_media,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
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
      // Update provider profile
      const { error } = await supabase
        .from('provider_profiles')
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
        navigate('/provider/dashboard');
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Complete Your Service Provider Profile</h1>
        <p className="mt-2 text-lg text-gray-600">
          Help homeowners find your services and connect with potential clients
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Business Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                id="business_name"
                name="business_name"
                value={formData.business_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website (optional)</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://www.example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="business_description" className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
            <textarea
              id="business_description"
              name="business_description"
              value={formData.business_description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="years_in_business" className="block text-sm font-medium text-gray-700 mb-1">Years in Business</label>
              <input
                type="number"
                id="years_in_business"
                name="years_in_business"
                value={formData.years_in_business}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="license_number" className="block text-sm font-medium text-gray-700 mb-1">License Number (optional)</label>
              <input
                type="text"
                id="license_number"
                name="license_number"
                value={formData.license_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="service_radius" className="block text-sm font-medium text-gray-700 mb-1">Service Radius (miles)</label>
              <input
                type="number"
                id="service_radius"
                name="service_radius"
                value={formData.service_radius}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Business Address</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Service Categories</h2>
          
          <p className="block text-sm font-medium text-gray-700 mb-2">Select all services you provide</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'plumbing', label: 'Plumbing' },
              { value: 'electrical', label: 'Electrical' },
              { value: 'hvac', label: 'HVAC' },
              { value: 'roofing', label: 'Roofing' },
              { value: 'carpentry', label: 'Carpentry' },
              { value: 'painting', label: 'Painting' },
              { value: 'flooring', label: 'Flooring' },
              { value: 'landscaping', label: 'Landscaping' },
              { value: 'cleaning', label: 'Cleaning Services' },
              { value: 'kitchen', label: 'Kitchen Remodeling' },
              { value: 'bathroom', label: 'Bathroom Remodeling' },
              { value: 'basement', label: 'Basement Finishing' },
              { value: 'windows', label: 'Windows & Doors' },
              { value: 'drywall', label: 'Drywall & Insulation' },
              { value: 'concrete', label: 'Concrete & Masonry' },
              { value: 'pest_control', label: 'Pest Control' },
              { value: 'appliance_repair', label: 'Appliance Repair' },
              { value: 'handyman', label: 'Handyman Services' }
            ].map(item => (
              <div key={item.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`service_${item.value}`}
                  name="service_categories"
                  value={item.value}
                  checked={formData.service_categories.includes(item.value)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor={`service_${item.value}`} className="ml-2 text-sm text-gray-700">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Insurance Information</h2>
          
          <div className="mb-4">
            <label htmlFor="insurance_info" className="block text-sm font-medium text-gray-700 mb-1">Insurance Details</label>
            <textarea
              id="insurance_info"
              name="insurance_info"
              value={formData.insurance_info}
              onChange={handleInputChange}
              rows="3"
              placeholder="Describe your insurance coverage (liability, workers comp, etc.)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Social Media (Optional)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="social_media.facebook" className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input
                type="url"
                id="social_media.facebook"
                name="social_media.facebook"
                value={formData.social_media.facebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/yourbusiness"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="social_media.instagram" className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input
                type="url"
                id="social_media.instagram"
                name="social_media.instagram"
                value={formData.social_media.instagram}
                onChange={handleInputChange}
                placeholder="https://instagram.com/yourbusiness"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="social_media.linkedin" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="url"
                id="social_media.linkedin"
                name="social_media.linkedin"
                value={formData.social_media.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/company/yourbusiness"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ProviderProfileSetup;
