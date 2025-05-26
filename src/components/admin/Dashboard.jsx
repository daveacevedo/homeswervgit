import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../contexts/AdminContext';
import { 
  UserGroupIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon,
  PuzzlePieceIcon,
  KeyIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { hasPermission } = useAdmin();
  const [stats, setStats] = useState({
    adminUsers: 0,
    pendingVerifications: 0,
    contentPages: 0,
    integrations: 0,
    apiKeys: 0
  });
  const [recentAuditLogs, setRecentAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Fetch stats
        const [
          { count: adminUsersCount },
          { count: pendingVerificationsCount },
          { count: contentPagesCount },
          { count: integrationsCount },
          { count: apiKeysCount },
          { data: auditLogs }
        ] = await Promise.all([
          // Admin users count
          supabase
            .from('admin_users')
            .select('*', { count: 'exact', head: true }),
          
          // Pending verifications count
          supabase
            .from('provider_verifications')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending'),
          
          // Content pages count
          supabase
            .from('content_pages')
            .select('*', { count: 'exact', head: true }),
          
          // Integrations count
          supabase
            .from('integration_configs')
            .select('*', { count: 'exact', head: true }),
          
          // API keys count
          supabase
            .from('api_keys')
            .select('*', { count: 'exact', head: true }),
          
          // Recent audit logs
          supabase
            .from('audit_logs')
            .select('*, auth_users:user_id(email)')
            .order('created_at', { ascending: false })
            .limit(5)
        ]);
        
        setStats({
          adminUsers: adminUsersCount || 0,
          pendingVerifications: pendingVerificationsCount || 0,
          contentPages: contentPagesCount || 0,
          integrations: integrationsCount || 0,
          apiKeys: apiKeysCount || 0
        });
        
        setRecentAuditLogs(auditLogs || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  const cards = [
    {
      name: 'Admin Users',
      href: '/admin/users',
      icon: UserGroupIcon,
      value: stats.adminUsers,
      show: hasPermission('access_management', 'view_users')
    },
    {
      name: 'Pending Verifications',
      href: '/admin/verifications',
      icon: ShieldCheckIcon,
      value: stats.pendingVerifications,
      show: hasPermission('provider_management', 'manage_verifications')
    },
    {
      name: 'Content Pages',
      href: '/admin/content',
      icon: DocumentTextIcon,
      value: stats.contentPages,
      show: hasPermission('content_management', 'view_pages')
    },
    {
      name: 'Integrations',
      href: '/admin/integrations',
      icon: PuzzlePieceIcon,
      value: stats.integrations,
      show: hasPermission('integrations', 'view_integrations')
    },
    {
      name: 'API Keys',
      href: '/admin/api-keys',
      icon: KeyIcon,
      value: stats.apiKeys,
      show: hasPermission('api_management', 'view_keys')
    }
  ].filter(card => card.show);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your system and recent activity
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
            {cards.map((card) => (
              <Link
                key={card.name}
                to={card.href}
                className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:pt-6 hover:shadow-md transition-shadow duration-200"
              >
                <dt>
                  <div className="absolute rounded-md bg-primary-500 p-3">
                    <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">{card.name}</p>
                </dt>
                <dd className="ml-16 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </dd>
              </Link>
            ))}
          </div>
          
          {hasPermission('access_management', 'view_audit_logs') && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
              <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                  {recentAuditLogs.length > 0 ? (
                    recentAuditLogs.map((log) => (
                      <li key={log.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <p className="truncate text-sm font-medium text-primary-600">
                                {log.action.charAt(0).toUpperCase() + log.action.slice(1)} {log.entity_type.replace(/_/g, ' ')}
                              </p>
                            </div>
                            <div className="ml-2 flex flex-shrink-0">
                              <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                {new Date(log.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                {log.auth_users?.email || 'Unknown user'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-5 sm:px-6 text-center text-sm text-gray-500">
                      No recent activity found
                    </li>
                  )}
                </ul>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <Link
                    to="/admin/audit-logs"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    View all activity
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
