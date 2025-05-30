import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  UserGroupIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';

const Features = () => {
  const features = [
    {
      name: 'For Homeowners',
      description: 'Simplify your home improvement projects with our homeowner tools and services.',
      icon: HomeIcon,
      link: '/features/homeowners',
      color: 'bg-blue-500',
    },
    {
      name: 'For Service Providers',
      description: 'Grow your business with our platform designed for home service professionals.',
      icon: WrenchScrewdriverIcon,
      link: '/features/providers',
      color: 'bg-green-500',
    },
    {
      name: 'Community',
      description: 'Connect with homeowners and service providers in your local community.',
      icon: UserGroupIcon,
      link: '/features/community',
      color: 'bg-purple-500',
    },
    {
      name: 'Trust & Safety',
      description: 'Our verification process ensures you work with trusted professionals.',
      icon: ShieldCheckIcon,
      link: '/features/safety',
      color: 'bg-red-500',
    },
    {
      name: 'Pricing',
      description: 'Transparent pricing with no hidden fees for all our services.',
      icon: CurrencyDollarIcon,
      link: '/pricing',
      color: 'bg-yellow-500',
    },
    {
      name: 'Support',
      description: '24/7 customer support to help you with any questions or issues.',
      icon: ChatBubbleLeftRightIcon,
      link: '/contact',
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Features</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Discover how Home Swerv can help you with your home improvement projects and service business.
            </p>
          </div>

          {/* Features grid */}
          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-shrink-0">
                  <div className={`h-48 w-full ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="h-24 w-24 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <Link to={feature.link} className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900">{feature.name}</p>
                      <p className="mt-3 text-base text-gray-500">{feature.description}</p>
                    </Link>
                  </div>
                  <div className="mt-6">
                    <Link
                      to={feature.link}
                      className="text-base font-semibold text-blue-600 hover:text-blue-500"
                    >
                      Learn more →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials section */}
      <div className="bg-white py-16 lg:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="text-center">
              <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
                What our users are saying
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                Hear from homeowners and service providers who use Home Swerv.
              </p>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {/* Testimonial 1 */}
              <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full"
                        src="https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="Testimonial"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Sarah Johnson</h3>
                      <p className="text-base font-medium text-blue-600">Homeowner</p>
                    </div>
                  </div>
                  <div className="mt-4 text-base text-gray-500">
                    <p>
                      "Home Swerv made it so easy to find reliable contractors for my kitchen renovation. 
                      The project management tools helped me stay on budget and on schedule."
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full"
                        src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="Testimonial"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Mike Rodriguez</h3>
                      <p className="text-base font-medium text-green-600">Service Provider</p>
                    </div>
                  </div>
                  <div className="mt-4 text-base text-gray-500">
                    <p>
                      "Since joining Home Swerv, my plumbing business has grown by 40%. The platform 
                      connects me with serious clients and handles all the scheduling and payments."
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/features/testimonials"
                className="text-base font-medium text-blue-600 hover:text-blue-500"
              >
                View all testimonials →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Sign up for free today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Join thousands of homeowners and service providers already using Home Swerv.
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
};

export default Features;
