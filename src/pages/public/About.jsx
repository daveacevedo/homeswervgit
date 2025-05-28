import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                ServiceConnectPro
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-10">
              <Link to="/about" className="text-base font-medium text-blue-600 hover:text-blue-900">
                About
              </Link>
              <Link to="/pricing" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Pricing
              </Link>
              <Link to="/contact" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </nav>
            
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <Link to="/login" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                Sign in
              </Link>
              <Link
                to="/register"
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative py-16 bg-white overflow-hidden">
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
          <div className="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
            <svg
              className="absolute top-12 left-full transform translate-x-32"
              width="404"
              height="384"
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="384" fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
            </svg>
            <svg
              className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
              width="404"
              height="384"
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="384" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
            </svg>
          </div>
        </div>
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto">
            <h1>
              <span className="block text-base text-center text-blue-600 font-semibold tracking-wide uppercase">
                About Us
              </span>
              <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Our Mission and Story
              </span>
            </h1>
            <p className="mt-8 text-xl text-gray-500 leading-8">
              ServiceConnectPro was founded with a simple mission: to transform the way homeowners and service providers connect, communicate, and collaborate on home renovation and maintenance projects.
            </p>
          </div>
          <div className="mt-6 prose prose-blue prose-lg text-gray-500 mx-auto">
            <h2>Our Beginning</h2>
            <p>
              After experiencing the frustration of managing multiple home renovation projects, our founders recognized a significant gap in the market. Finding reliable contractors, communicating project requirements, tracking progress, and managing payments were all disconnected processes that created unnecessary stress and inefficiency.
            </p>
            <p>
              In 2020, we set out to build a platform that would address these pain points and create a seamless experience for both homeowners and service providers.
            </p>
            
            <div className="my-12 relative">
              <img
                className="w-full rounded-lg shadow-lg object-cover h-96"
                src="https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Team meeting"
              />
            </div>
            
            <h2>Our Values</h2>
            <ul>
              <li>
                <strong>Trust and Transparency:</strong> We believe in fostering trust between homeowners and service providers through verified reviews, clear pricing, and transparent communication.
              </li>
              <li>
                <strong>Quality and Excellence:</strong> We are committed to connecting homeowners with skilled professionals who deliver high-quality work and exceptional service.
              </li>
              <li>
                <strong>Innovation:</strong> We continuously improve our platform with new features and tools that make home project management more efficient and enjoyable.
              </li>
              <li>
                <strong>Community:</strong> We're building a community where homeowners can share ideas, find inspiration, and connect with professionals who share their vision.
              </li>
            </ul>
            
            <h2>How We're Different</h2>
            <p>
              Unlike traditional contractor directories or basic project management tools, ServiceConnectPro offers an end-to-end solution that covers every aspect of home renovation and maintenance:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-blue-700 font-semibold">For Homeowners</h3>
                <ul className="mt-2 space-y-2">
                  <li>Find verified, reviewed service providers</li>
                  <li>Create detailed project plans with visual inspiration boards</li>
                  <li>Get multiple quotes and compare options</li>
                  <li>Schedule appointments and track project progress</li>
                  <li>Communicate directly with providers</li>
                  <li>Manage payments securely</li>
                  <li>Store project documentation and warranties</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-blue-700 font-semibold">For Service Providers</h3>
                <ul className="mt-2 space-y-2">
                  <li>Connect with homeowners actively seeking services</li>
                  <li>Showcase your portfolio and expertise</li>
                  <li>Manage leads and client communications</li>
                  <li>Create professional quotes and invoices</li>
                  <li>Schedule jobs and coordinate with clients</li>
                  <li>Build your reputation through verified reviews</li>
                  <li>Grow your business with our marketing tools</li>
                </ul>
              </div>
            </div>
            
            <h2>Our Team</h2>
            <p>
              Our diverse team brings together expertise in technology, design, construction, and customer service. We're passionate about creating innovative solutions that make home improvement more accessible and enjoyable for everyone.
            </p>
            
            <div className="my-12 relative">
              <img
                className="w-full rounded-lg shadow-lg object-cover h-96"
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Our team"
              />
            </div>
            
            <h2>Join Our Community</h2>
            <p>
              Whether you're a homeowner planning your next renovation project or a service provider looking to grow your business, we invite you to join the ServiceConnectPro community. Together, we're transforming the home improvement industry and creating better experiences for everyone involved.
            </p>
            
            <div className="mt-10 flex justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Join ServiceConnectPro Today
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                About
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/pricing" className="text-base text-gray-500 hover:text-gray-900">
                Pricing
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                Terms
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                Privacy
              </Link>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2023 ServiceConnectPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
