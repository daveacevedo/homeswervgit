import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const VisionBoard = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'bathroom', name: 'Bathroom' },
    { id: 'living', name: 'Living Room' },
    { id: 'outdoor', name: 'Outdoor' },
    { id: 'bedroom', name: 'Bedroom' }
  ];

  const inspirationItems = [
    {
      id: 1,
      title: 'Modern Kitchen Renovation',
      category: 'kitchen',
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Clean lines, minimalist design, and high-end appliances create a sleek cooking space.'
    },
    {
      id: 2,
      title: 'Luxury Master Bathroom',
      category: 'bathroom',
      image: 'https://images.pexels.com/photos/1910472/pexels-photo-1910472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Spa-like retreat with freestanding tub, walk-in shower, and elegant fixtures.'
    },
    {
      id: 3,
      title: 'Cozy Living Room Design',
      category: 'living',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Comfortable seating, warm colors, and natural light create an inviting space.'
    },
    {
      id: 4,
      title: 'Backyard Oasis',
      category: 'outdoor',
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Landscaped garden with pool, outdoor kitchen, and comfortable seating areas.'
    },
    {
      id: 5,
      title: 'Farmhouse Kitchen',
      category: 'kitchen',
      image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Rustic elements, open shelving, and a large island create a warm, inviting kitchen.'
    },
    {
      id: 6,
      title: 'Serene Bedroom Retreat',
      category: 'bedroom',
      image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Calming colors, plush bedding, and minimal clutter for a peaceful sleep space.'
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? inspirationItems 
    : inspirationItems.filter(item => item.category === activeCategory);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Vision Board</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Find Inspiration for Your Home
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Browse our curated collection of home design ideas and save your favorites to your personal vision board.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${
                  category.id === categories[0].id
                    ? 'rounded-l-md'
                    : category.id === categories[categories.length - 1].id
                    ? 'rounded-r-md'
                    : ''
                } border border-gray-300`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Inspiration Grid */}
        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 p-2">
                  <button className="bg-white rounded-full p-2 shadow hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {categories.find(cat => cat.id === item.category).name}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/homeowner/vision-board"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Your Vision Board
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VisionBoard;
