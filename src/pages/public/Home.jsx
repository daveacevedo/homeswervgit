import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <header className="relative bg-primary-600">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.pexels.com/photos/3990359/pexels-photo-3990359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Home renovation"
          />
          <div className="absolute inset-0 bg-primary-600 mix-blend-multiply opacity-90" aria-hidden="true"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">ServiceConnectPro</h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-100">
            Connect with trusted home service professionals and manage your projects with ease.
          </p>
          <div className="mt-10 flex space-x-4">
            <Link
              to="/register"
              className="inline-block bg-secondary-500 py-3 px-6 rounded-md font-medium text-white shadow hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="inline-block bg-white py-3 px-6 rounded-md font-medium text-primary-600 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              Learn More
            </Link>
          </div>
        </div>
      </header>

      {/* Features section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to manage home services
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Whether you're a homeowner or service provider, we've got you covered.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Project Management</h3>
                <p className="mt-2 text-base text-gray-500">
                  Create, track, and manage your home improvement projects from start to finish.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Find Trusted Professionals</h3>
                <p className="mt-2 text-base text-gray-500">
                  Connect with verified service providers in your area with reviews and ratings.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Scheduling & Calendar</h3>
                <p className="mt-2 text-base text-gray-500">
                  Book appointments and manage your schedule with our easy-to-use calendar.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Messaging</h3>
                <p className="mt-2 text-base text-gray-500">
                  Communicate directly with service providers through our secure messaging system.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Secure Payments</h3>
                <p className="mt-2 text-base text-gray-500">
                  Process payments securely through our platform with protection for both parties.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Community Inspiration</h3>
                <p className="mt-2 text-base text-gray-500">
                  Browse project ideas and share your completed projects with our community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Choose the plan that's right for you or your business
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-6 lg:grid-cols-3">
            {/* Basic Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Basic</h3>
                <p className="mt-4 text-sm text-gray-500">Perfect for homeowners with occasional projects</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">Free</span>
                </p>
                <Link
                  to="/register"
                  className="mt-8 block w-full bg-primary-600 py-2 px-3 text-center rounded-md text-white font-medium hover:bg-primary-700"
                >
                  Get Started
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">What's included</h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Up to 3 active projects</span>
                  </li>
                  <li className="flex space-x-3">
                    <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Find and contact service providers</span>
                  </li>
                  <li className="flex space-x-3">
                    <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Basic project management tools</span>
                  </li>
                  <li className="flex space-x-3">
                    <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Community access</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-gray-50">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Pro</h3>
                <p className="mt-4 text-sm text-gray-500">For homeowners with multiple or complex projects</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$9.99</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <Link
                  to="/register"
                  className="mt-8 block w-full bg-secondary-500 py-2 px-3 text-center rounded-md text-white font-medium hover:bg-secondary-600"
                >
                  Get Started
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">What's included</h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Unlimited projects</span>
                  </li>
                  <li className="flex space-x-3">
                    <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Advanced project management</span>
                  </li>
                  <li className="flex space-x-3">
                    <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Priority support</span>
                  </li>
                  <li className="flex space-x-3">
                    <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Document storage</span>
                  </li>
                  <li className="flex space-x-3">
                    <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Budget tracking tools</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Business Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Business</h3>
                <p className="mt-4 text-sm text-gray-500">For service providers and contractors</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$29.99</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <Link
                  to="/register"
                  className="mt-8 block w-full bg-primary-600 py-2 px-3 text-center rounded-md text-white font-medium hover:bg-primary-700"
                >
                  Get Started
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">What's included</h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Business profile & portfolio</span>
                  </li>
                  <li className="flex space-x-3">
                    <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Lead generation tools</span>
                  </li>
                  <li className="flex space-x-3">
                    <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Client management system</span>
                  </li>
                  <li className="flex space-x-3">
                    <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Invoicing & payment processing</span>
                  </li>
                  <li className="flex space-x-3">
                    <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Calendar & scheduling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-200">Join thousands of satisfied users today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500"
              >
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-base text-gray-500 hover:text-gray-900">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-base text-gray-500 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/help" className="text-base text-gray-500 hover:text-gray-900">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-base text-gray-500 hover:text-gray-900">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; 2023 ServiceConnectPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
