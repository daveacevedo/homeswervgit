import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckBadgeIcon, ShieldCheckIcon, IdentificationIcon, DocumentCheckIcon } from '@heroicons/react/24/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function VerificationBadges({ providerId, size = 'md' }) {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (providerId) {
      fetchVerifications();
    }
  }, [providerId]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('provider_verifications')
        .select('*')
        .eq('provider_id', providerId)
        .eq('status', 'approved');
      
      if (error) throw error;
      
      setVerifications(data || []);
    } catch (err) {
      console.error('Error fetching verifications:', err);
      setError('Failed to load verification badges');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (type) => {
    switch (type) {
      case 'license':
        return <DocumentCheckIcon className={`${sizeClasses[size].icon} text-green-500`} />;
      case 'insurance':
        return <ShieldCheckIcon className={`${sizeClasses[size].icon} text-blue-500`} />;
      case 'background_check':
        return <CheckBadgeIcon className={`${sizeClasses[size].icon} text-purple-500`} />;
      case 'identity':
        return <IdentificationIcon className={`${sizeClasses[size].icon} text-orange-500`} />;
      default:
        return <CheckBadgeIcon className={`${sizeClasses[size].icon} text-gray-500`} />;
    }
  };

  const getBadgeTitle = (type) => {
    switch (type) {
      case 'license':
        return 'Licensed';
      case 'insurance':
        return 'Insured';
      case 'background_check':
        return 'Background Checked';
      case 'identity':
        return 'Identity Verified';
      default:
        return 'Verified';
    }
  };

  const sizeClasses = {
    sm: {
      container: 'space-x-1',
      badge: 'h-5 w-5',
      icon: 'h-3 w-3',
      text: 'text-xs'
    },
    md: {
      container: 'space-x-2',
      badge: 'h-7 w-7',
      icon: 'h-4 w-4',
      text: 'text-sm'
    },
    lg: {
      container: 'space-x-3',
      badge: 'h-9 w-9',
      icon: 'h-5 w-5',
      text: 'text-base'
    }
  };

  if (loading) {
    return <div className="animate-pulse flex space-x-2">
      {[1, 2, 3].map(i => (
        <div key={i} className={`${sizeClasses[size].badge} bg-gray-200 rounded-full`}></div>
      ))}
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm flex items-center">
      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
      {error}
    </div>;
  }

  if (verifications.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center ${sizeClasses[size].container}`}>
      {verifications.map((verification) => (
        <div 
          key={verification.id}
          className={`flex items-center justify-center ${sizeClasses[size].badge} rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors`}
          title={`${getBadgeTitle(verification.verification_type)} - Verified on ${new Date(verification.verification_date || verification.created_at).toLocaleDateString()}`}
        >
          {getBadgeIcon(verification.verification_type)}
        </div>
      ))}
    </div>
  );
}
