import React from 'react';
import { Link } from 'react-router-dom';

const VisionBoard = () => {
  // Sample vision board items
  const visionItems = [
    {
      id: 1,
      title: 'Modern Kitchen Renovation',
      description: 'Open concept with island and high-end appliances',
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Kitchen'
    },
    {
      id: 2,
      title: 'Backyard Oasis',
      description: 'Landscaped garden with water feature and outdoor kitchen',
      image: 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Outdoor'
    },
    {
      id: 3,
      title: 'Spa-Like Bathroom',
      description: 'Freestanding tub, walk-in shower, and double vanity',
      image: 'https://images.pexels.com/photos/1910472/pexels-photo-1910472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Bathroom'
    },
    {
      id: 4,
      title: 'Home Office',
      description: 'Functional workspace with built-in storage and natural light',
      image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Office'
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Vision Board</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Visualize Your Dream Home
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Collect inspiration and turn your ideas into reality with our vision board tool.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {visionItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48">
                <img
                  className="absolute inset-0 w-full h-full object-cover"
                  src={item.image}
                  alt={item.title}
                />
                <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-primary-600 rounded-full text-xs font-semibold text-white">
                  {item.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.description}</p>
                <div className="mt-4 flex justify-between">
                  <Link
                    to="/register"
                    className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    Create Project
                    <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    <span className="sr-only">Save</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Create Your Vision Board
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VisionBoard;
