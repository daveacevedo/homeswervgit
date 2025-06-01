import React from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for homeowners just getting started',
      features: [
        'Up to 2 properties',
        'Basic project planning',
        'Vision board (limited)',
        'Connect with up to 5 providers',
        'Email support'
      ],
      cta: 'Get Started',
      mostPopular: false
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      description: 'For homeowners with multiple properties',
      features: [
        'Unlimited properties',
        'Advanced project planning',
        'Unlimited vision boards',
        'Connect with unlimited providers',
        'Priority email support',
        'Document storage',
        'Maintenance reminders',
        'Budget tracking'
      ],
      cta: 'Start Free Trial',
      mostPopular: true
    },
    {
      name: 'Pro',
      price: '$19.99',
      period: 'per month',
      description: 'For service providers and businesses',
      features: [
        'Business profile',
        'Unlimited job management',
        'Lead generation',
        'Advanced scheduling',
        'Payment processing',
        'Customer management',
        'Marketing tools',
        'Priority phone support',
        'Analytics dashboard'
      ],
      cta: 'Contact Sales',
      mostPopular: false
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Pricing</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Plans for every need
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Choose the perfect plan for your home management and service provider needs.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative p-8 bg-white border rounded-2xl shadow-sm flex flex-col ${
                plan.mostPopular ? 'ring-2 ring-primary-500' : 'border-gray-200'
              }`}
            >
              {plan.mostPopular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-0 px-4 py-1 bg-primary-500 rounded-full text-xs font-semibold uppercase tracking-wide text-white">
                  Most popular
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                
                <div className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  {plan.period && (
                    <span className="ml-1 text-xl font-semibold">{plan.period}</span>
                  )}
                </div>
                
                <p className="mt-2 text-base text-gray-500">{plan.description}</p>

                <ul role="list" className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <svg 
                        className="flex-shrink-0 w-5 h-5 text-green-500" 
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
                      <span className="ml-3 text-base text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/register"
                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                  plan.mostPopular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-gray-200 pt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h3>
          
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-medium text-gray-900">Can I switch plans later?</h4>
              <p className="mt-2 text-base text-gray-500">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900">Is there a contract or commitment?</h4>
              <p className="mt-2 text-base text-gray-500">
                No, all plans are month-to-month with no long-term contracts. You can cancel anytime.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900">Do you offer discounts for annual billing?</h4>
              <p className="mt-2 text-base text-gray-500">
                Yes, we offer a 20% discount when you choose annual billing for any of our paid plans.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h4>
              <p className="mt-2 text-base text-gray-500">
                We accept all major credit cards, PayPal, and bank transfers for business accounts.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900">Is my data secure?</h4>
              <p className="mt-2 text-base text-gray-500">
                Yes, we use industry-standard encryption and security practices to protect your data. We never share your information with third parties without your consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
