import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SiteMap = () => {
  // Define all routes by user role
  const routes = {
    public: [
      { name: 'Home', path: '/', description: 'Landing page with overview of the platform' },
      { name: 'About', path: '/about', description: 'Information about Home Swerv and its mission' },
      { name: 'Pricing', path: '/pricing', description: 'Pricing plans for homeowners and service providers' },
      { name: 'Contact', path: '/contact', description: 'Contact information and form' },
      { name: 'Login', path: '/login', description: 'User login page' },
      { name: 'Register', path: '/register', description: 'New user registration page' },
      { name: 'Forgot Password', path: '/forgot-password', description: 'Password recovery page' },
      { name: 'Reset Password', path: '/reset-password', description: 'Password reset page' },
    ],
    features: [
      { name: 'For Homeowners', path: '/features/homeowners', description: 'Features and benefits for homeowners' },
      { name: 'For Service Providers', path: '/features/providers', description: 'Features and benefits for service providers' },
      { name: 'Pricing', path: '/features/pricing', description: 'Detailed pricing information' },
      { name: 'Testimonials', path: '/features/testimonials', description: 'User testimonials and success stories' },
    ],
    homeowner: [
      { name: 'Dashboard', path: '/homeowner/dashboard', description: 'Homeowner dashboard with overview of projects and activities' },
      { name: 'Projects', path: '/homeowner/projects', description: 'Manage home improvement projects' },
      { name: 'Find Services', path: '/homeowner/services', description: 'Search and connect with service providers' },
      { name: 'Rewards', path: '/homeowner/rewards', description: 'View and redeem rewards points' },
      { name: 'Profile', path: '/homeowner/profile', description: 'Manage homeowner profile information' },
      { name: 'Settings', path: '/homeowner/settings', description: 'Account settings and preferences' },
    ],
    provider: [
      { name: 'Dashboard', path: '/provider/dashboard', description: 'Service provider dashboard with overview of jobs and activities' },
      { name: 'Jobs', path: '/provider/jobs', description: 'Manage current and upcoming jobs' },
      { name: 'Clients', path: '/provider/clients', description: 'View and manage client relationships' },
      { name: 'Calendar', path: '/provider/calendar', description: 'Schedule and manage appointments' },
      { name: 'Profile', path: '/provider/profile', description: 'Manage service provider profile and services' },
      { name: 'Settings', path: '/provider/settings', description: 'Account settings and preferences' },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', description: 'Admin dashboard with platform overview' },
      { name: 'Users', path: '/admin/users', description: 'Manage platform users' },
      { name: 'Content', path: '/admin/content', description: 'Manage platform content' },
      { name: 'Settings', path: '/admin/settings', description: 'Platform settings and configuration' },
    ],
    shared: [
      { name: 'User Type Selection', path: '/user-type-selection', description: 'Select between homeowner and provider roles' },
    ]
  };

  return (
    <div className="bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Home Swerv Site Map
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Complete navigation guide for all user roles
          </p>
        </div>

        {/* Public Routes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Public Pages</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {routes.public.map((route) => (
                <li key={route.path}>
                  <Link to={route.path} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">{route.name}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Public
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {route.description}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span className="truncate">{route.path}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features Routes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Feature Pages</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {routes.features.map((route) => (
                <li key={route.path}>
                  <Link to={route.path} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">{route.name}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Feature
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {route.description}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span className="truncate">{route.path}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Homeowner Routes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Homeowner Pages</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {routes.homeowner.map((route) => (
                <li key={route.path}>
                  <Link to={route.path} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">{route.name}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Homeowner
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {route.description}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span className="truncate">{route.path}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Provider Routes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Provider Pages</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {routes.provider.map((route) => (
                <li key={route.path}>
                  <Link to={route.path} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">{route.name}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            Provider
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {route.description}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span className="truncate">{route.path}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Admin Routes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Pages</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {routes.admin.map((route) => (
                <li key={route.path}>
                  <Link to={route.path} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">{route.name}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Admin
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {route.description}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span className="truncate">{route.path}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Shared Routes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shared Pages</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {routes.shared.map((route) => (
                <li key={route.path}>
                  <Link to={route.path} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">{route.name}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Shared
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {route.description}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span className="truncate">{route.path}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Navigation Flow Diagram */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Navigation Flow</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Public User Flow</h3>
            <p className="text-gray-500 mb-4">
              Home → About/Features/Pricing/Contact → Login/Register
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-4">New User Flow</h3>
            <p className="text-gray-500 mb-4">
              Register → User Type Selection → Homeowner Dashboard or Provider Dashboard
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-4">Homeowner User Flow</h3>
            <p className="text-gray-500 mb-4">
              Login → Homeowner Dashboard → Projects/Services/Rewards → Profile/Settings
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-4">Provider User Flow</h3>
            <p className="text-gray-500 mb-4">
              Login → Provider Dashboard → Jobs/Clients/Calendar → Profile/Settings
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-4">Dual-Role User Flow</h3>
            <p className="text-gray-500 mb-4">
              Login → Active Role Dashboard → Profile Toggle → Other Role Dashboard
            </p>
          </div>
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

export default SiteMap;
