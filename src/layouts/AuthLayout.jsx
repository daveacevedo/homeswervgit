import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600">
        <div className="flex flex-col justify-center w-full max-w-md p-12 mx-auto text-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">ServiceConnectPro</h1>
            <p className="mt-2 text-xl">Connecting homeowners with trusted service providers</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Find Qualified Professionals</h3>
                <p className="mt-1 text-blue-200">Browse through verified service providers in your area.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Schedule with Ease</h3>
                <p className="mt-1 text-blue-200">Book appointments and manage your projects in one place.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Secure Payments</h3>
                <p className="mt-1 text-blue-200">Pay securely through our platform with payment protection.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Auth forms */}
      <div className="flex flex-col justify-center w-full lg:w-1/2">
        <div className="w-full max-w-md p-8 mx-auto">
          <div className="mb-6 text-center lg:hidden">
            <h1 className="text-3xl font-bold text-blue-600">ServiceConnectPro</h1>
            <p className="mt-2 text-gray-600">Connecting homeowners with trusted service providers</p>
          </div>
          
          <Outlet />
          
          <div className="mt-8 text-center text-sm text-gray-600">
            <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
              Return to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
