import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

function Settings() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('account')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  
  // Account settings
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email_new_leads: true,
    email_messages: true,
    email_job_updates: true,
    push_new_leads: false,
    push_messages: true,
    push_job_updates: false,
  })
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    show_contact_info: true,
    show_reviews: true,
    show_portfolio: true,
    allow_messaging: true,
  })
  
  const handleUpdateEmail = async (e) => {
    e.preventDefault()
    
    if (!email || email === user.email) return
    
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.updateUser({ email })
      
      if (error) throw error
      
      setSuccess('Email update initiated. Please check your new email for confirmation.')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error updating email:', error)
      setError(error.message || 'Failed to update email')
    } finally {
      setLoading(false)
    }
  }
  
  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    
    if (!currentPassword || !newPassword || !confirmPassword) return
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      // First verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })
      
      if (signInError) throw new Error('Current password is incorrect')
      
      // Then update password
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      
      if (error) throw error
      
      setSuccess('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error updating password:', error)
      setError(error.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }
  
  const handleUpdateNotifications = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      // Update notification settings in the database
      const { error } = await supabase
        .from('provider_settings')
        .upsert({
          provider_id: user.id,
          ...notificationSettings,
        })
      
      if (error) throw error
      
      setSuccess('Notification settings updated successfully')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error updating notification settings:', error)
      setError(error.message || 'Failed to update notification settings')
    } finally {
      setLoading(false)
    }
  }
  
  const handleUpdatePrivacy = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      // Update privacy settings in the database
      const { error } = await supabase
        .from('provider_settings')
        .upsert({
          provider_id: user.id,
          ...privacySettings,
        })
      
      if (error) throw error
      
      setSuccess('Privacy settings updated successfully')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error updating privacy settings:', error)
      setError(error.message || 'Failed to update privacy settings')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      // Delete user data from database
      const { error: deleteDataError } = await supabase
        .from('providers')
        .delete()
        .eq('id', user.id)
      
      if (deleteDataError) throw deleteDataError
      
      // Delete auth user
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      
      if (error) throw error
      
      // Sign out
      await logout()
    } catch (error) {
      console.error('Error deleting account:', error)
      setError(error.message || 'Failed to delete account')
      setLoading(false)
    }
  }
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    })
  }
  
  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target
    setPrivacySettings({
      ...privacySettings,
      [name]: checked,
    })
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences.
        </p>
      </div>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('account')}
              className={`${
                activeTab === 'account'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Account
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`${
                activeTab === 'privacy'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Privacy
            </button>
            <button
              onClick={() => setActiveTab('danger')}
              className={`${
                activeTab === 'danger'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Danger Zone
            </button>
          </nav>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Account Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your account email and password.
                </p>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <form onSubmit={handleUpdateEmail} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="flex-1 focus:ring-primary-500 focus:border-primary-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={loading || email === user.email}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Email'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <div className="mt-4 sm:col-span-4">
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="current-password"
                          id="current-password"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="new-password"
                          id="new-password"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="confirm-password"
                          id="confirm-password"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          
          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage how you receive notifications.
                </p>
              </div>
              
              <form onSubmit={handleUpdateNotifications}>
                <div className="mt-6">
                  <fieldset>
                    <legend className="text-base font-medium text-gray-900">Email Notifications</legend>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email_new_leads"
                            name="email_new_leads"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            checked={notificationSettings.email_new_leads}
                            onChange={handleNotificationChange}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="email_new_leads" className="font-medium text-gray-700">
                            New Leads
                          </label>
                          <p className="text-gray-500">Get notified when new leads matching your services are posted.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email_messages"
                            name="email_messages"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            checked={notificationSettings.email_messages}
                            onChange={handleNotificationChange}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="email_messages" className="font-medium text-gray-700">
                            Messages
                          </label>
                          <p className="text-gray-500">Receive email notifications for new messages.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email_job_updates"
                            name="email_job_updates"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            checked={notificationSettings.email_job_updates}
                            onChange={handleNotificationChange}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="email_job_updates" className="font-medium text-gray-700">
                            Job Updates
                          </label>
                          <p className="text-gray-500">Get notified about updates to your active jobs.</p>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                
                <div className="mt-6">
                  <fieldset>
                    <legend className="text-base font-medium text-gray-900">Push Notifications</legend>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="push_new_leads"
                            name="push_new_leads"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            checked={notificationSettings.push_new_leads}
                            onChange={handleNotificationChange}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="push_new_leads" className="font-medium text-gray-700">
                            New Leads
                          </label>
                          <p className="text-gray-500">Get push notifications for new leads.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="push_messages"
                            name="push_messages"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            checked={notificationSettings.push_messages}
                            onChange={handleNotificationChange}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="push_messages" className="font-medium text-gray-700">
                            Messages
                          </label>
                          <p className="text-gray-500">Receive push notifications for new messages.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="push_job_updates"
                            name="push_job_updates"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            checked={notificationSettings.push_job_updates}
                            onChange={handleNotificationChange}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="push_job_updates" className="font-medium text-gray-700">
                            Job Updates
                          </label>
                          <p className="text-gray-500">Get push notifications about updates to your active jobs.</p>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Notification Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Privacy Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Control what information is visible to others.
                </p>
              </div>
              
              <form onSubmit={handleUpdatePrivacy}>
                <div className="mt-6">
                  <fieldset>
                    <legend className="text-base font-medium text-gray-900">Profile Visibility</legend>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="show_contact_info"
                            name="show_contact_info"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            checked={privacySettings.show_contact_info}
                            onChange={handlePrivacyChange}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="show_contact_info" className="font-medium text-gray-700">
                            Show Contact Information
                          </label>
                          <p className="text-gray-500">Allow homeowners to see your contact information.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="show_reviews"
                            name="show_reviews"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            checked={privacySettings.show_reviews}
                            onChange={handlePrivacyChange}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="show_reviews" className="font-medium text-gray-700">
                            Show Reviews
                          </label>
                          <p className="text-gray-500">Display reviews on your public profile.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="show_portfolio"
                            name="show_portfolio"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            checked={privacySettings.show_portfolio}
                            onChange={handlePrivacyChange}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="show_portfolio" className="font-medium text-gray-700">
                            Show Portfolio
                          </label>
                          <p className="text-gray-500">Display your portfolio on your public profile.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="allow_messaging"
                            name="allow_messaging"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            checked={privacySettings.allow_messaging}
                            onChange={handlePrivacyChange}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="allow_messaging" className="font-medium text-gray-700">
                            Allow Messaging
                          </label>
                          <p className="text-gray-500">Allow homeowners to send you direct messages.</p>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Privacy Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Danger Zone */}
          {activeTab === 'danger' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-red-600">Danger Zone</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Actions here can't be undone. Be careful.
                </p>
              </div>
              
              <div className="mt-6 border border-red-200 rounded-md p-4 bg-red-50">
                <h3 className="text-base font-medium text-red-800">Delete Account</h3>
                <p className="mt-1 text-sm text-red-600">
                  Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
