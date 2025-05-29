import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [userType, setUserType] = useState('homeowner');
  
  const homeownerPlans = [
    {
      name: 'Free Forever',
      description: 'Perfect for homeowners with occasional projects',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Basic vision board',
        'Project planning tools',
        'Provider directory',
        'Local deals and offers',
        'Community forum access',
        'Email support'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Premium',
      description: 'For homeowners with multiple renovation needs',
      monthlyPrice: 9.99,
      yearlyPrice: 99,
      features: [
        'Everything in Free plan',
        'AI-powered cost estimates',
        'Advanced project tracking',
        'Priority matching with providers',
        'Document storage',
        'Priority support',
        'Exclusive premium deals'
      ],
      cta: 'Start Free Trial',
      highlighted: true
    }
  ];
  
  const businessPlans = [
    {
      name: 'Basic',
      description: 'For small service providers looking to grow',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Business profile listing',
        'Up to 10 project bids per month',
        'Basic analytics dashboard',
        'Client management tools',
        'Email support',
        '30-day free trial'
      ],
      cta: 'Start Free Trial',
      highlighted: false
    },
    {
      name: 'Pro',
      description: 'For established service providers',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Everything in Basic plan',
        'Featured provider listing',
        'Unlimited project bidding',
        'Advanced analytics dashboard',
        'Marketing tools',
        'Priority support',
        'Client relationship management',
        'Payment processing'
      ],
      cta: 'Start Free Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      description: 'For large service companies with custom needs',
      monthlyPrice: null,
      yearlyPrice: null,
      customPrice: 'Custom Pricing',
      features: [
        'Everything in Pro plan',
        'Dedicated account manager',
        'Custom integrations',
        'Team collaboration tools',
        'Advanced reporting',
        'API access',
        'White-label options',
        'Volume discounts'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  // Choose plans based on user type
  const plans = userType === 'homeowner' ? homeownerPlans : businessPlans;

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Home Swerv
              </Link>
            </div>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <Link to="/login" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                Sign in
              </Link>
              <Link
                to="/register"
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-center">Pricing Plans</h1>
          <p className="mt-5 text-xl text-gray-500 sm:text-center">
            Choose the perfect plan for your needs. Start with a free trial.
          </p>
          
          {/* Toggle between user types */}
          <div className="relative self-center mt-6 bg-gray-100 rounded-lg p-0.5 flex sm:mt-8">
            <button
              type="button"
              className={`${
                userType === 'homeowner' ? 'bg-white border-gray-200 shadow-sm' : 'border border-transparent'
              } relative w-1/2 rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 sm:w-auto sm:px-8`}
              onClick={() => setUserType('homeowner')}
            >
              For Homeowners
            </button>
            <button
              type="button"
              className={`${
                userType === 'business' ? 'bg-white border-gray-200 shadow-sm' : 'border border-transparent'
              } ml-0.5 relative w-1/2 rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 sm:w-auto sm:px-8`}
              onClick={() => setUserType('business')}
            >
              For Service Providers
            </button>
          </div>
          
          {/* Toggle between monthly and yearly billing */}
          <div className="relative self-center mt-6 bg-gray-100 rounded-lg p-0.5 flex sm:mt-8">
            <button
              type="button"
              className={`${
                billingPeriod === 'monthly' ? 'bg-white border-gray-200 shadow-sm' : 'border border-transparent'
              } relative w-1/2 rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 sm:w-auto sm:px-8`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly billing
            </button>
            <button
              type="button"
              className={`${
                billingPeriod === 'yearly' ? 'bg-white border-gray-200 shadow-sm' : 'border border-transparent'
              } ml-0.5 relative w-1/2 rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 sm:w-auto sm:px-8`}
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly billing
              <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`${
                plan.highlighted
                  ? 'border-2 border-blue-500 shadow-xl'
                  : 'border border-gray-200'
              } rounded-lg shadow-sm divide-y divide-gray-200 bg-white`}
            >
              {plan.highlighted && (
                <div className="bg-blue-500 text-white text-center py-2 rounded-t-lg">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900">{plan.name}</h2>
                <p className="mt-2 text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  {plan.customPrice ? (
                    <span className="text-4xl font-extrabold text-gray-900">{plan.customPrice}</span>
                  ) : (
                    <>
                      <span className="text-4xl font-extrabold text-gray-900">
                        ${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span className="text-base font-medium text-gray-500">
                        /{billingPeriod === 'monthly' ? 'mo' : 'year'}
                      </span>
                    </>
                  )}
                </p>
                <Link
                  to={plan.name === 'Enterprise' ? '/contact' : '/register'}
                  className={`${
                    plan.highlighted
                      ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-200'
                  } mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {plan.cta}
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-sm font-medium text-gray-900 tracking-wide uppercase">What&apos;s included</h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex">
                      <svg
                        className="flex-shrink-0 h-6 w-6 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-3 text-base text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Pricing Options */}
        <div className="mt-16 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900">Additional Options</h2>
            
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {/* Commission Option for Business Owners */}
              {userType === 'business' && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900">Commission Option</h3>
                  <p className="mt-2 text-gray-500">
                    Prefer to pay based on results? Our commission option allows you to pay just 5% per project won, 
                    with reduced subscription fees.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-gray-600">5% commission on projects won through our platform</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-gray-600">Reduced monthly subscription fees</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-gray-600">Pay only when you succeed</span>
                    </li>
                  </ul>
                  <Link
                    to="/contact"
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Learn More
                  </Link>
                </div>
              )}
              
              {/* Referral Program */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900">Referral Program</h3>
                <p className="mt-2 text-gray-500">
                  {userType === 'homeowner' 
                    ? 'Earn $10 credit for every 3 new customers or business owners you refer to Home Swerv.'
                    : 'Get one month free for each business owner you refer who subscribes to any paid plan.'}
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-gray-600">
                      {userType === 'homeowner' 
                        ? '$10 credit per referral (for every 3 new users)'
                        : 'One month free per business referral'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    <span className="ml-2 text-gray-600">Easy sharing via email or social media</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-gray-600">Track your referrals in your dashboard</span>
                  </li>
                </ul>
                <Link
                  to={userType === 'homeowner' ? '/homeowner/rewards' : '/provider/rewards'}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Start Referring
                </Link>
              </div>
              
              {/* Free Trial Callout for Business */}
              {userType === 'business' && (
                <div className="lg:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">30-Day Free Trial</h3>
                      <p className="text-gray-600">
                        Try any of our business plans free for 30 days. No credit card required to start.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
              <dt className="text-lg font-medium text-gray-900">
                Can I cancel my subscription at any time?
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your current billing period.
              </dd>
            </div>
            <div className="pt-6">
              <dt className="text-lg font-medium text-gray-900">
                What payment methods do you accept?
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </dd>
            </div>
            <div className="pt-6">
              <dt className="text-lg font-medium text-gray-900">
                Do you offer discounts for non-profits or educational institutions?
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                Yes, we offer special pricing for non-profits, educational institutions, and community organizations. Please contact our sales team for more information.
              </dd>
            </div>
            <div className="pt-6">
              <dt className="text-lg font-medium text-gray-900">
                Can I upgrade or downgrade my plan later?
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                Absolutely! You can upgrade your plan at any time and the new features will be immediately available. If you downgrade, the changes will take effect at the start of your next billing cycle.
              </dd>
            </div>
            <div className="pt-6">
              <dt className="text-lg font-medium text-gray-900">
                {userType === 'homeowner' 
                  ? 'Is there a limit to how many projects I can create?' 
                  : 'How does the commission option work?'}
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                {userType === 'homeowner' 
                  ? 'The Free plan allows basic project planning. Premium plans offer unlimited project creation with advanced features.'
                  : 'With our commission option, you pay a reduced monthly subscription fee plus 5% of the project value for jobs you win through our platform. This option is great for businesses that want to minimize upfront costs.'}
              </dd>
            </div>
            <div className="pt-6">
              <dt className="text-lg font-medium text-gray-900">
                How does the referral program work?
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                {userType === 'homeowner' 
                  ? "For every 3 new users (homeowners or service providers) you refer who sign up, you'll receive a $10 credit toward your subscription or services."
                  : "For each business owner you refer who subscribes to a paid plan, you'll receive one month of your current subscription for free."}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Start your free trial today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Join thousands of homeowners and service providers already using Home Swerv to simplify their renovation projects.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <h2 className="text-xl font-bold text-white">Home Swerv</h2>
              <p className="text-gray-300 text-base">
                Connecting homeowners with trusted service professionals since 2023.
              </p>
              <div className="flex space-x-6">
                {/* Social media links would go here */}
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        For Homeowners
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        For Service Providers
                      </Link>
                    </li>
                    <li>
                      <Link to="/pricing" className="text-base text-gray-300 hover:text-white">
                        Pricing
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        Help Center
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="text-base text-gray-300 hover:text-white">
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        FAQ
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link to="/about" className="text-base text-gray-300 hover:text-white">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        Careers
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        Terms
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2023 Home Swerv. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
