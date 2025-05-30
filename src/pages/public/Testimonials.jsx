import React from 'react';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  // Testimonial data
  const featuredTestimonials = [
    {
      id: 1,
      content: "Home Swerv completely transformed how I find home services. Their platform connected me with a top-notch plumber who fixed my emergency leak within hours. The transparent pricing and secure payment system gave me peace of mind throughout the process.",
      author: "Sarah Johnson",
      role: "Homeowner",
      location: "Chicago, IL",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5
    },
    {
      id: 2,
      content: "As an electrician, joining Home Swerv has been game-changing for my business. I've seen a 40% increase in new clients, and the scheduling system has eliminated the back-and-forth that used to eat up my time. The platform handles payments seamlessly, letting me focus on my craft.",
      author: "Michael Rodriguez",
      role: "Electrician",
      location: "Miami, FL",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5
    }
  ];

  const allTestimonials = [
    {
      id: 3,
      content: "I needed my entire house painted before a family reunion, and Home Swerv delivered beyond my expectations. The painter I found through the platform was professional, punctual, and did exceptional work. The price was exactly as quoted with no surprises.",
      author: "Jennifer Lee",
      role: "Homeowner",
      location: "Austin, TX",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5
    },
    {
      id: 4,
      content: "Home Swerv has revolutionized how I run my landscaping business. The platform handles all my scheduling, client communications, and payments, allowing me to grow my team and take on more projects. The review system has helped me build credibility in my community.",
      author: "David Thompson",
      role: "Landscaper",
      location: "Portland, OR",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5
    },
    {
      id: 5,
      content: "After a terrible experience with a contractor I found through a classified ad, I turned to Home Swerv for my kitchen renovation. The difference was night and day! The platform's verification process ensured I got a qualified professional, and the project management tools kept everything on track.",
      author: "Emily Wilson",
      role: "Homeowner",
      location: "Denver, CO",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 4
    },
    {
      id: 6,
      content: "As a small HVAC business owner, marketing was always my biggest challenge. Since joining Home Swerv, I've been able to connect with homeowners in my area who need exactly the services I provide. The platform's reputation system has helped me stand out from larger competitors.",
      author: "Robert Garcia",
      role: "HVAC Specialist",
      location: "Phoenix, AZ",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5
    },
    {
      id: 7,
      content: "I've used Home Swerv for everything from regular house cleaning to emergency plumbing repairs. The consistency in quality across different service categories is impressive. I especially appreciate being able to schedule recurring services with providers I trust.",
      author: "Michelle Parker",
      role: "Homeowner",
      location: "Seattle, WA",
      image: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5
    },
    {
      id: 8,
      content: "My cleaning business has thrived since I joined Home Swerv. The platform's fair pricing structure means I can offer competitive rates while still making a good living. The secure payment system ensures I get paid promptly for every job.",
      author: "Lisa Chen",
      role: "Cleaning Service Owner",
      location: "Boston, MA",
      image: "https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5
    },
    {
      id: 9,
      content: "When a storm damaged our roof, we needed help fast. Home Swerv connected us with a roofing contractor who came out the same day for an assessment. The entire repair process was smooth, and we appreciated being able to track progress through the platform.",
      author: "James Wilson",
      role: "Homeowner",
      location: "Atlanta, GA",
      image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 4
    },
    {
      id: 10,
      content: "As a handyman offering multiple services, I was struggling to market myself effectively. Home Swerv's platform allows me to showcase my diverse skills and connect with homeowners needing exactly what I offer. My calendar is now consistently full.",
      author: "Thomas Brown",
      role: "Handyman",
      location: "Nashville, TN",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5
    }
  ];

  // Function to render star ratings
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <svg
        key={index}
        className={`h-5 w-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-blue-700">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover mix-blend-multiply filter brightness-50"
            src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="People collaborating"
          />
          <div className="absolute inset-0 bg-blue-700 mix-blend-multiply" aria-hidden="true"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Testimonials</h1>
          <p className="mt-6 max-w-3xl text-xl text-blue-100">
            Hear from homeowners and service providers who have experienced the Home Swerv difference.
          </p>
        </div>
      </div>

      {/* Featured testimonials section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Testimonials</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Featured Success Stories
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Discover how Home Swerv has transformed the home service experience for both homeowners and service providers.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {featuredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-16 w-16 rounded-full object-cover" src={testimonial.image} alt={testimonial.author} />
                    </div>
                    <div className="ml-4">
                      <div className="text-xl font-bold text-gray-900">{testimonial.author}</div>
                      <div className="text-base text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-lg italic text-gray-700">"{testimonial.content}"</p>
                  </div>
                  <div className="mt-6 flex">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Trusted by thousands of homeowners and service providers
            </h2>
            <p className="mt-3 text-xl text-blue-200 sm:mt-4">
              Our platform is making a real difference in how people experience home services.
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">
                Satisfied Customers
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                10,000+
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">
                Service Providers
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                2,500+
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">
                Average Rating
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                4.8/5
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* All testimonials section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              More Success Stories
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Read what our community has to say about their experiences with Home Swerv.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-12 w-12 rounded-full object-cover" src={testimonial.image} alt={testimonial.author} />
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-medium text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}, {testimonial.location}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-base text-gray-500">"{testimonial.content}"</p>
                  </div>
                  <div className="mt-4 flex">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video testimonial section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Video Testimonials</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              See Our Platform in Action
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Watch real stories from our community members about their experiences with Home Swerv.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <div className="w-full h-0 pb-[56.25%] relative bg-gray-200 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Sarah's Home Renovation Journey</h3>
                <p className="mt-2 text-base text-gray-500">
                  Sarah shares how Home Swerv helped her find the perfect team for her complete home renovation project.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <div className="w-full h-0 pb-[56.25%] relative bg-gray-200 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Michael's Business Growth Story</h3>
                <p className="mt-2 text-base text-gray-500">
                  Michael explains how joining Home Swerv as a plumber helped him grow his client base and streamline his business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to experience the difference?</span>
            <span className="block text-blue-200">Join Home Swerv today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Sign up
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
