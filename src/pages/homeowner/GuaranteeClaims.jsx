import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GuaranteeClaimsList from '../../components/guarantees/GuaranteeClaimsList';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function GuaranteeClaims() {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Satisfaction Guarantee Claims</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your satisfaction guarantee claims
        </p>
      </div>
      
      {showInfo && (
        <div className="mb-6 bg-blue-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-blue-800">About Our Satisfaction Guarantee</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Our satisfaction guarantee ensures that you're happy with the services provided. If you're not satisfied with the work performed, you can submit a claim for a refund or resolution.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Claims must be submitted within 14 days of service completion</li>
                  <li>Provide clear details about why you're not satisfied</li>
                  <li>Include photos or other evidence if applicable</li>
                  <li>Our team will review your claim within 3-5 business days</li>
                </ul>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    className="px-2 py-1.5 rounded-md text-sm font-medium text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setShowInfo(false)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <GuaranteeClaimsList role="homeowner" />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Need to submit a new claim? You can do so from your project details page.
        </p>
        <button
          type="button"
          onClick={() => navigate('/homeowner/projects')}
          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          View My Projects
        </button>
      </div>
    </div>
  );
}
