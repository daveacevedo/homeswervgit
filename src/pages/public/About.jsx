import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">About</span>
                  <span className="block text-blue-600">Our Platform</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  We're on a mission to transform how homeowners find and hire service providers, making home improvement projects simpler and more reliable.
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Mission section */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div>
              <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wide">Our Mission</h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                Connecting quality with convenience
              </p>
              <p className="mt-3 text-lg text-gray-500">
                Our platform was founded with a simple idea: make it easier for homeowners to find reliable service providers while helping skilled professionals grow their businesses. We believe that home improvement should be a positive experience for everyone involved.
              </p>
              <div className="mt-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Quality Assurance</h3>
                    <p className="mt-2 text-base text-gray-500">
                      We verify all service providers on our platform to ensure they meet our high standards of quality and professionalism.
                    </p>
                  </div>
                </div>
                <div className="flex mt-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Time Efficiency</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Our matching system saves time for both homeowners and service providers by connecting the right people quickly.
                    </p>
                  </div>
                </div>
                <div className="flex mt-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Fair Pricing</h3>
                    <p className="mt-2 text-base text-gray-500">
                      We promote transparent pricing and fair business practices to create a marketplace that works for everyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 relative text-base max-w-prose mx-auto lg:mt-0">
              <div className="aspect-w-12 aspect-h-7 lg:aspect-none">
                <img
                  className="rounded-lg shadow-lg object-cover object-center"
                  src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Team meeting"
                  width={1184}
                  height={1376}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wide">Our Team</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Meet the people behind our platform
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Our diverse team brings together expertise in technology, home improvement, and customer service.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <img
                  className="h-40 w-40 rounded-full mx-auto"
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Team member"
                />
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium text-gray-900">David Chen</h3>
                  <p className="text-sm text-gray-500">CEO & Co-Founder</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Former contractor with 15 years of experience in the home service industry.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <img
                  className="h-40 w-40 rounded-full mx-auto"
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Team member"
                />
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium text-gray-900">Emily Rodriguez</h3>
                  <p className="text-sm text-gray-500">CTO & Co-Founder</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Tech innovator with a passion for creating user-friendly digital experiences.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <img
                  className="h-40 w-40 rounded-full mx-auto"
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Team member"
                />
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium text-gray-900">Marcus Johnson</h3>
                  <p className="text-sm text-gray-500">Head of Provider Relations</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Dedicated to helping service providers succeed and grow their businesses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wide">Our Values</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              What drives us
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              These core principles guide everything we do.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto">
                <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Trust</h3>
              <p className="mt-2 text-base text-gray-500">
                We build trust through transparency, reliability, and consistent quality.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto">
                <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Innovation</h3>
              <p className="mt-2 text-base text-gray-500">
                We constantly seek better ways to connect homeowners and service providers.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto">
                <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Community</h3>
              <p className="mt-2 text-base text-gray-500">
                We foster a supportive community of homeowners and service providers.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto">
                <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Excellence</h3>
              <p className="mt-2 text-base text-gray-500">
                We strive for excellence in every aspect of our service and platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to transform your home service experience?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Join thousands of homeowners and service providers who are already benefiting from our platform.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;
