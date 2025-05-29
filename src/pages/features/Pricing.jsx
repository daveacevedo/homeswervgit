import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { CheckIcon } from '@heroicons/react/24/outline';

const Pricing = () => {
  const [annual, setAnnual] = useState(true);

  const toggleBilling = () => {
    setAnnual(!annual);
  };

  return (
    <div className="bg-white">
      <Navbar />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Pricing</h1>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simple, transparent pricing
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Choose the plan that's right for you or your business
          </p>
        </div>
      </div>

      {/* Pricing toggle */}
      <div className="relative mt-6 flex justify-center">
        <div className="flex items-center space-x-3">
          <span className={`text-sm font-medium ${annual ? 'text-primary-900' : 'text-gray-500'}`}>Annual</span>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              annual ? 'bg-gray-200' : 'bg-primary-600'
            }`}
            role="switch"
            aria-checked={!annual}
            onClick={toggleBilling}
          >
            <span className="sr-only">Toggle billing frequency</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                annual ? 'translate-x-0' : 'translate-x-5'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${!annual ? 'text-primary-900' : 'text-gray-500'}`}>Monthly</span>
        </div>
        <div className="absolute -top-3 right-1/2 transform translate-x-32 sm:translate-x-40">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Save 20%
          </span>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {/* Free tier */}
          <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
            <div className="p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Basic</h2>
              <p className="mt-4 text-sm text-gray-500">Perfect for homeowners with occasional projects.</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">Free</span>
                <span className="text-base font-medium text-gray-500">/forever</span>
              </p>
              <Link
                to="/register"
                className="mt-8 block w-full bg-primary-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-primary-700"
              >
                Get started
              </Link>
            </div>
            <div className="pt-6 pb-8 px-6">
              <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Up to 3 active projects</span>
                </li>
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Basic project management tools</span>
                </li>
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Access to service provider directory</span>
                </li>
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Community rewards program</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Premium tier */}
          <div className="border border-primary-200 rounded-lg shadow-sm divide-y divide-gray-200">
            <div className="p-6 bg-primary-50 rounded-t-lg">
              <h2 className="text-lg leading-6 font-medium text-primary-900">Premium</h2>
              <p className="mt-4 text-sm text-primary-700">For homeowners with multiple renovation projects.</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">${annual ? '9.99' : '12.99'}</span>
                <span className="text-base font-medium text-gray-500">/{annual ? 'mo' : 'mo'}</span>
              </p>
              <p className="mt-2 text-sm text-primary-700">Billed {annual ? 'annually' : 'monthly'}</p>
              <Link
                to="/register"
                className="mt-8 block w-full bg-primary-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-primary-700"
              >
                Get started
              </Link>
            </div>
            <div className="pt-6 pb-8 px-6">
              <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Unlimited active projects</span>
                </li>
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Advanced project management tools</span>
                </li>
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Priority access to top service providers</span>
                </li>
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Enhanced rewards (2x points)</span>
                </li>
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">AI budget estimation tool</span>
                </li>
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Advanced vision board features</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Provider tier */}
          <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
            <div className="p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Provider</h2>
              <p className="mt-4 text-sm text-gray-500">For service providers looking to grow their business.</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">${annual ? '19.99' : '24.99'}</span>
                <span className="text-base font-medium text-gray-500">/{annual ? 'mo' : 'mo'}</span>
              </p>
              <p className="mt-2 text-sm text-gray-500">Billed {annual ? 'annually' : 'monthly'}</p>
              <Link
                to="/register"
                className="mt-8 block w-full bg-primary-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-primary-700"
              >
                Get started
              </Link>
            </div>
            <div className="pt-6 pb-8 px-6">
              <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Unlimited job management</span>
                </li>
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Featured provider listing</span>
                </li>
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Professional quote & invoice tools</span>
                </li>
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Business analytics dashboard</span>
                </li>
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Client management system</span>
                </li>
                <li className="flex space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-gray-500">Priority customer support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-6 divide-y divide-gray-200">
            <div className="pt-6">
              <dt className="text-lg">
                <span className="font-medium text-gray-900">Can I change plans later?</span>
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.
              </dd>
            </div>

            <div className="pt-6">
              <dt className="text-lg">
                <span className="font-medium text-gray-900">Is there a free trial for premium plans?</span>
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                Yes, we offer a 14-day free trial for both Premium and Provider plans. No credit card required to start your trial.
              </dd>
            </div>

            <div className="pt-6">
              <dt className="text-lg">
                <span className="font-medium text-gray-900">What payment methods do you accept?</span>
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                We accept all major credit cards, PayPal, and ACH bank transfers for annual plans.
              </dd>
            </div>

            <div className="pt-6">
              <dt className="text-lg">
                <span className="font-medium text-gray-900">Can I cancel my subscription?</span>
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                Yes, you can cancel your subscription at any time from your account settings. Your plan will remain active until the end of your current billing period.
              </dd>
            </div>

            <div className="pt-6">
              <dt className="text-lg">
                <span className="font-medium text-gray-900">Do you offer discounts for teams?</span>
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                Yes, we offer special pricing for service provider teams with 5 or more members. Contact our sales team for more information.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Sign up for free today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            No credit card required. Start with our free plan and upgrade when you're ready.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                About
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/features/homeowners" className="text-base text-gray-500 hover:text-gray-900">
                For Homeowners
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/features/providers" className="text-base text-gray-500 hover:text-gray-900">
                For Service Providers
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/features/pricing" className="text-base text-gray-500 hover:text-gray-900">
                Pricing
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} Home Swerv. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
