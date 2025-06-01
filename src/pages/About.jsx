import React from 'react';

const About = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: "Sarah founded Home Swerv after experiencing frustration with managing her own home renovation projects. With 15 years of experience in real estate and technology, she's passionate about making home management easier for everyone.",
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO',
      bio: "Michael brings 12 years of software development experience to Home Swerv. He previously led engineering teams at several successful startups and is focused on building intuitive, reliable technology.",
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      name: 'David Chen',
      role: 'Head of Operations',
      bio: "David oversees day-to-day operations at Home Swerv. With a background in both construction and business management, he ensures our platform meets the needs of both homeowners and service providers.",
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      name: 'Emily Patel',
      role: 'Head of Marketing',
      bio: "Emily leads our marketing efforts with over 10 years of experience in digital marketing and brand strategy. She's passionate about helping homeowners discover the tools they need to manage their homes effectively.",
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  // Company values
  const values = [
    {
      title: 'Trust',
      description: 'We build trust through transparency, reliability, and consistent delivery of quality service.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Innovation',
      description: 'We continuously seek new and better ways to solve problems and improve the home management experience.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Community',
      description: 'We foster connections between homeowners and service providers to build stronger, more supportive communities.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Quality',
      description: "We're committed to excellence in everything we do, from our platform's performance to our customer service.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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
            alt="Team working together"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            About Home Swerv
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            We're on a mission to transform how homeowners manage their properties and connect with service providers. Our platform makes home management simple, efficient, and stress-free.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Our Story</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              How We Started
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <p className="text-lg text-gray-500">
                Home Swerv was founded in 2018 by Sarah Johnson after she experienced firsthand the challenges of managing multiple home renovation projects. Frustrated by the lack of tools to help homeowners coordinate with contractors, track progress, and manage budgets, she set out to create a solution.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                What started as a simple project management tool has evolved into a comprehensive platform that connects homeowners with trusted service providers, offers powerful property management features, and provides inspiration for home improvement projects.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                Today, Home Swerv serves thousands of homeowners and service providers across the country, helping them save time, reduce stress, and create homes they love.
              </p>
            </div>
            <div className="relative h-64 lg:h-auto">
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Team working together"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Our Values</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              What Drives Us
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Our core values guide everything we do, from product development to customer service.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="text-primary-600 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{value.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Our Team</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Meet the People Behind Home Swerv
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Our diverse team brings together expertise in technology, real estate, construction, and customer service.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <img
                    className="absolute inset-0 w-full h-full object-cover"
                    src={member.image}
                    alt={member.name}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-primary-600">{member.role}</p>
                  <p className="mt-3 text-base text-gray-500">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Trusted by homeowners and service providers nationwide
            </h2>
            <p className="mt-3 text-xl text-primary-200">
              We're proud of what we've accomplished together with our community.
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">
                Homeowners
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                25,000+
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">
                Service Providers
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                5,000+
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">
                Projects Completed
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                75,000+
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default About;
