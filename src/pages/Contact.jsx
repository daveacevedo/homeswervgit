import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    userType: 'homeowner'
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate form submission
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });
    
    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      userType: 'homeowner'
    });
  };

  // Office locations
  const offices = [
    {
      city: 'Portland',
      address: '123 SW Main St, Suite 400',
      cityState: 'Portland, OR 97204',
      phone: '(503) 555-1234',
      email: 'portland@homeswerv.com'
    },
    {
      city: 'Seattle',
      address: '456 Pike Street, Floor 5',
      cityState: 'Seattle, WA 98101',
      phone: '(206) 555-5678',
      email: 'seattle@homeswerv.com'
    },
    {
      city: 'San Francisco',
      address: '789 Market St, Suite 800',
      cityState: 'San Francisco, CA 94103',
      phone: '(415) 555-9012',
      email: 'sf@homeswerv.com'
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
            alt="Customer support team"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Contact Us
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Have questions or need assistance? Our team is here to help. Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Form and Info Section */}
      <div className="py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
        <div className="relative max-w-xl mx-auto">
          <svg
            className="absolute left-full transform translate-x-1/2"
            width="404"
            height="404"
            fill="none"
            viewBox="0 0 404 404"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="85737c0e-0916-41d7-917f-596dc7edfa27"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
          </svg>
          <svg
            className="absolute right-full bottom-0 transform -translate-x-1/2"
            width="404"
            height="404"
            fill="none"
            viewBox="0 0 404 404"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="85737c0e-0916-41d7-917f-596dc7edfa28"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa28)" />
          </svg>

          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Get in Touch</h2>
            <p className="mt-4 text-lg leading-6 text-gray-500">
              Whether you have a question about our platform, pricing, or anything else, our team is ready to answer all your questions.
            </p>
          </div>
          
          <div className="mt-12">
            {formStatus.submitted && formStatus.success ? (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Message Sent</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>{formStatus.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div className="sm:col-span-2">
                  <fieldset>
                    <legend className="block text-sm font-medium text-gray-700">I am a:</legend>
                    <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                      <div className="flex items-center">
                        <input
                          id="userType-homeowner"
                          name="userType"
                          type="radio"
                          value="homeowner"
                          checked={formData.userType === 'homeowner'}
                          onChange={handleChange}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                        />
                        <label htmlFor="userType-homeowner" className="ml-3 block text-sm font-medium text-gray-700">
                          Homeowner
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="userType-provider"
                          name="userType"
                          type="radio"
                          value="provider"
                          checked={formData.userType === 'provider'}
                          onChange={handleChange}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                        />
                        <label htmlFor="userType-provider" className="ml-3 block text-sm font-medium text-gray-700">
                          Service Provider
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border border-gray-300 rounded-md"
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Offices</h2>
            <p className="mt-4 text-lg text-gray-500">
              Visit us at one of our office locations or reach out directly to a specific office.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {offices.map((office) => (
              <div key={office.city} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">{office.city} Office</h3>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>{office.address}</p>
                    <p>{office.cityState}</p>
                    <p className="mt-4">{office.phone}</p>
                    <p>{office.email}</p>
                  </div>
                  <div className="mt-6">
                    <a
                      href={`https://maps.google.com/?q=${office.address}, ${office.cityState}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-500">
              Find answers to common questions about our platform and services.
            </p>
          </div>
          
          <div className="mt-12 max-w-3xl mx-auto">
            <dl className="space-y-8">
              <div>
                <dt className="text-lg font-medium text-gray-900">How do I sign up for Home Swerv?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  You can sign up by clicking the "Sign Up" button in the top right corner of our website. Follow the prompts to create your account as either a homeowner or service provider.
                </dd>
              </div>
              
              <div>
                <dt className="text-lg font-medium text-gray-900">Is there a fee to use Home Swerv?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  We offer both free and premium plans. Homeowners can use basic features for free, while premium features require a subscription. Service providers pay a monthly fee based on their business size and needs.
                </dd>
              </div>
              
              <div>
                <dt className="text-lg font-medium text-gray-900">How do you verify service providers?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  We verify all service providers through a comprehensive process that includes license verification, insurance checks, background checks, and review of past work and customer feedback.
                </dd>
              </div>
              
              <div>
                <dt className="text-lg font-medium text-gray-900">Can I use Home Swerv on my mobile device?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  Yes, Home Swerv is fully responsive and works on all devices. We also offer dedicated mobile apps for iOS and Android for an optimized mobile experience.
                </dd>
              </div>
              
              <div>
                <dt className="text-lg font-medium text-gray-900">How do payments work on the platform?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  Payments are processed securely through our platform. Homeowners can pay service providers directly, and funds are held in escrow until the work is completed satisfactorily.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
