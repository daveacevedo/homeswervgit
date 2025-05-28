import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { 
  Bars3Icon, 
  XMarkIcon, 
  BellIcon, 
  UserCircleIcon,
  HomeIcon,
  WrenchScrewdriverIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

function MainLayout() {
  const { user, logout } = useAuth();
  const { userProfile, notifications } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = userProfile?.role || 'homeowner';
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Navigation items based on user role
  const navigation = {
    homeowner: [
      { name: 'Dashboard', href: '/homeowner/dashboard', icon: HomeIcon },
      { name: 'Projects', href: '/homeowner/projects', icon: WrenchScrewdriverIcon },
      { name: 'Providers', href: '/homeowner/providers', icon: UsersIcon },
      { name: 'Messages', href: '/homeowner/messages', icon: ChatBubbleLeftRightIcon },
      { name: 'Settings', href: '/homeowner/settings', icon: Cog6ToothIcon },
    ],
    provider: [
      { name: 'Dashboard', href: '/provider/dashboard', icon: HomeIcon },
      { name: 'Jobs', href: '/provider/jobs', icon: WrenchScrewdriverIcon },
      { name: 'Calendar', href: '/provider/calendar', icon: CalendarIcon },
      { name: 'Messages', href: '/provider/messages', icon: ChatBubbleLeftRightIcon },
      { name: 'Settings', href: '/provider/settings', icon: Cog6ToothIcon },
    ],
  };

  const currentNavigation = navigation[userRole] || navigation.homeowner;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white">
          <div className="flex items-center justify-between h-16 px-6 bg-blue-600">
            <Link to="/" className="text-xl font-bold text-white">ServiceConnectPro</Link>
            <button
              className="text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 px-4 py-4 overflow-y-auto">
            <nav className="space-y-1">
              {currentNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 bg-blue-600">
            <Link to="/" className="text-xl font-bold text-white">ServiceConnectPro</Link>
          </div>
          
          <div className="flex flex-col flex-1 px-4 py-4 overflow-y-auto">
            <nav className="flex-1 space-y-1">
              {currentNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6 lg:px-8">
          <button
            className="text-gray-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            {/* Notifications dropdown */}
            <div className="relative">
              <button
                className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileDropdownOpen(false);
                }}
              >
                <BellIcon className="w-6 h-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 w-80 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-2">
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                      Notifications
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-2 text-sm ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <p className="font-medium text-gray-900">{notification.title}</p>
                            <p className="text-gray-600">{notification.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile dropdown */}
            <div className="relative">
              <button
                className="flex items-center text-gray-500"
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationsOpen(false);
                }}
              >
                {userProfile?.avatar_url ? (
                  <img
                    src={userProfile.avatar_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="w-8 h-8" />
                )}
                <span className="ml-2 text-sm font-medium">
                  {userProfile?.full_name || user?.email || 'User'}
                </span>
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      to={`/${userRole}/profile`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to={`/${userRole}/settings`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
