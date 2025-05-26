import { Link } from 'react-router-dom'

function StatCard({ title, value, icon, linkTo, linkText, subtext, color = 'primary' }) {
  const colorClasses = {
    primary: 'text-primary-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    indigo: 'text-indigo-600',
    orange: 'text-orange-600',
  }
  
  const iconColorClass = colorClasses[color] || colorClasses.primary
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className={`h-6 w-6 ${iconColorClass}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {subtext && (
                <div className="ml-2 text-sm text-gray-500">{subtext}</div>
              )}
            </dd>
          </div>
        </div>
      </div>
      {linkTo && linkText && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link to={linkTo} className="font-medium text-primary-600 hover:text-primary-500">
              {linkText} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatCard
