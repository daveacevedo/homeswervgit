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
              <Link to="/" className="text-xl font-bold text-blue-600">
                ServiceConnectPro
              </Link>
            </div>
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
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width={404} height={384} fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
            </svg>
            <svg
              className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width={404} height={384} fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
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
              ServiceConnectPro was founded with a simple mission: to transform how homeowners find and work with service professionals, making home improvement and maintenance easier, more transparent, and more reliable.
            </p>
          </div>
          <div className="mt-6 prose prose-blue prose-lg text-gray-500 mx-auto">
            <h2>Our Beginning</h2>
            <p>
              The idea for ServiceConnectPro was born out of frustration. Our founders, experienced homeowners and service providers themselves, recognized the challenges that existed on both sides of the home service industry:
            </p>
            <ul>
              <li>Homeowners struggled to find reliable, qualified professionals</li>
              <li>Service providers faced challenges in finding new clients and managing their businesses</li>
              <li>Both sides dealt with communication issues, scheduling conflicts, and payment complications</li>
            </ul>
            <p>
              In 2023, we set out to build a platform that would address these pain points and create a better experience for everyone involved.
            </p>
            
            <h2>What We Believe</h2>
            <p>
              At ServiceConnectPro, we believe that home improvement and maintenance shouldn't be stressful. We're guided by a few core principles:
            </p>
            <ul>
              <li><strong>Trust and transparency</strong> are essential in the home service industry</li>
              <li><strong>Technology</strong> can simplify and improve the experience for both homeowners and service providers</li>
              <li><strong>Quality work</strong> deserves recognition and fair compensation</li>
              <li><strong>Communication</strong> is the foundation of successful projects</li>
            </ul>
            
            <figure>
              <img
                className="w-full rounded-lg"
                src="https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Team meeting"
                width={1310}
                height={873}
              />
              <figcaption>Our team working to improve the platform</figcaption>
            </figure>
            
            <h2>How We're Different</h2>
            <p>
              Unlike other platforms, ServiceConnectPro focuses on building lasting relationships between homeowners and service providers. We're not just about one-time transactions—we're about creating a community where:
            </p>
            <ul>
              <li>Homeowners can find trusted professionals for all their home service needs</li>
              <li>Service providers can build their reputation and grow their business</li>
              <li>Both sides benefit from streamlined communication, scheduling, and payment processes</li>
            </ul>
            
            <h2>Our Team</h2>
            <p>
              ServiceConnectPro is built by a diverse team of professionals with backgrounds in technology, home services, customer experience, and business development. We're united by our passion for solving real problems and creating value for our users.
            </p>
            
            <h2>Join Us</h2>
            <p>
              Whether you're a homeowner looking for reliable service professionals or a provider looking to grow your business, we invite you to join the ServiceConnectPro community. Together, we can transform the home service industry.
            </p>
            
            <div className="mt-10">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <h2 className="text-xl font-bold text-white">ServiceConnectPro</h2>
              <p className="text-gray-300 text-base">
                Connecting homeowners with trusted service professionals since 2023.
              </p>
              <div className="flex space-x-6">
                {/* Social media links would go here */}
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        For Homeowners
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        For Service Providers
                      </Link>
                    </li>
                    <li>
                      <Link to="/pricing" className="text-base text-gray-300 hover:text-white">
                        Pricing
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        Help Center
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="text-base text-gray-300 hover:text-white">
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        FAQ
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link to="/about" className="text-base text-gray-300 hover:text-white">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        Careers
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-base text-gray-300 hover:text-white">
                        Terms
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2023 ServiceConnectPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
