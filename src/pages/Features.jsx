import React from 'react';

const Features = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Features</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Everything you need for your home
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Discover all the features that make Home Swerv the perfect platform for homeowners and service providers.
          </p>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">For Homeowners</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Property Management</h4>
                <p className="text-gray-600">
                  Keep track of all your properties in one place. Store important documents, maintenance records, and more.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Project Planning</h4>
                <p className="text-gray-600">
                  Plan and track your home improvement projects. Set budgets, timelines, and assign tasks.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Vision Board</h4>
                <p className="text-gray-600">
                  Create vision boards for your dream home. Collect inspiration and turn ideas into real projects.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Provider Directory</h4>
                <p className="text-gray-600">
                  Find trusted service providers in your area. Read reviews and connect directly.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Secure Payments</h4>
                <p className="text-gray-600">
                  Pay for services securely through our platform. Track expenses and manage your budget.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Maintenance Reminders</h4>
                <p className="text-gray-600">
                  Set up reminders for regular home maintenance tasks. Never miss an important service date.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">For Service Providers</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Business Profile</h4>
                <p className="text-gray-600">
                  Create a professional profile to showcase your services, experience, and customer reviews.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Job Management</h4>
                <p className="text-gray-600">
                  Manage all your jobs in one place. Track progress, communicate with clients, and send invoices.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Lead Generation</h4>
                <p className="text-gray-600">
                  Get matched with homeowners looking for your services. Receive notifications for new job opportunities.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Scheduling</h4>
                <p className="text-gray-600">
                  Manage your availability and appointments. Sync with your calendar to avoid double-booking.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Secure Payments</h4>
                <p className="text-gray-600">
                  Receive payments securely through our platform. Track earnings and manage your finances.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Reviews & Ratings</h4>
                <p className="text-gray-600">
                  Build your reputation with verified customer reviews. Showcase your quality work to attract more clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
