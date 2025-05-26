import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useHomeowner } from '../../contexts/HomeownerContext'
import Sidebar from './Sidebar'
import Header from './Header'
import UserTypeSelection from './UserTypeSelection'

function DashboardLayout({ userType }) {
  const { user, providerProfile, loading: authLoading } = useAuth()
  const { homeownerProfile, loading: homeownerLoading } = useHomeowner()
  const [showSidebar, setShowSidebar] = useState(true)
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(false)
  const navigate = useNavigate()
  
  useEffect(() => {
    // Check if user has both profiles and needs to select which one to use
    if (!authLoading && !homeownerLoading && user) {
      const hasProviderProfile = !!providerProfile
      const hasHomeownerProfile = !!homeownerProfile
      
      if (hasProviderProfile && hasHomeownerProfile) {
        // User has both profiles, check if they're on the correct dashboard
        if (userType === 'provider' && !window.location.pathname.startsWith('/provider/')) {
          navigate('/provider/dashboard')
        } else if (userType === 'homeowner' && !window.location.pathname.startsWith('/homeowner/')) {
          navigate('/homeowner/dashboard')
        }
      } else if (hasProviderProfile && userType === 'homeowner') {
        // User only has provider profile but is trying to access homeowner dashboard
        navigate('/provider/dashboard')
      } else if (hasHomeownerProfile && userType === 'provider') {
        // User only has homeowner profile but is trying to access provider dashboard
        navigate('/homeowner/dashboard')
      } else if (!hasProviderProfile && !hasHomeownerProfile) {
        // User has no profiles, show selection screen
        setShowUserTypeSelection(true)
      }
    }
  }, [user, providerProfile, homeownerProfile, authLoading, homeownerLoading, userType, navigate])
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }
  
  if (authLoading || homeownerLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (showUserTypeSelection) {
    return <UserTypeSelection />
  }
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        showSidebar={showSidebar} 
        setShowSidebar={setShowSidebar}
        userType={userType}
      />
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} userType={userType} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
