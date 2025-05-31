import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Tab } from '@headlessui/react';
import { 
  Cog6ToothIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon, 
  EnvelopeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Settings() {
  const { hasPermission } = useAdmin();
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Home Swerv',
    siteDescription: 'Connect homeowners with trusted service providers',
    contactEmail: 'support@homeswerv.com',
    supportPhone: '(555) 123-4567',
    maintenanceMode: false
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    adminAlerts: true
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiration: 90,
    sessionTimeout: 30,
    ipRestriction: false
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    platformFee: 5,
    paymentGateway: 'stripe',
    autoPayouts: true,
    payoutSchedule: 'weekly'
  });

  const handleGeneralSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleNotificationSettingsChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };
  
  const handleSecuritySettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handlePaymentSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentSettings({
      ...paymentSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const tabs = [
    { name: 'General', icon: Cog6ToothIcon },
    { name: 'Notifications', icon: BellIcon },
    { name: 'Security', icon: ShieldCheckIcon },
    { name: 'Payments', icon: CurrencyDollarIcon },
    { name: 'Email Templates', icon: EnvelopeIcon },
    { name: 'Legal', icon: DocumentTextIcon }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure platform settings and preferences
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <Tab.Group>
          <Tab.List className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'py-4 px-4 text-sm font-medium text-center focus:outline-none',
                    selected
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )
                }
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="h-5 w-5" aria-hidden="true" />
                  <span>{tab.name}</span>
                </div>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="p-6">
            <Tab.Panel>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">General Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Basic configuration for your platform
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                      Site Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="siteName"
                        id="siteName"
                        value={generalSettings.siteName}
                        onChange={handleGeneralSettingsChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                      Contact Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="contactEmail"
                        id="contactEmail"
                        value={generalSettings.contactEmail}
                        onChange={handleGeneralSettingsChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="supportPhone" className="block text-sm font-medium text-gray-700">
                      Support Phone
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="supportPhone"
                        id="supportPhone"
                        value={generalSettings.supportPhone}
                        onChange={handleGeneralSettingsChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                      Site Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="siteDescription"
                        name="siteDescription"
                        rows={3}
                        value={generalSettings.siteDescription}
                        onChange={handleGeneralSettingsChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="maintenanceMode"
                          name="maintenanceMode"
                          type="checkbox"
                          checked={generalSettings.maintenanceMode}
                          onChange={handleGeneralSettingsChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="maintenanceMode" className="font-medium text-gray-700">
                          Maintenance Mode
                        </label>
                        <p className="text-gray-500">Enable to temporarily disable the site for maintenance.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="ml-3 inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Tab.Panel>
            
            <Tab.Panel>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Configure how and when notifications are sent
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="emailNotifications"
                        name="emailNotifications"
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationSettingsChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <p className="text-gray-500">Receive notifications via email.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="smsNotifications"
                        name="smsNotifications"
                        type="checkbox"
                        checked={notificationSettings.smsNotifications}
                        onChange={handleNotificationSettingsChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="smsNotifications" className="font-medium text-gray-700">
                        SMS Notifications
                      </label>
                      <p className="text-gray-500">Receive notifications via SMS.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="marketingEmails"
                        name="marketingEmails"
                        type="checkbox"
                        checked={notificationSettings.marketingEmails}
                        onChange={handleNotificationSettingsChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="marketingEmails" className="font-medium text-gray-700">
                        Marketing Emails
                      </label>
                      <p className="text-gray-500">Receive marketing and promotional emails.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="adminAlerts"
                        name="adminAlerts"
                        type="checkbox"
                        checked={notificationSettings.adminAlerts}
                        onChange={handleNotificationSettingsChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="adminAlerts" className="font-medium text-gray-700">
                        Admin Alerts
                      </label>
                      <p className="text-gray-500">Receive critical system alerts and notifications.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="ml-3 inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Tab.Panel>
            
            <Tab.Panel>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Security Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Configure security options for your platform
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="passwordExpiration" className="block text-sm font-medium text-gray-700">
                      Password Expiration (days)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="passwordExpiration"
                        id="passwordExpiration"
                        value={securitySettings.passwordExpiration}
                        onChange={handleSecuritySettingsChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                      Session Timeout (minutes)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="sessionTimeout"
                        id="sessionTimeout"
                        value={securitySettings.sessionTimeout}
                        onChange={handleSecuritySettingsChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="twoFactorAuth"
                          name="twoFactorAuth"
                          type="checkbox"
                          checked={securitySettings.twoFactorAuth}
                          onChange={handleSecuritySettingsChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="twoFactorAuth" className="font-medium text-gray-700">
                          Two-Factor Authentication
                        </label>
                        <p className="text-gray-500">Require two-factor authentication for admin users.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="ipRestriction"
                          name="ipRestriction"
                          type="checkbox"
                          checked={securitySettings.ipRestriction}
                          onChange={handleSecuritySettingsChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="ipRestriction" className="font-medium text-gray-700">
                          IP Restriction
                        </label>
                        <p className="text-gray-500">Restrict admin access to specific IP addresses.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="ml-3 inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Tab.Panel>
            
            <Tab.Panel>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Configure payment processing and payout options
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="platformFee" className="block text-sm font-medium text-gray-700">
                      Platform Fee (%)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="platformFee"
                        id="platformFee"
                        value={paymentSettings.platformFee}
                        onChange={handlePaymentSettingsChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="paymentGateway" className="block text-sm font-medium text-gray-700">
                      Payment Gateway
                    </label>
                    <div className="mt-1">
                      <select
                        id="paymentGateway"
                        name="paymentGateway"
                        value={paymentSettings.paymentGateway}
                        onChange={handlePaymentSettingsChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                        <option value="square">Square</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="payoutSchedule" className="block text-sm font-medium text-gray-700">
                      Payout Schedule
                    </label>
                    <div className="mt-1">
                      <select
                        id="payoutSchedule"
                        name="payoutSchedule"
                        value={paymentSettings.payoutSchedule}
                        onChange={handlePaymentSettingsChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="autoPayouts"
                          name="autoPayouts"
                          type="checkbox"
                          checked={paymentSettings.autoPayouts}
                          onChange={handlePaymentSettingsChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="autoPayouts" className="font-medium text-gray-700">
                          Automatic Payouts
                        </label>
                        <p className="text-gray-500">Process payouts automatically according to schedule.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="ml-3 inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Tab.Panel>
            
            <Tab.Panel>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Email Templates</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage email templates used throughout the platform
                  </p>
                </div>
                
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Template Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Subject
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Last Updated
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {[
                        { id: 1, name: 'Welcome Email', subject: 'Welcome to Home Swerv!', updated: '2023-09-15' },
                        { id: 2, name: 'Password Reset', subject: 'Reset Your Password', updated: '2023-08-22' },
                        { id: 3, name: 'Project Created', subject: 'Your Project Has Been Created', updated: '2023-10-01' },
                        { id: 4, name: 'Provider Match', subject: 'We Found Providers For Your Project', updated: '2023-09-28' },
                        { id: 5, name: 'Payment Confirmation', subject: 'Payment Confirmation', updated: '2023-09-10' },
                      ].map((template) => (
                        <tr key={template.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {template.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{template.subject}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{template.updated}</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              type="button"
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Tab.Panel>
            
            <Tab.Panel>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Legal Documents</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage legal documents and policies
                  </p>
                </div>
                
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Document Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Last Updated
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {[
                        { id: 1, name: 'Terms of Service', updated: '2023-08-15', status: 'Published' },
                        { id: 2, name: 'Privacy Policy', updated: '2023-08-15', status: 'Published' },
                        { id: 3, name: 'Cookie Policy', updated: '2023-07-22', status: 'Published' },
                        { id: 4, name: 'Refund Policy', updated: '2023-09-05', status: 'Published' },
                        { id: 5, name: 'User Agreement', updated: '2023-10-10', status: 'Draft' },
                      ].map((document) => (
                        <tr key={document.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {document.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{document.updated}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              document.status === 'Published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {document.status}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              type="button"
                              className="text-primary-600 hover:text-primary-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Preview
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
