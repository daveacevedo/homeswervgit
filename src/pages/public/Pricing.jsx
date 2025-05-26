import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Pricing = () => {
  const [annual, setAnnual] = useState(true);
  const { user } = useAuth();

  const toggleBilling = () => {
    setAnnual(!annual);
  };

  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for homeowners with occasional service needs',
      price: annual ? 0 : 0,
      features: [
        'Post up to 3 projects per month',
        'Connect with up to 5 service providers',
        'Basic project management tools',
        'Community access',
        'Email support'
      ],
      cta: 'Get started',
      mostPopular: false
    },
    {
      name: 'Pro',
      description: 'For homeowners with regular service needs',
      price: annual ? 99 : 9.99,
      features: [
        'Unlimited project postings',
        'Priority matching with providers',
        'Advanced project management',
        'Project milestone tracking',
        'Phone & email support',
        'Exclusive deals and discounts'
      ],
      cta: 'Start free trial',
      mostPopular: true
    },
    {
      name: 'Business',
      description: 'For service providers looking to grow',
      price: annual ? 299 : 29.99,
      features: [
        'Featured provider listing',
        'Lead generation tools',
        'Business analytics dashboard',
        'Client management system',
        'Marketing toolkit',
        'Priority support',
        'Verified business badge'
      ],
      cta: 'Contact sales',
      mostPopular: false
    }
  ];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-center">Pricing Plans</h1>
          <p className="mt-5 text-xl text-gray-500 sm:text-center">
            Choose the perfect plan for your needs. Start with a 14-day free trial.
          </p>
          <div className="relative self-center mt-6 bg-gray-100 rounded-lg p-0.5 flex sm:mt-8">
            <button
              type="button"
              className={`${
                annual ? 'bg-white border-gray-200 shadow-sm' : 'border border-transparent'
              } relative w-1/2 rounded-md py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 sm:w-auto sm:px-8`}
              onClick={toggleBilling}
            >
              Annual billing
              {annual && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Save 20%
                </span>
              )}
            </button>
            <button
              type="button"
              className={`${
                !annual ? 'bg-white border-gray-200 shadow-sm' : 'border border-transparent'
              } ml-0.5 relative w-1/2 rounded-md py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 sm:w-auto sm:px-8`}
              onClick={toggleBilling}
            >
              Monthly billing
            </button>
          </div>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`${
              plan.mostPopular ? 'border-primary-500' : 'border-gray-200'
            } border rounded-lg shadow-sm divide-y divide-gray-200`}>
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">{plan.name}</h2>
                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-base font-medium text-gray-500">/{annual ? 'year' : 'month'}</span>
                </p>
                <Link
                  to={user ? '/settings/billing' : '/register'}
                  className={`${
                    plan.mostPopular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                  } mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium`}
                >
                  {plan.cta}
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-6 divide-y divide-gray-200">
            <div className="pt-6">
              <dt className="text-lg">
                <span className="font-medium text-gray-900">How does the free trial work?</span>
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                All paid plans come with a 14-day free trial. You can try out all the features without being charged. If you decide to continue, we'll bill you at the end of the trial. You can cancel anytime during the trial period.
              </dd>
            </div>

            <div className="pt-6">
              <dt className="text-lg">
                <span className="font-medium text-gray-900">Can I change plans later?</span>
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new features will be available immediately. If you downgrade, the changes will take effect at the start of your next billing cycle.
              </dd>
            </div>

            <div className="pt-6">
              <dt className="text-lg">
                <span className="font-medium text-gray-900">What payment methods do you accept?</span>
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For annual Business plans, we can also arrange for invoice payment.
              </dd>
            </div>

            <div className="pt-6">
              <dt className="text-lg">
                <span className="font-medium text-gray-900">Is there a contract or commitment?</span>
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                No long-term contracts or commitments. You can cancel your subscription at any time, and your plan will remain active until the end of the current billing period.
              </dd>
            </div>

            <div className="pt-6">
              <dt className="text-lg">
                <span className="font-medium text-gray-900">Do you offer discounts for non-profits or educational institutions?</span>
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                Yes, we offer special pricing for non-profit organizations and educational institutions. Please contact our sales team for more information.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Start your free trial today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Join thousands of homeowners and service providers already using our platform.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
