import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  HomeIcon, 
  UserIcon, 
  ClipboardDocumentListIcon, 
  ChatBubbleLeftRightIcon, 
  Cog6ToothIcon,
  BriefcaseIcon,
  UsersIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  StarIcon
} from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Sidebar({ showSidebar, setShowSidebar, userType }) {
  const location = useLocation();
  
  // Define navigation items based on user type
  const navigation = userType === 'homeowner' 
    ? [
        { name: 'Dashboard', href: '/homeowner/dashboard', icon: HomeIcon },
        { name: 'Profile', href: '/homeowner/profile', icon: UserIcon },
        { name: 'Projects', href: '/homeowner/projects', icon: ClipboardDocumentListIcon },
        { name: 'Find Services', href: '/homeowner/services', icon: WrenchScrewdriverIcon },
        { name: 'Messages', href: '/homeowner/messages', icon: ChatBubbleLeftRightIcon },
        { name: 'Rewards', href: '/homeowner/rewards', icon: StarIcon },
        { name: 'Settings', href: '/homeowner/settings', icon: Cog6ToothIcon },
      ]
    : [
        { name: 'Dashboard', href: '/provider/dashboard', icon: HomeIcon },
        { name: 'Profile', href: '/provider/profile', icon: UserIcon },
        { name: 'Jobs', href: '/provider/jobs', icon: BriefcaseIcon },
        { name: 'Clients', href: '/provider/clients', icon: UsersIcon },
        { name: 'Calendar', href: '/provider/calendar', icon: CalendarIcon },
        { name: 'Messages', href: '/provider/messages', icon: ChatBubbleLeftRightIcon },
        { name: 'Settings', href: '/provider/settings', icon: Cog6ToothIcon },
      ];
  
  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={classNames(
          showSidebar ? 'fixed inset-0 z-40 md:hidden' : 'hidden',
          'transition-opacity ease-linear duration-300'
        )}
      >
        {/* Overlay */}
        <div
          className={classNames(
            showSidebar ? 'opacity-100 ease-in duration-300' : 'opacity-0 ease-out duration-300',
            'fixed inset-0 bg-gray-600 bg-opacity-75'
          )}
          onClick={() => setShowSidebar(false)}
        ></div>
        
        {/* Sidebar panel */}
        <div className={classNames(
          showSidebar ? 'translate-x-0 ease-out duration-300' : '-translate-x-full ease-in duration-300',
          'relative flex-1 flex flex-col max-w-xs w-full bg-white transition transform'
        )}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setShowSidebar(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                Home Swerv
              </Link>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    location.pathname === item.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={classNames(
                      location.pathname === item.href
                        ? 'text-blue-600'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'mr-4 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link to="/" className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                    {userType === 'homeowner' ? 'H' : 'P'}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                    {userType === 'homeowner' ? 'Homeowner View' : 'Provider View'}
                  </p>
                  <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                    View main site
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className={classNames(
        'hidden md:flex md:flex-shrink-0',
        showSidebar ? 'md:w-64' : 'md:w-20'
      )}>
        <div className={classNames(
          'flex flex-col w-full',
          showSidebar ? 'md:w-64' : 'md:w-20'
        )}>
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className={classNames(
                "flex items-center flex-shrink-0 px-4",
                !showSidebar && "justify-center"
              )}>
                {showSidebar ? (
                  <Link to="/" className="text-2xl font-bold text-blue-600">
                    Home Swerv
                  </Link>
                ) : (
                  <Link to="/" className="text-2xl font-bold text-blue-600">
                    HS
                  </Link>
                )}
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      location.pathname === item.href
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                      !showSidebar && 'justify-center'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        location.pathname === item.href
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'flex-shrink-0 h-6 w-6',
                        showSidebar && 'mr-3'
                      )}
                      aria-hidden="true"
                    />
                    {showSidebar && <span>{item.name}</span>}
                    {!showSidebar && (
                      <span className="sr-only">{item.name}</span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className={classNames(
                  "flex items-center text-sm font-medium text-gray-500 hover:text-gray-700",
                  !showSidebar && "justify-center w-full"
                )}
              >
                {showSidebar ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Collapse</span>
                  </>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
