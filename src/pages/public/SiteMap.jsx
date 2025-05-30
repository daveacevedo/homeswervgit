import React from 'react';
import { Link } from 'react-router-dom';

const SiteMap = () => {
  // Define site structure
  const siteStructure = [
    {
      title: 'Public Pages',
      links: [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Features', path: '/features' },
        { name: 'Homeowner Features', path: '/features/homeowners' },
        { name: 'Provider Features', path: '/features/providers' },
        { name: 'Testimonials', path: '/features/testimonials' },
        { name: 'Pricing', path: '/pricing' },
      ]
    },
    {
      title: 'Authentication',
      links: [
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
        { name: 'Forgot Password', path: '/forgot-password' },
        { name: 'Reset Password', path: '/reset-password' },
      ]
    },
    {
      title: 'Homeowner Area',
      links: [
        { name: 'Dashboard', path: '/homeowner/dashboard' },
        { name: 'Profile', path: '/homeowner/profile' },
        { name: 'Projects', path: '/homeowner/projects' },
        { name: 'Messages', path: '/homeowner/messages' },
        { name: 'Settings', path: '/homeowner/settings' },
      ]
    },
    {
      title: 'Service Provider Area',
      links: [
        { name: 'Dashboard', path: '/provider/dashboard' },
        { name: 'Profile', path: '/provider/profile' },
        { name: 'Jobs', path: '/provider/jobs' },
        { name: 'Messages', path: '/provider/messages' },
        { name: 'Settings', path: '/provider/settings' },
      ]
    },
    {
      title: 'Onboarding',
      links: [
        { name: 'User Type Selection', path: '/user-type-selection' },
        { name: 'Homeowner Profile Setup', path: '/homeowner-profile-setup' },
        { name: 'Provider Profile Setup', path: '/provider-profile-setup' },
      ]
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="bg-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Site Map</h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            A complete overview of all pages available on the Home Swerv platform.
          </p>
        </div>
      </div>

      {/* Site structure section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 lg:grid-cols-3 md:gap-x-12 md:gap-y-16">
          {siteStructure.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <Link to={link.path} className="ml-3 text-base text-gray-700 hover:text-blue-600">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Sitemap visualization */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Site Structure Visualization</h2>
            <p className="mt-4 text-lg text-gray-500">
              A visual representation of how our site is organized.
            </p>
          </div>
          
          <div className="mt-12 bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-center">
              <div className="border-2 border-blue-600 rounded-lg p-4 text-center bg-blue-50">
                <span className="font-bold text-blue-800">Home Page</span>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Public Pages', 'Authentication', 'Homeowner Area', 'Provider Area'].map((category, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="border-2 border-blue-500 rounded-lg p-3 text-center bg-blue-50 w-full">
                    <span className="font-bold text-blue-700">{category}</span>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="border-2 border-gray-300 rounded-lg p-2 text-center w-full">
                    <span className="text-sm text-gray-600">Multiple Pages</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Information */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-3xl font-extrabold text-gray-900">SEO Information</h2>
            <p className="mt-4 text-lg text-gray-500">
              This sitemap helps search engines discover and index all pages on our website.
            </p>
            
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">XML Sitemap</h3>
              <p className="mt-2 text-gray-600">
                For search engine crawlers, our XML sitemap is available at:
              </p>
              <div className="mt-2 bg-gray-100 p-3 rounded font-mono text-sm">
                https://homeswerv.com/sitemap.xml
              </div>
            </div>
            
            <div className="mt-6 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">Robots.txt</h3>
              <p className="mt-2 text-gray-600">
                Our robots.txt file is available at:
              </p>
              <div className="mt-2 bg-gray-100 p-3 rounded font-mono text-sm">
                https://homeswerv.com/robots.txt
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Can't find what you're looking for?</span>
            <span className="block text-blue-200">Our support team is here to help.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMap;
