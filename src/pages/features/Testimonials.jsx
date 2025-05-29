import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { StarIcon } from '@heroicons/react/24/solid';

const Testimonials = () => {
  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      content: "Home Swerv has completely transformed how I manage my home renovation projects. The project management tools and verified provider network saved me countless hours and headaches.",
      author: "Sarah Johnson",
      role: "Homeowner",
      location: "Portland, OR",
      image: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5,
      project: "Kitchen Renovation"
    },
    {
      id: 2,
      content: "Since joining Home Swerv, my business has grown by 40%. The platform makes it easy to find new clients, manage jobs, and get paid on time. It's been a game-changer for my contracting business.",
      author: "Michael Rodriguez",
      role: "General Contractor",
      location: "Miami, FL",
      image: "https://images.pexels.com/photos/8961256/pexels-photo-8961256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5,
      project: "Multiple Projects"
    },
    {
      id: 3,
      content: "I was skeptical at first, but Home Swerv exceeded all my expectations. The vision board feature helped me communicate my ideas clearly to contractors, and the project management tools kept everything on track.",
      author: "Emily Chen",
      role: "Homeowner",
      location: "Chicago, IL",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5,
      project: "Bathroom Remodel"
    },
    {
      id: 4,
      content: "As a small plumbing business, Home Swerv has been instrumental in helping us grow. The scheduling and client management features save us time, and the platform brings us quality leads consistently.",
      author: "David Wilson",
      role: "Plumbing Contractor",
      location: "Austin, TX",
      image: "https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 4,
      project: "Various Plumbing Services"
    },
    {
      id: 5,
      content: "The rewards program is amazing! I earned enough points from my kitchen renovation to get a significant discount on my bathroom remodel. It's like getting paid to improve your home.",
      author: "Jennifer Martinez",
      role: "Homeowner",
      location: "Denver, CO",
      image: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5,
      project: "Multiple Renovations"
    },
    {
      id: 6,
      content: "The budget estimation tool was spot on for my living room renovation. It helped me plan my finances accurately and avoid surprises. The whole process was smooth from start to finish.",
      author: "Robert Thompson",
      role: "Homeowner",
      location: "Seattle, WA",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5,
      project: "Living Room Renovation"
    },
    {
      id: 7,
      content: "As an interior designer, I love how Home Swerv helps me collaborate with clients and contractors in one platform. The vision board feature is particularly useful for sharing design concepts.",
      author: "Sophia Lee",
      role: "Interior Designer",
      location: "New York, NY",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5,
      project: "Various Design Projects"
    },
    {
      id: 8,
      content: "The community challenges are a fun way to get motivated for home improvements. I participated in the 'Spring Refresh' challenge and won bonus points while updating my home office.",
      author: "James Anderson",
      role: "Homeowner",
      location: "Atlanta, GA",
      image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 4,
      project: "Home Office Renovation"
    }
  ];

  // Function to render star ratings
  const renderStars = (rating) => {
    return Array(5).fill().map((_, i) => (
      <StarIcon 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        aria-hidden="true" 
      />
    ));
  };

  return (
    <div className="bg-white">
      <Navbar />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Testimonials</h1>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            What our users are saying
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Discover how Home Swerv is helping homeowners and service providers across the country
          </p>
        </div>
      </div>

      {/* Featured testimonial */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative lg:flex lg:items-center">
            <div className="hidden lg:block lg:flex-shrink-0">
              <img
                className="h-64 w-64 rounded-full xl:h-80 xl:w-80 object-cover"
                src={testimonials[0].image}
                alt={testimonials[0].author}
              />
            </div>

            <div className="relative lg:ml-10">
              <svg
                className="absolute top-0 left-0 transform -translate-x-8 -translate-y-24 h-36 w-36 text-primary-200 opacity-50"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 144 144"
                aria-hidden="true"
              >
                <path
                  strokeWidth={2}
                  d="M41.485 15C17.753 31.753 1 59.208 1 89.455c0 24.664 14.891 39.09 32.109 39.09 16.287 0 28.386-13.03 28.386-28.387 0-15.356-10.703-26.524-24.663-26.524-2.792 0-6.515.465-7.446.93 2.327-15.821 17.218-34.435 32.11-43.742L41.485 15zm80.04 0c-23.268 16.753-40.02 44.208-40.02 74.455 0 24.664 14.891 39.09 32.109 39.09 15.822 0 28.386-13.03 28.386-28.387 0-15.356-11.168-26.524-25.129-26.524-2.792 0-6.049.465-6.98.93 2.327-15.821 16.753-34.435 31.644-43.742L121.525 15z"
                />
              </svg>
              <div className="flex mb-4">
                {renderStars(testimonials[0].rating)}
              </div>
              <blockquote className="relative">
                <div className="text-2xl leading-9 font-medium text-gray-900">
                  <p>
                    "{testimonials[0].content}"
                  </p>
                </div>
                <footer className="mt-8">
                  <div className="flex">
                    <div className="flex-shrink-0 lg:hidden">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={testimonials[0].image}
                        alt={testimonials[0].author}
                      />
                    </div>
                    <div className="ml-4 lg:ml-0">
                      <div className="text-base font-medium text-gray-900">{testimonials[0].author}</div>
                      <div className="text-base font-medium text-primary-600">
                        {testimonials[0].role} in {testimonials[0].location}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Project: {testimonials[0].project}
                      </div>
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial grid */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(1).map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <blockquote>
                  <p className="text-lg text-gray-900 mb-4">"{testimonial.content}"</p>
                  <footer className="flex items-center mt-4">
                    <img
                      className="h-12 w-12 rounded-full mr-4"
                      src={testimonial.image}
                      alt={testimonial.author}
                    />
                    <div>
                      <div className="text-base font-medium text-gray-900">{testimonial.author}</div>
                      <div className="text-sm font-medium text-primary-600">
                        {testimonial.role} in {testimonial.location}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Project: {testimonial.project}
                      </div>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video testimonial section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Video testimonials</h2>
            <p className="mt-4 text-lg text-gray-500">
              Watch real users share their experiences with Home Swerv
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-300 flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="text-gray-600">Video testimonial placeholder</p>
                  <p className="text-sm text-gray-500 mt-2">Kitchen Renovation Success Story</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">The Williams Family</h3>
                <p className="mt-2 text-gray-500">
                  See how the Williams family transformed their outdated kitchen into a modern cooking space with Home Swerv.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-300 flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="text-gray-600">Video testimonial placeholder</p>
                  <p className="text-sm text-gray-500 mt-2">Growing a Service Business</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Elite Home Services</h3>
                <p className="mt-2 text-gray-500">
                  Learn how Elite Home Services doubled their client base in 6 months using Home Swerv's provider tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Join our community of satisfied users</span>
            <span className="block">Sign up for free today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Experience the Home Swerv difference for yourself and see why thousands of homeowners and service providers love our platform.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
          >
            Sign up for free
          </Link>
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
              <Link to="/features/homeowners" className="text-base text-gray-500 hover:text-gray-900">
                For Homeowners
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/features/providers" className="text-base text-gray-500 hover:text-gray-900">
                For Service Providers
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/features/pricing" className="text-base text-gray-500 hover:text-gray-900">
                Pricing
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} Home Swerv. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Testimonials;
