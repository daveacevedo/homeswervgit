import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function Calendar() {
  const { providerProfile } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month') // 'month', 'week', 'day'
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    start_time: '',
    end_time: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    location: '',
    notes: '',
  })
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  useEffect(() => {
    if (providerProfile) {
      fetchAppointments()
    }
  }, [providerProfile, currentDate, view])
  
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      
      // Calculate date range based on view
      const startDate = new Date(currentDate)
      const endDate = new Date(currentDate)
      
      if (view === 'month') {
        startDate.setDate(1)
        endDate.setMonth(endDate.getMonth() + 1)
        endDate.setDate(0)
      } else if (view === 'week') {
        const day = startDate.getDay()
        startDate.setDate(startDate.getDate() - day)
        endDate.setDate(endDate.getDate() + (6 - day))
      }
      
      // Format dates for query
      const startDateStr = startDate.toISOString()
      const endDateStr = endDate.toISOString()
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('provider_id', providerProfile.id)
        .gte('start_time', startDateStr)
        .lte('start_time', endDateStr)
        .order('start_time', { ascending: true })
      
      if (error) throw error
      
      setAppointments(data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateAppointment = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)
      
      // Validate dates
      const startTime = new Date(newAppointment.start_time)
      const endTime = new Date(newAppointment.end_time)
      
      if (endTime <= startTime) {
        setError('End time must be after start time')
        return
      }
      
      const appointmentData = {
        provider_id: providerProfile.id,
        title: newAppointment.title,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        customer_name: newAppointment.customer_name,
        customer_email: newAppointment.customer_email,
        customer_phone: newAppointment.customer_phone,
        location: newAppointment.location,
        notes: newAppointment.notes,
        status: 'scheduled'
      }
      
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
      
      if (error) throw error
      
      // Add the new appointment to the list
      setAppointments([...appointments, data[0]])
      
      // Reset form
      setNewAppointment({
        title: '',
        start_time: '',
        end_time: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        location: '',
        notes: '',
      })
      
      setShowNewAppointmentForm(false)
      setSuccess('Appointment created successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error creating appointment:', error)
      setError('Failed to create appointment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewAppointment({
      ...newAppointment,
      [name]: value
    })
  }
  
  const generateCalendarDays = () => {
    const days = []
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const today = new Date()
    
    // Get the day of the week for the first day of the month (0 = Sunday, 6 = Saturday)
    const firstDayOfMonth = date.getDay()
    
    // Add days from previous month to fill the first row
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        isToday: false
      })
    }
    
    // Add days of current month
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), i)
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        isToday: 
          currentDate.getDate() === today.getDate() &&
          currentDate.getMonth() === today.getMonth() &&
          currentDate.getFullYear() === today.getFullYear()
      })
    }
    
    // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
        isCurrentMonth: false,
        isToday: false
      })
    }
    
    return days
  }
  
  const getAppointmentsForDate = (date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.start_time)
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      )
    })
  }
  
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  const changeMonth = (increment) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + increment)
    setCurrentDate(newDate)
  }
  
  const goToToday = () => {
    setCurrentDate(new Date())
  }
  
  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your appointments and schedule.
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
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={goToToday}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Today
            </button>
            <button
              onClick={() => changeMonth(-1)}
              className="inline-flex items-center px-2 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="inline-flex items-center px-2 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setShowNewAppointmentForm(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Appointment
            </button>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-7 gap-px bg-gray-200 border-b border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-white py-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {generateCalendarDays().map((day, index) => {
              const dayAppointments = getAppointmentsForDate(day.date)
              
              return (
                <div
                  key={index}
                  className={`bg-white min-h-[100px] p-2 ${
                    day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  } ${day.isToday ? 'bg-primary-50' : ''}`}
                >
                  <div className="font-medium text-sm">{day.date.getDate()}</div>
                  <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                    {dayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="px-2 py-1 text-xs rounded bg-primary-100 text-primary-800 truncate"
                        title={`${appointment.title} - ${formatTime(appointment.start_time)} to ${formatTime(appointment.end_time)}`}
                      >
                        {formatTime(appointment.start_time)} - {appointment.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* New Appointment Modal */}
      {showNewAppointmentForm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      New Appointment
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleCreateAppointment}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                              Title
                            </label>
                            <input
                              type="text"
                              name="title"
                              id="title"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={newAppointment.title}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                                Start Time
                              </label>
                              <input
                                type="datetime-local"
                                name="start_time"
                                id="start_time"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={newAppointment.start_time}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                                End Time
                              </label>
                              <input
                                type="datetime-local"
                                name="end_time"
                                id="end_time"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={newAppointment.end_time}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
                              Customer Name
                            </label>
                            <input
                              type="text"
                              name="customer_name"
                              id="customer_name"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={newAppointment.customer_name}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700">
                                Customer Email
                              </label>
                              <input
                                type="email"
                                name="customer_email"
                                id="customer_email"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={newAppointment.customer_email}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700">
                                Customer Phone
                              </label>
                              <input
                                type="tel"
                                name="customer_phone"
                                id="customer_phone"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={newAppointment.customer_phone}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                              Location
                            </label>
                            <input
                              type="text"
                              name="location"
                              id="location"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={newAppointment.location}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                              Notes
                            </label>
                            <textarea
                              name="notes"
                              id="notes"
                              rows="3"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={newAppointment.notes}
                              onChange={handleInputChange}
                            ></textarea>
                          </div>
                        </div>
                        
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                            disabled={submitting}
                          >
                            {submitting ? 'Creating...' : 'Create Appointment'}
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={() => setShowNewAppointmentForm(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar
