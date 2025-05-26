import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                Home Swerv
              </h1>
              <p className="mt-2 text-2xl font-medium text-primary-100">
                Your Community Hub
              </p>
              <p className="mt-6 max-w-lg mx-auto text-xl text-white">
                Find qualified professionals for your home projects and manage everything in one place.
              </p>
              <div className="mt-10 flex justify-center">
                <Link
                  to="/ai-concierge"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-primary-600 bg-white shadow-md hover:bg-primary-50 transition-all duration-200 transform hover:-translate-y-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Go To Your Home Concierge
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="bg-white py-8 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
              Trusted by homeowners and service providers across the country
            </p>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
              <div className="col-span-1 flex justify-center items-center">
                <img className="h-12 opacity-60" src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Trusted company" />
              </div>
              <div className="col-span-1 flex justify-center items-center">
                <img className="h-12 opacity-60" src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Trusted company" />
              </div>
              <div className="col-span-1 flex justify-center items-center">
                <img className="h-12 opacity-60" src="https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Trusted company" />
              </div>
              <div className="col-span-1 flex justify-center items-center">
                <img className="h-12 opacity-60" src="https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Trusted company" />
              </div>
              <div className="col-span-1 flex justify-center items-center">
                <img className="h-12 opacity-60" src="https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Trusted company" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need for your home projects
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Our platform makes it easy to find, hire, and manage service providers for all your home improvement needs.
              </p>
            </div>

            <div className="mt-16">
              <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-14 w-14 rounded-xl bg-primary-100 text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="ml-20">
                    <h3 className="text-xl leading-6 font-medium text-gray-900">Find Trusted Providers</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Browse verified service providers with ratings and reviews from homeowners in your area. Our verification process ensures you're working with qualified professionals.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-14 w-14 rounded-xl bg-primary-100 text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-20">
                    <h3 className="text-xl leading-6 font-medium text-gray-900">Project Management</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Create and manage projects, track progress, and communicate with providers all in one place. Set milestones, share documents, and keep everything organized.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-14 w-14 rounded-xl bg-primary-100 text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-20">
                    <h3 className="text-xl leading-6 font-medium text-gray-900">Smart Scheduling</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Book appointments and manage your calendar to keep your projects on track. Receive reminders and sync with your favorite calendar apps for seamless planning.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-14 w-14 rounded-xl bg-primary-100 text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div className="ml-20">
                    <h3 className="text-xl leading-6 font-medium text-gray-900">Secure Messaging</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Communicate directly with service providers through our secure messaging system. Share photos, documents, and project details in a centralized conversation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-16">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">How It Works</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Simple steps to get your project done
              </p>
            </div>
            
            <div className="relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary-100 transform -translate-y-1/2 z-0"></div>
              
              <div className="relative z-10 grid grid-cols-1 gap-12 md:grid-cols-4">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white border-2 border-primary-600 text-primary-600 mb-4">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Create Your Project</h3>
                  <p className="text-base text-gray-500">
                    Describe what you need done and provide details about your home project.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white border-2 border-primary-600 text-primary-600 mb-4">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Match with Providers</h3>
                  <p className="text-base text-gray-500">
                    Get matched with qualified service providers in your area who can help.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white border-2 border-primary-600 text-primary-600 mb-4">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Compare & Select</h3>
                  <p className="text-base text-gray-500">
                    Review profiles, compare quotes, and select the best provider for your needs.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white border-2 border-primary-600 text-primary-600 mb-4">
                    <span className="text-xl font-bold">4</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Complete Your Project</h3>
                  <p className="text-base text-gray-500">
                    Work with your provider through our platform and enjoy your completed project.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Projects Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Featured Projects</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Get inspired by completed projects
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Project Card 1 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-300">
                <img 
                  src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Modern kitchen renovation" 
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                    <span className="ml-2 text-sm text-gray-500">Kitchen Renovation</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Modern Kitchen Transformation</h3>
                  <p className="text-gray-600 mb-4">
                    Complete kitchen remodel with custom cabinets, quartz countertops, and new appliances.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                        JD
                      </div>
                      <span className="ml-2 text-sm text-gray-500">John D.</span>
                    </div>
                    <Link to="/community/project/1" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Project Card 2 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-300">
                <img 
                  src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Bathroom remodel" 
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                    <span className="ml-2 text-sm text-gray-500">Bathroom Remodel</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Luxury Bathroom Upgrade</h3>
                  <p className="text-gray-600 mb-4">
                    Complete bathroom renovation with walk-in shower, freestanding tub, and heated floors.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                        SM
                      </div>
                      <span className="ml-2 text-sm text-gray-500">Sarah M.</span>
                    </div>
                    <Link to="/community/project/2" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Project Card 3 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-300">
                <img 
                  src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Backyard landscaping" 
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                    <span className="ml-2 text-sm text-gray-500">Landscaping</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Backyard Oasis Creation</h3>
                  <p className="text-gray-600 mb-4">
                    Complete backyard transformation with patio, fire pit, and professional landscaping.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                        RJ
                      </div>
                      <span className="ml-2 text-sm text-gray-500">Robert J.</span>
                    </div>
                    <Link to="/community/project/3" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                to="/community" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
              >
                Explore More Projects
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-gray-50 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Testimonials</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                What our users are saying
              </p>
            </div>
            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="bg-white p-8 rounded-lg shadow-soft hover:shadow-card transition-shadow duration-300">
                  <div className="flex items-center mb-6">
                    <img 
                      src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="John Doe" 
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">John Doe</h4>
                      <p className="text-gray-500">Homeowner</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    "I found a great plumber through Home Swerv. The whole process was smooth, and I could track the project from start to finish. The platform made communication easy and stress-free."
                  </p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-soft hover:shadow-card transition-shadow duration-300">
                  <div className="flex items-center mb-6">
                    <img 
                      src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Jane Smith" 
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Jane Smith</h4>
                      <p className="text-gray-500">Service Provider</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    "As an electrician, this platform has helped me find new clients and grow my business. The scheduling tools save me hours every week, and the payment system is reliable and fast."
                  </p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-soft hover:shadow-card transition-shadow duration-300">
                  <div className="flex items-center mb-6">
                    <img 
                      src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Robert Johnson" 
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Robert Johnson</h4>
                      <p className="text-gray-500">Homeowner</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    "The community inspiration hub gave me great ideas for my kitchen renovation. I found a contractor through the platform and couldn't be happier with the results."
                  </p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star, index) => (
                      <svg key={star} className={`h-5 w-5 ${index < 4 ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                <span className="block">Ready to get started?</span>
                <span className="block text-primary-600">Create your account today.</span>
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Join thousands of homeowners and service providers who are already using Home Swerv to simplify their home improvement projects.
              </p>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 lg:ml-8">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200"
                >
                  Sign up
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-all duration-200"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
