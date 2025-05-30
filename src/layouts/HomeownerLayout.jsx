import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useHomeowner } from '../contexts/HomeownerContext';
import { 
  Bars3Icon, 
  XMarkIcon, 
  HomeIcon, 
  UserIcon, 
  BriefcaseIcon, 
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const HomeownerLayout = () => {
  const { user, signOut } = useAuth();
  const { homeownerProfile } = useHomeowner() || {};
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Mock notifications for UI demonstration
  const notifications = [
    {
      id: 1,
      message: 'New quote received for your kitchen renovation project',
      created_at: new Date().toISOString(),
      read: false
    },
    {
      id: 2,
      message: 'Provider John Smith has sent you a message',
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      read: true
    }
  ];

  const unreadNotifications = notifications?.filter(n => !n.read)?.length || 0;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Navigation items for homeowner
  const navigation = [
    { name: 'Dashboard', href: '/homeowner/dashboard', icon: HomeIcon },
    { name: 'Projects', href: '/homeowner/projects', icon: BriefcaseIcon },
    { name: 'Find Providers', href: '/homeowner/services', icon: UserGroupIcon },
    { name: 'Messages', href: '/homeowner/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Profile', href: '/homeowner/profile', icon: UserIcon },
    { name: 'Settings', href: '/homeowner/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
        
        <div className="relative flex flex-col w-full max-w-xs pt-5 pb-4 bg-white">
          <div className="absolute top-0 right-0 pt-2 pr-2">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex items-center flex-shrink-0 px-4">
            <Link to="/" className="text-xl font-bold text-blue-600">Home Swerv</Link>
          </div>
          
          <div className="flex-1 h-0 mt-5 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`${
                      location.pathname === item.href ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-4 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto border-r border-gray-200 bg-white">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link to="/" className="text-xl font-bold text-blue-600">Home Swerv</Link>
          </div>
          
          <div className="flex flex-col flex-grow mt-5">
            <nav className="flex-1 px-2 space-y-1 bg-white">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      location.pathname === item.href ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="flex-1 px-4 flex justify-end">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Rewards display */}
              <div className="mr-4 flex items-center bg-blue-50 px-3 py-1 rounded-full">
                <StarIcon className="h-5 w-5 text-blue-600 mr-1" />
                <span className="text-sm font-medium text-blue-600">
                  {homeownerProfile?.rewards_points || 0} Points
                </span>
              </div>
              
              {/* Notifications dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                  )}
                </button>
                
                {notificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications && notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-2 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                          >
                            <p className="text-sm text-gray-700">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">No notifications</div>
                      )}
                    </div>
                    {notifications && notifications.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-200">
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:text-blue-500"
                          onClick={() => {
                            // Handle mark all as read
                            setNotificationsOpen(false);
                          }}
                        >
                          Mark all as read
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu-button"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    {homeownerProfile?.avatar_url ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={homeownerProfile.avatar_url}
                        alt="User avatar"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {homeownerProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </button>
                </div>
                
                {userMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <p className="font-medium">{homeownerProfile?.full_name || 'Homeowner'}</p>
                      <p className="text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/homeowner/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/homeowner/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleSignOut();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 pb-8">
          <div className="py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeownerLayout;
