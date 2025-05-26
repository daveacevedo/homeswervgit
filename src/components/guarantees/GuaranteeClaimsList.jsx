import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export default function GuaranteeClaimsList({ role = 'homeowner' }) {
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchClaims(user.id);
      }
    };
    
    getCurrentUser();
  }, [role]);

  const fetchClaims = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('guarantees')
        .select(`
          *,
          homeowner:homeowner_id (
            id,
            first_name,
            last_name,
            email
          ),
          provider:provider_id (
            id,
            business_name,
            contact_name,
            email
          ),
          project:project_id (
            id,
            title
          )
        `);
      
      // Filter based on role
      if (role === 'homeowner') {
        query = query.eq('homeowner_id', userId);
      } else if (role === 'provider') {
        query = query.eq('provider_id', userId);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setClaims(data || []);
    } catch (err) {
      console.error('Error fetching guarantee claims:', err);
      setError('Failed to load guarantee claims');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>;
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Approved
        </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Rejected
        </span>;
      case 'resolved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Resolved
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>;
    }
  };

  if (!user) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <h3 className="text-sm font-medium text-gray-900">Authentication Required</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please log in to view your guarantee claims.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="mt-3 h-4 bg-gray-200 rounded"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
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
    );
  }

  if (claims.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No guarantee claims</h3>
          <p className="mt-1 text-sm text-gray-500">
            {role === 'homeowner'
              ? "You haven't submitted any guarantee claims yet."
              : "You don't have any guarantee claims against your services."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Guarantee Claims</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {role === 'homeowner'
            ? "Claims you've submitted under our satisfaction guarantee."
            : "Claims submitted against your services under our satisfaction guarantee."}
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {claims.map((claim) => (
            <li key={claim.id} className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {claim.project?.title || 'Unnamed Project'}
                  </h4>
                  <div className="mt-1 flex items-center">
                    {getStatusBadge(claim.status)}
                    <span className="ml-2 text-sm text-gray-500">
                      Submitted on {formatDate(claim.created_at)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(claim.claim_amount)}
                  </p>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-gray-500 font-medium">Reason:</p>
                <p className="mt-1 text-sm text-gray-900">{claim.claim_reason}</p>
              </div>
              
              {role === 'homeowner' ? (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 font-medium">Provider:</p>
                  <p className="mt-1 text-sm text-gray-900">
                    <Link to={`/homeowner/providers/${claim.provider?.id}`} className="text-primary-600 hover:text-primary-900">
                      {claim.provider?.business_name || 'Unknown Provider'}
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 font-medium">Homeowner:</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {claim.homeowner?.first_name} {claim.homeowner?.last_name}
                  </p>
                </div>
              )}
              
              {claim.resolution_notes && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 font-medium">Resolution Notes:</p>
                  <p className="mt-1 text-sm text-gray-900">{claim.resolution_notes}</p>
                  {claim.resolution_date && (
                    <p className="mt-1 text-xs text-gray-500">
                      Resolved on {formatDate(claim.resolution_date)}
                    </p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
