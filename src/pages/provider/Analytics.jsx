import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function Analytics() {
  const { providerProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('month') // 'week', 'month', 'year'
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalBids: 0,
    wonBids: 0,
    totalRevenue: 0,
    averageBidAmount: 0,
    conversionRate: 0,
    responseTime: 0
  })
  const [leadsByService, setLeadsByService] = useState([])
  const [leadsByMonth, setLeadsByMonth] = useState([])
  const [revenueByMonth, setRevenueByMonth] = useState([])
  const [topServices, setTopServices] = useState([])
  
  useEffect(() => {
    if (providerProfile) {
      fetchAnalyticsData()
    }
  }, [providerProfile, timeframe])
  
  const fetchAnalyticsData = async () => {
    if (!providerProfile) return
    
    try {
      setIsLoading(true)
      
      // Calculate date range based on timeframe
      const endDate = new Date()
      let startDate
      
      if (timeframe === 'week') {
        startDate = new Date()
        startDate.setDate(endDate.getDate() - 7)
      } else if (timeframe === 'month') {
        startDate = new Date()
        startDate.setMonth(endDate.getMonth() - 1)
      } else if (timeframe === 'year') {
        startDate = new Date()
        startDate.setFullYear(endDate.getFullYear() - 1)
      }
      
      // Fetch bids data
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select('*, projects(*)')
        .eq('provider_id', providerProfile.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
      
      if (bidsError) throw bidsError
      
      // Fetch projects data
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*, services(*)')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
      
      if (projectsError) throw projectsError
      
      // Calculate stats
      const wonBids = bidsData.filter(bid => bid.status === 'accepted')
      const totalBidAmount = bidsData.reduce((sum, bid) => sum + bid.amount, 0)
      const totalRevenueAmount = wonBids.reduce((sum, bid) => sum + bid.amount, 0)
      
      // Calculate average response time (in hours)
      const responseTimes = bidsData.map(bid => {
        const bidCreatedAt = new Date(bid.created_at)
        const projectCreatedAt = new Date(bid.projects?.created_at)
        return (bidCreatedAt - projectCreatedAt) / (1000 * 60 * 60) // hours
      }).filter(time => time > 0 && time < 72) // Filter out outliers
      
      const avgResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
        : 0
      
      setStats({
        totalLeads: projectsData.length,
        totalBids: bidsData.length,
        wonBids: wonBids.length,
        totalRevenue: totalRevenueAmount,
        averageBidAmount: bidsData.length > 0 ? totalBidAmount / bidsData.length : 0,
        conversionRate: bidsData.length > 0 ? (wonBids.length / bidsData.length) * 100 : 0,
        responseTime: avgResponseTime
      })
      
      // Group leads by service
      const serviceGroups = {}
      projectsData.forEach(project => {
        const serviceId = project.service_id
        const serviceName = project.services?.name || 'Unknown'
        
        if (!serviceGroups[serviceId]) {
          serviceGroups[serviceId] = {
            id: serviceId,
            name: serviceName,
            count: 0
          }
        }
        
        serviceGroups[serviceId].count++
      })
      
      setLeadsByService(Object.values(serviceGroups).sort((a, b) => b.count - a.count))
      
      // Group leads by month
      const monthGroups = {}
      projectsData.forEach(project => {
        const date = new Date(project.created_at)
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`
        
        if (!monthGroups[monthYear]) {
          monthGroups[monthYear] = {
            month: monthYear,
            count: 0,
            label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          }
        }
        
        monthGroups[monthYear].count++
      })
      
      // Sort by date
      const sortedMonths = Object.values(monthGroups).sort((a, b) => {
        const [aYear, aMonth] = a.month.split('-').map(Number)
        const [bYear, bMonth] = b.month.split('-').map(Number)
        return aYear === bYear ? aMonth - bMonth : aYear - bYear
      })
      
      setLeadsByMonth(sortedMonths)
      
      // Group revenue by month
      const revenueGroups = {}
      wonBids.forEach(bid => {
        const date = new Date(bid.created_at)
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`
        
        if (!revenueGroups[monthYear]) {
          revenueGroups[monthYear] = {
            month: monthYear,
            amount: 0,
            label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          }
        }
        
        revenueGroups[monthYear].amount += bid.amount
      })
      
      // Sort by date
      const sortedRevenue = Object.values(revenueGroups).sort((a, b) => {
        const [aYear, aMonth] = a.month.split('-').map(Number)
        const [bYear, bMonth] = b.month.split('-').map(Number)
        return aYear === bYear ? aMonth - bMonth : aYear - bYear
      })
      
      setRevenueByMonth(sortedRevenue)
      
      // Calculate top services by revenue
      const serviceRevenueGroups = {}
      wonBids.forEach(bid => {
        const project = bid.projects
        if (!project) return
        
        const serviceId = project.service_id
        const serviceName = project.services?.name || 'Unknown'
        
        if (!serviceRevenueGroups[serviceId]) {
          serviceRevenueGroups[serviceId] = {
            id: serviceId,
            name: serviceName,
            revenue: 0,
            count: 0
          }
        }
        
        serviceRevenueGroups[serviceId].revenue += bid.amount
        serviceRevenueGroups[serviceId].count++
      })
      
      setTopServices(Object.values(serviceRevenueGroups).sort((a, b) => b.revenue - a.revenue))
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe)
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your performance and business metrics.
        </p>
      </div>
      
      {/* Timeframe Selector */}
      <div className="mb-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-lg font-medium text-gray-900">Performance Overview</h2>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <div className="inline-flex shadow-sm rounded-md">
              <button
                type="button"
                className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  timeframe === 'week' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'
                } focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
                onClick={() => handleTimeframeChange('week')}
              >
                Week
              </button>
              <button
                type="button"
                className={`relative inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium ${
                  timeframe === 'month' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'
                } focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
                onClick={() => handleTimeframeChange('month')}
              >
                Month
              </button>
              <button
                type="button"
                className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  timeframe === 'year' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'
                } focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
                onClick={() => handleTimeframeChange('year')}
              >
                Year
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Leads</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalLeads}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Bids Submitted</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalBids}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Projects Won</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.wonBids}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${stats.totalRevenue.toLocaleString()}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Average Bid Amount</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${stats.averageBidAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.conversionRate.toFixed(1)}%</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Avg. Response Time</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.responseTime.toFixed(1)} hrs</dd>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6">
        {/* Leads by Month Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Leads by Month</h3>
            <div className="mt-4 h-64">
              {leadsByMonth.length > 0 ? (
                <div className="h-full flex items-end space-x-2">
                  {leadsByMonth.map((item, index) => {
                    const maxCount = Math.max(...leadsByMonth.map(i => i.count))
                    const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                    
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div
                          className="w-full bg-primary-200 rounded-t"
                          style={{ height: `${height}%` }}
                        >
                          <div className="w-full h-full bg-primary-500 rounded-t hover:bg-primary-600 transition-colors duration-200"></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">{item.label}</div>
                        <div className="text-sm font-medium">{item.count}</div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Revenue by Month Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Revenue by Month</h3>
            <div className="mt-4 h-64">
              {revenueByMonth.length > 0 ? (
                <div className="h-full flex items-end space-x-2">
                  {revenueByMonth.map((item, index) => {
                    const maxAmount = Math.max(...revenueByMonth.map(i => i.amount))
                    const height = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0
                    
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div
                          className="w-full bg-green-200 rounded-t"
                          style={{ height: `${height}%` }}
                        >
                          <div className="w-full h-full bg-green-500 rounded-t hover:bg-green-600 transition-colors duration-200"></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">{item.label}</div>
                        <div className="text-sm font-medium">${item.amount.toLocaleString()}</div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tables */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Leads by Service */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Leads by Service</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Distribution of leads across different service categories.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-hidden overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leads
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leadsByService.length > 0 ? (
                    leadsByService.map((service) => {
                      const totalLeads = leadsByService.reduce((sum, s) => sum + s.count, 0)
                      const percentage = totalLeads > 0 ? (service.count / totalLeads) * 100 : 0
                      
                      return (
                        <tr key={service.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {service.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {service.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {percentage.toFixed(1)}%
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Top Services by Revenue */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Top Services by Revenue</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your most profitable service categories.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-hidden overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projects
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topServices.length > 0 ? (
                    topServices.map((service) => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {service.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {service.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          ${service.revenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          ${(service.revenue / service.count).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
