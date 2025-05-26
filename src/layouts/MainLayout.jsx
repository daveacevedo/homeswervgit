import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = () => {
  const { user, userRole, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const { error } = await logout();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-blue-700 hover:text-white';
  };

  const getNavLinks = () => {
    if (userRole === 'provider') {
      return [
        { name: 'Dashboard', path: '/provider/dashboard' },
        { name: 'Jobs', path: '/provider/jobs' },
        { name: 'Calendar', path: '/provider/calendar' },
        { name: 'Messages', path: '/provider/messages' },
        { name: 'Community', path: '/community' },
      ];
    } else if (userRole === 'homeowner') {
      return [
        { name: 'Dashboard', path: '/homeowner/dashboard' },
        { name: 'Projects', path: '/homeowner/projects' },
        { name: 'Providers', path: '/homeowner/providers' },
        { name: 'Messages', path: '/homeowner/messages' },
        { name: 'Community', path: '/community' },
      ];
    } else {
      // Default or public navigation
      return [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Community', path: '/community' },
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="text-white font-bold text-xl">HomeServiceHub</Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(link.path)}`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {user ? (
                  <div className="ml-3 relative">
                    <div>
                      <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="max-w-xs bg-blue-600 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
                        id="user-menu-button"
                        aria-expanded="false"
                        aria-haspopup="true"
                      >
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-white">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                      </button>
                    </div>
                    {isProfileMenuOpen && (
                      <div
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                        tabIndex="-1"
                      >
                        <Link
                          to={`/${userRole}/profile`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          tabIndex="-1"
                          id="user-menu-item-0"
                        >
                          Your Profile
                        </Link>
                        <Link
                          to={`/${userRole}/settings`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          tabIndex="-1"
                          id="user-menu-item-1"
                        >
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          tabIndex="-1"
                          id="user-menu-item-2"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <Link
                      to="/login"
                      className="text-white bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="text-blue-600 bg-white hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-blue-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-blue-700">
            {user ? (
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center text-white">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">{user.email}</div>
                  <div className="text-sm font-medium leading-none text-blue-200 mt-1">
                    {userRole && userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </div>
                </div>
              </div>
            ) : null}
            <div className="mt-3 px-2 space-y-1">
              {user ? (
                <>
                  <Link
                    to={`/${userRole}/profile`}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to={`/${userRole}/settings`}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-blue-700 hover:bg-blue-800"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-white hover:bg-gray-100"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} HomeServiceHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
