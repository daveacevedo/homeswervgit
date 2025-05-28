import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Email is required')
});

function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess(false);
      
      const { error: resetError } = await resetPassword(data.email);
      
      if (resetError) {
        throw new Error(resetError.message);
      }
      
      setSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Reset your password</h2>
      <p className="mt-2 text-sm text-gray-600">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      {error && (
        <div className="p-3 mt-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 mt-4 text-sm text-green-700 bg-green-100 rounded-md">
          Password reset email sent! Check your inbox for further instructions.
        </div>
      )}
      
      <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={`block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading || success}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send reset link'}
          </button>
        </div>
        
        <div className="text-center">
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
