import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', data);
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="divide-y-2 divide-gray-200">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Get in touch
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-0 lg:col-span-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Support</h3>
                <div className="mt-2 text-base text-gray-500">
                  <p>Need help with your account or have questions about our services?</p>
                  <p className="mt-1">
                    <a href="mailto:support@serviceconnectpro.com" className="text-primary-600 hover:text-primary-500">
                      support@serviceconnectpro.com
                    </a>
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Sales</h3>
                <div className="mt-2 text-base text-gray-500">
                  <p>Interested in our premium plans or enterprise solutions?</p>
                  <p className="mt-1">
                    <a href="mailto:sales@serviceconnectpro.com" className="text-primary-600 hover:text-primary-500">
                      sales@serviceconnectpro.com
                    </a>
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Press</h3>
                <div className="mt-2 text-base text-gray-500">
                  <p>For media inquiries or press kit requests.</p>
                  <p className="mt-1">
                    <a href="mailto:press@serviceconnectpro.com" className="text-primary-600 hover:text-primary-500">
                      press@serviceconnectpro.com
                    </a>
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Join Our Team</h3>
                <div className="mt-2 text-base text-gray-500">
                  <p>Looking for career opportunities with us?</p>
                  <p className="mt-1">
                    <a href="mailto:careers@serviceconnectpro.com" className="text-primary-600 hover:text-primary-500">
                      careers@serviceconnectpro.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-16 lg:grid lg:grid-cols-3 lg:gap-8">
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Locations
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-0 lg:col-span-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">San Francisco</h3>
                <div className="mt-2 text-base text-gray-500">
                  <p>123 Market Street</p>
                  <p>Suite 456</p>
                  <p>San Francisco, CA 94103</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">New York</h3>
                <div className="mt-2 text-base text-gray-500">
                  <p>456 Park Avenue</p>
                  <p>Floor 8</p>
                  <p>New York, NY 10022</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Austin</h3>
                <div className="mt-2 text-base text-gray-500">
                  <p>789 Congress Avenue</p>
                  <p>Suite 300</p>
                  <p>Austin, TX 78701</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Toronto</h3>
                <div className="mt-2 text-base text-gray-500">
                  <p>567 King Street West</p>
                  <p>Unit 400</p>
                  <p>Toronto, ON M5V 1M3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact form */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Send us a message
              </h2>
              <div className="mt-3">
                <p className="text-lg text-gray-500">
                  Have a specific question or feedback? Fill out the form and we'll get back to you as soon as possible.
                </p>
              </div>
              <div className="mt-9">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-3 text-base text-gray-500">
                    <p>+1 (555) 123-4567</p>
                    <p className="mt-1">Mon-Fri 8am to 6pm PST</p>
                  </div>
                </div>
                <div className="mt-6 flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3 text-base text-gray-500">
                    <p>contact@serviceconnectpro.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 md:mt-0">
              {submitSuccess ? (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Message sent successfully</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Thank you for contacting us! We'll get back to you as soon as possible.</p>
                      </div>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setSubmitSuccess(false)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Send another message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-y-6">
                  {submitError && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Error</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{submitError}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name"
                        autoComplete="name"
                        className={`py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md ${errors.name ? 'border-red-300' : ''}`}
                        {...register('name', { required: 'Name is required' })}
                      />
                      {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1">
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className={`py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md ${errors.email ? 'border-red-300' : ''}`}
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                      />
                      {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="phone"
                        autoComplete="tel"
                        className="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md"
                        {...register('phone')}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="subject"
                        className={`py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md ${errors.subject ? 'border-red-300' : ''}`}
                        {...register('subject', { required: 'Subject is required' })}
                      />
                      {errors.subject && <p className="mt-2 text-sm text-red-600">{errors.subject.message}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <div className="mt-1">
                      <textarea
                        id="message"
                        rows={4}
                        className={`py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border border-gray-300 rounded-md ${errors.message ? 'border-red-300' : ''}`}
                        {...register('message', { required: 'Message is required' })}
                      ></textarea>
                      {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : 'Submit'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
