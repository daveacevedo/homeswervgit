import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { DocumentArrowUpIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function VerificationUpload() {
  const [user, setUser] = useState(null);
  const [verificationType, setVerificationType] = useState('license');
  const [file, setFile] = useState(null);
  const [expirationDate, setExpirationDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [verifications, setVerifications] = useState([]);

  useEffect(() => {
    // Get the current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchVerifications(user.id);
      }
    };
    
    getCurrentUser();
  }, []);

  const fetchVerifications = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('provider_verifications')
        .select('*')
        .eq('provider_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setVerifications(data || []);
    } catch (err) {
      console.error('Error fetching verifications:', err);
      setError('Failed to load your verification history');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size exceeds 5MB limit');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to upload verification documents');
      return;
    }
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${verificationType}_${Date.now()}.${fileExt}`;
      const filePath = `verifications/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      // Create verification record
      const { error: dbError } = await supabase
        .from('provider_verifications')
        .insert({
          provider_id: user.id,
          verification_type: verificationType,
          document_url: publicUrl,
          expiration_date: expirationDate || null,
          status: 'pending'
        });
      
      if (dbError) throw dbError;
      
      setSuccess(true);
      setFile(null);
      setExpirationDate('');
      
      // Refresh verifications list
      fetchVerifications(user.id);
    } catch (err) {
      console.error('Error uploading verification:', err);
      setError('Failed to upload verification document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending Review
        </span>;
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Approved
        </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Rejected
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>;
    }
  };

  if (!user) {
    return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Verification Documents</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Please log in to upload verification documents.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Verification Documents</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Upload verification documents to build trust with homeowners. Our team will review your documents and approve your verification badges.</p>
        </div>
        
        {success && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Verification document uploaded successfully! Our team will review it shortly.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-5 sm:flex sm:items-end">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="verification-type" className="block text-sm font-medium text-gray-700">
              Verification Type
            </label>
            <select
              id="verification-type"
              name="verification-type"
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
              value={verificationType}
              onChange={(e) => setVerificationType(e.target.value)}
            >
              <option value="license">Business License</option>
              <option value="insurance">Insurance</option>
              <option value="background_check">Background Check</option>
              <option value="identity">Identity Verification</option>
            </select>
          </div>
          
          <div className="mt-3 sm:mt-0 sm:ml-4 w-full sm:max-w-xs">
            <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
              Expiration Date (if applicable)
            </label>
            <input
              type="date"
              name="expiration-date"
              id="expiration-date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>
          
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
              Document
            </label>
            <div className="mt-1 flex">
              <div className="flex-grow">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500"
                >
                  <span className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <DocumentArrowUpIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    {file ? file.name : 'Choose file'}
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={loading || !file}
                className={`ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  loading || !file
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">PDF, JPG or PNG up to 5MB</p>
          </div>
        </form>
        
        {/* Verification History */}
        {verifications.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900">Verification History</h4>
            <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Type</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Submitted</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Document</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {verifications.map((verification) => (
                    <tr key={verification.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {verification.verification_type.replace('_', ' ').charAt(0).toUpperCase() + verification.verification_type.replace('_', ' ').slice(1)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getStatusBadge(verification.status)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(verification.created_at).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {verification.document_url && (
                          <a
                            href={verification.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
