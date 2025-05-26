import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import VerificationUpload from '../../components/provider/VerificationUpload';
import VerificationBadges from '../../components/provider/VerificationBadges';
import { CheckBadgeIcon, ShieldCheckIcon, DocumentCheckIcon, IdentificationIcon } from '@heroicons/react/24/outline';

export default function VerificationCenter() {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchVerifications();
    }
  }, [user]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('provider_verifications')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setVerifications(data || []);
    } catch (err) {
      console.error('Error fetching verifications:', err);
      setError('Failed to load verification data');
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatus = (type) => {
    const verification = verifications.find(v => v.verification_type === type);
    if (!verification) return 'not_submitted';
    return verification.status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-500 bg-green-100';
      case 'pending':
        return 'text-yellow-500 bg-yellow-100';
      case 'rejected':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Verified';
      case 'pending':
        return 'Pending Review';
      case 'rejected':
        return 'Verification Failed';
      case 'not_submitted':
        return 'Not Submitted';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Verification Center</h1>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-500">Your Verification Badges:</span>
            <VerificationBadges providerId={user.id} size="md" />
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Build trust with homeowners by verifying your business credentials
        </p>
      </div>
      
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
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
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Verification Status</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your current verification status for each credential type
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <DocumentCheckIcon className="mr-2 h-5 w-5 text-gray-400" />
                Business License
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getVerificationStatus('license'))}`}>
                  {getStatusText(getVerificationStatus('license'))}
                </span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <ShieldCheckIcon className="mr-2 h-5 w-5 text-gray-400" />
                Insurance
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getVerificationStatus('insurance'))}`}>
                  {getStatusText(getVerificationStatus('insurance'))}
                </span>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CheckBadgeIcon className="mr-2 h-5 w-5 text-gray-400" />
                Background Check
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getVerificationStatus('background_check'))}`}>
                  {getStatusText(getVerificationStatus('background_check'))}
                </span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <IdentificationIcon className="mr-2 h-5 w-5 text-gray-400" />
                Identity Verification
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getVerificationStatus('identity'))}`}>
                  {getStatusText(getVerificationStatus('identity'))}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      <div className="mb-6">
        <VerificationUpload />
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Verification Benefits</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            How verification helps your business
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Increased Trust</h3>
              </div>
              <p className="text-sm text-gray-500">
                Verified providers receive 3x more project requests and are 5x more likely to be hired than non-verified providers.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Better Visibility</h3>
              </div>
              <p className="text-sm text-gray-500">
                Verified providers appear higher in search results and are featured more prominently in provider listings.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Higher Value Projects</h3>
              </div>
              <p className="text-sm text-gray-500">
                Verified providers receive higher-value project requests and can charge premium rates for their services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
