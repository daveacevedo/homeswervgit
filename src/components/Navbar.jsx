import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { userProfile } = useApp();
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const featuresRef = useRef(null);
  
  // Get the role from userProfile instead of activeRole
  const activeRole = userProfile?.role || 'homeowner';

  // Navigation items based on authentication and role
  const navigation = [
    { name: 'Home', href: '/', current: false },
    { name: 'About', href: '/about', current: false },
    { name: 'Pricing', href: '/pricing', current: false },
    { name: 'For Sale', href: '/real-estate', current: false }, // Added "For Sale" navigation item
    { name: 'Contact', href: '/contact', current: false },
  ];

  // Features dropdown items
  const featuresItems = [
    { name: 'For Homeowners', href: '/features/homeowners', description: 'Features for homeowners' },
    { name: 'For Service Providers', href: '/features/providers', description: 'Features for service providers' },
    { name: 'Pricing', href: '/features/pricing', description: 'Pricing plans and options' },
    { name: 'Testimonials', href: '/features/testimonials', description: 'Customer success stories' },
  ];

  // Add authenticated navigation items based on role
  if (user) {
    if (activeRole === 'homeowner') {
      navigation.push(
        { name: 'Dashboard', href: '/homeowner/dashboard', current: false },
        { name: 'Projects', href: '/homeowner/projects', current: false },
        { name: 'Find Services', href: '/homeowner/services', current: false },
        { name: 'Rewards', href: '/homeowner/rewards', current: false }
      );
    } else if (activeRole === 'provider') {
      navigation.push(
        { name: 'Dashboard', href: '/provider/dashboard', current: false },
        { name: 'Jobs', href: '/provider/jobs', current: false },
        { name: 'Clients', href: '/provider/clients', current: false },
        { name: 'Calendar', href: '/provider/calendar', current: false }
      );
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (featuresRef.current && !featuresRef.current.contains(event.target)) {
        setFeaturesOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [featuresRef]);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-2xl font-bold text-blue-600">
                    Home Swerv
                  </Link>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                    
                    {/* Features dropdown - visible in desktop view */}
                    <div className="relative" ref={featuresRef}>
                      <button
                        onClick={() => setFeaturesOpen(!featuresOpen)}
                        className="text-gray-500 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                        aria-expanded={featuresOpen}
                      >
                        Features
                        <ChevronDownIcon 
                          className="ml-1 h-4 w-4 transition-transform duration-200" 
                          aria-hidden="true" 
                        />
                      </button>
                      
                      {/* Features dropdown menu */}
                      {featuresOpen && (
                        <div className="absolute z-50 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            {featuresItems.map((item) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                className="group flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setFeaturesOpen(false)}
                              >
                                <div>
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  <p className="mt-1 text-xs text-gray-500">{item.description}</p>
                                </div>
                              </Link>
                            ))}
                            <div className="px-4 py-3 border-t border-gray-100">
                              <Link
                                to="/sitemap"
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                onClick={() => setFeaturesOpen(false)}
                              >
                                View Full Site Map →
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {user ? (
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                          {user.email && user.email[0] ? user.email[0].toUpperCase() : 'U'}
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <div className="px-4 py-2 text-xs text-gray-500">
                          Signed in as
                          <div className="font-medium text-gray-900 truncate">
                            {user.email || 'User'}
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-100"></div>
                        
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={`/${activeRole}/profile`}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={`/${activeRole}/settings`}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleSignOut}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block w-full text-left px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="hidden md:flex md:items-center">
                    <Link
                      to="/login"
                      className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              
              {/* Features dropdown for mobile */}
              <div>
                <button
                  onClick={() => setFeaturesOpen(!featuresOpen)}
                  className="text-gray-500 hover:bg-gray-50 hover:text-gray-900 w-full text-left px-3 py-2 rounded-md text-base font-medium flex justify-between items-center"
                >
                  Features
                  <ChevronDownIcon className="h-5 w-5" />
                </button>
                
                {featuresOpen && (
                  <div className="pl-4 space-y-1 mt-1 bg-gray-50 rounded-md py-2">
                    {featuresItems.map((item) => (
                      <div key={item.name} className="py-1">
                        <Link
                          to={item.href}
                          className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-sm font-medium"
                          onClick={() => setFeaturesOpen(false)}
                        >
                          {item.name}
                          <p className="text-xs text-gray-500 font-normal mt-1">{item.description}</p>
                        </Link>
                      </div>
                    ))}
                    <div className="px-3 py-2">
                      <Link
                        to="/sitemap"
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => setFeaturesOpen(false)}
                      >
                        View Full Site Map →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {!user && (
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-4">
                    <Link
                      to="/login"
                      className="block text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
