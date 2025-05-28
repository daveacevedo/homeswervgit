import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-blue-600">ServiceConnectPro</h1>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
        
        <div className="mt-6 text-center">
          <div className="space-x-4">
            <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Home
            </Link>
            <Link to="/about" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
