import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const VisionBoard = () => {
  // Sample vision board items
  const visionBoardItems = [
    {
      id: 1,
      title: 'Modern Kitchen Renovation',
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Kitchen'
    },
    {
      id: 2,
      title: 'Backyard Patio Design',
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Outdoor'
    },
    {
      id: 3,
      title: 'Bathroom Remodel',
      image: 'https://images.pexels.com/photos/1910472/pexels-photo-1910472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Bathroom'
    },
    {
      id: 4,
      title: 'Home Office Setup',
      image: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Office'
    }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Vision Board</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Visualize your dream home
          </p>
          <p className="max-w-3xl mt-5 mx-auto text-xl text-gray-500">
            Collect and organize inspiration for your home projects. Create mood boards, share with service providers, and bring your vision to life.
          </p>
        </div>

        <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {visionBoardItems.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-60 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block bg-blue-600 rounded-full px-3 py-1 text-xs font-semibold text-white mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-medium text-white">{item.title}</h3>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Save to my board
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Your Vision Board
            <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
          </Link>
          <p className="mt-3 text-sm text-gray-500">
            Sign up for free to create and save your own vision boards
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisionBoard;
