import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const Testimonials = () => {
  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Homeowner',
      location: 'Portland, OR',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      content: 'Home Swerv has completely transformed how I manage my home renovation projects. The project management tools and verified provider network saved me countless hours and headaches. I was able to find a reliable contractor for my kitchen remodel within days!',
      rating: 5,
      project: 'Kitchen Remodel',
      date: 'March 15, 2023'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'General Contractor',
      location: 'Miami, FL',
      image: 'https://images.pexels.com/photos/8961256/pexels-photo-8961256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      content: 'Since joining Home Swerv, my business has grown by 40%. The platform makes it easy to find new clients, manage jobs, and get paid on time. The scheduling and client communication tools have streamlined my operations and helped me take on more projects.',
      rating: 5,
      project: 'Multiple Residential Projects',
      date: 'January 8, 2023'
    },
    {
      id: 3,
      name: 'Jennifer Lee',
      role: 'Homeowner',
      location: 'Chicago, IL',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      content: 'I was skeptical at first, but Home Swerv exceeded all my expectations. The budget estimation tool was surprisingly accurate, and the rewards program actually saved me money on my bathroom renovation. The ability to communicate directly with service providers through the app made the whole process so much smoother.',
      rating: 4,
      project: 'Bathroom Renovation',
      date: 'April 22, 2023'
    },
    {
      id: 4,
      name: 'David Wilson',
      role: 'Plumbing Specialist',
      location: 'Austin, TX',
      image: 'https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      content: "As a specialized service provider, Home Swerv has helped me connect with clients who specifically need my expertise. The platform's verification process gives homeowners confidence in my services, and the job management tools keep everything organized. My calendar is now consistently full with quality jobs.",
      rating: 5,
      project: 'Various Plumbing Services',
      date: 'February 10, 2023'
    },
    {
      id: 5,
      name: 'Emily Parker',
      role: 'Homeowner',
      location: 'Seattle, WA',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      content: 'Home Swerv made my first-time home renovation experience much less intimidating. The platform guided me through the process step by step, from planning to completion. I appreciated the transparency in provider ratings and the detailed project tracking features.',
      rating: 4,
      project: 'Living Room Redesign',
      date: 'May 5, 2023'
    },
    {
      id: 6,
      name: 'Robert Chen',
      role: 'Interior Designer',
      location: 'San Francisco, CA',
      image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      content: 'Home Swerv has become an essential part of my interior design business. The platform helps me showcase my portfolio to potential clients and collaborate effectively with homeowners and other contractors. The integrated messaging and file sharing capabilities have streamlined my workflow significantly.',
      rating: 5,
      project: 'Multiple Design Projects',
      date: 'June 18, 2023'
    }
  ];

  // Function to render star ratings
  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i}>
            {i < rating ? (
              <StarIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarOutlineIcon className="h-5 w-5 text-yellow-400" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Customer Success Stories
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
            Discover how Home Swerv is transforming home improvement projects for homeowners and service providers across the country.
          </p>
        </div>
      </div>

      {/* Featured testimonials */}
      <div className="bg-white py-16 sm:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Hear from our satisfied users
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Real stories from real people who have transformed their home improvement experience with Home Swerv.
            </p>
          </div>
          
          {/* Grid of testimonials */}
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={testimonial.image}
                        alt={testimonial.name}
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                      <div className="text-sm text-gray-500">
                        {testimonial.role} • {testimonial.location}
                      </div>
                      <div className="mt-1">
                        {renderRating(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600 italic">"{testimonial.content}"</p>
                  </div>
                  <div className="mt-6 flex items-center text-sm text-gray-500">
                    <div className="flex-1">
                      <span className="font-medium text-blue-600">Project:</span> {testimonial.project}
                    </div>
                    <div>
                      {testimonial.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics section */}
      <div className="bg-blue-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trusted by thousands nationwide
            </h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              Home Swerv is making a real difference in how people approach home improvement projects.
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                Satisfied Homeowners
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-blue-600">15,000+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                Service Providers
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-blue-600">3,500+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                Projects Completed
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-blue-600">25,000+</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="bg-blue-700 rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Ready to transform your</span>
                  <span className="block">home improvement experience?</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-blue-100">
                  Join thousands of satisfied users who have simplified their home projects with Home Swerv. Sign up today and experience the difference.
                </p>
                <div className="mt-8 flex space-x-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                  >
                    Sign up for free
                  </Link>
                  <Link
                    to="/features/homeowners"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
            <div className="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
              <img
                className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
                src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="App screenshot"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
