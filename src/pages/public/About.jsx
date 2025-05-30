import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Jennifer Wilson',
      role: 'CEO & Founder',
      imageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bio: 'Former real estate developer with 15+ years of experience in the home services industry.'
    },
    {
      name: 'Marcus Thompson',
      role: 'CTO',
      imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bio: 'Tech veteran who previously built marketplace platforms for various industries.'
    },
    {
      name: 'David Chen',
      role: 'VP of Provider Relations',
      imageUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bio: "Former contractor who understands the challenges service providers face in today's market."
    },
    {
      name: 'Olivia Martinez',
      role: 'VP of Customer Experience',
      imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bio: 'Customer service expert with a passion for creating exceptional user experiences.'
    },
    {
      name: 'Robert Johnson',
      role: 'CFO',
      imageUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bio: 'Financial strategist with experience scaling marketplace startups.'
    },
    {
      name: 'Sarah Kim',
      role: 'Head of Marketing',
      imageUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bio: 'Digital marketing expert who specializes in connecting service businesses with customers.'
    }
  ];

  // Company values data
  const values = [
    {
      name: 'Trust & Transparency',
      description: 'We believe in building trust through transparent practices, honest communication, and reliable service.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      name: 'Quality & Excellence',
      description: 'We are committed to connecting homeowners with the highest quality service providers who deliver excellent results.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      name: 'Community & Connection',
      description: 'We foster a community where homeowners and service providers can connect, collaborate, and build lasting relationships.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      name: 'Innovation & Improvement',
      description: 'We continuously innovate and improve our platform to make home services more accessible, efficient, and satisfying for everyone.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Team collaboration"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            About Home Swerv
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            We're on a mission to transform how homeowners find and hire service providers, making home maintenance and improvement simpler, more reliable, and more satisfying for everyone.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Our Story</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              How We Started
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <p className="text-lg text-gray-500">
                Home Swerv was founded in 2020 by Jennifer Wilson, a former real estate developer who experienced firsthand the challenges of finding reliable service providers for her properties. After a particularly frustrating experience with a renovation project, Jennifer realized there had to be a better way to connect homeowners with qualified professionals.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                She assembled a team of experts in technology, customer service, and the home services industry to build a platform that would solve this problem. The result was Home Swerv—a comprehensive marketplace that vets service providers, facilitates easy booking, and ensures quality work through reviews and guarantees.
              </p>
            </div>
            <div>
              <p className="text-lg text-gray-500">
                Since our launch, we've helped thousands of homeowners complete projects ranging from minor repairs to major renovations. We've also provided service providers with a steady stream of clients, helping them grow their businesses and improve their services through our feedback system.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                Today, Home Swerv operates in over 50 cities across the country, with plans to expand nationwide by the end of next year. Our team has grown to over 100 employees, all dedicated to our mission of transforming the home services industry.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Our Values</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              What We Believe In
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    {value.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{value.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Our Team</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Meet the People Behind Home Swerv
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Our diverse team brings together expertise in technology, home services, customer experience, and business growth.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((person, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  className="w-full h-64 object-cover"
                  src={person.imageUrl}
                  alt={person.name}
                />
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{person.name}</h3>
                  <p className="text-sm text-blue-600">{person.role}</p>
                  <p className="mt-3 text-base text-gray-500">{person.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to experience the Home Swerv difference?</span>
            <span className="block text-blue-200">Join our community of homeowners and service providers today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
              >
                Get Started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
