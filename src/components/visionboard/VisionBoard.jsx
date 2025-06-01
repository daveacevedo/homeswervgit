import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const VisionBoard = () => {
  const [activeTab, setActiveTab] = useState('kitchen');

  const tabs = [
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'bathroom', label: 'Bathroom' },
    { id: 'livingRoom', label: 'Living Room' },
    { id: 'outdoor', label: 'Outdoor' },
    { id: 'bedroom', label: 'Bedroom' },
  ];

  const inspirationImages = {
    kitchen: [
      {
        id: 1,
        src: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Modern kitchen with island',
        title: 'Modern Minimalist',
        description: 'Clean lines and minimalist design for a spacious feel.',
      },
      {
        id: 2,
        src: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Rustic kitchen with wooden elements',
        title: 'Rustic Charm',
        description: 'Warm wood tones and natural materials for a cozy atmosphere.',
      },
      {
        id: 3,
        src: 'https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Contemporary kitchen with marble countertops',
        title: 'Luxury Contemporary',
        description: 'High-end finishes and sleek appliances for the discerning chef.',
      },
    ],
    bathroom: [
      {
        id: 1,
        src: 'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Spa-like bathroom with freestanding tub',
        title: 'Spa Retreat',
        description: 'Create your own personal spa with calming colors and luxurious fixtures.',
      },
      {
        id: 2,
        src: 'https://images.pexels.com/photos/1910472/pexels-photo-1910472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Modern bathroom with glass shower',
        title: 'Modern Simplicity',
        description: 'Clean lines and open space for a refreshing daily experience.',
      },
      {
        id: 3,
        src: 'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Vintage-inspired bathroom',
        title: 'Vintage Revival',
        description: 'Classic elements with modern conveniences for timeless appeal.',
      },
    ],
    livingRoom: [
      {
        id: 1,
        src: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Cozy living room with fireplace',
        title: 'Cozy Comfort',
        description: 'Soft textures and warm colors for the ultimate relaxation space.',
      },
      {
        id: 2,
        src: 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Modern open concept living room',
        title: 'Open Concept',
        description: 'Maximize your space with thoughtful furniture arrangement and multi-functional pieces.',
      },
      {
        id: 3,
        src: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Eclectic living room with colorful accents',
        title: 'Eclectic Expression',
        description: 'Mix patterns, textures, and eras for a space that tells your unique story.',
      },
    ],
    outdoor: [
      {
        id: 1,
        src: 'https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Backyard patio with outdoor kitchen',
        title: 'Outdoor Entertainment',
        description: 'Create the perfect space for hosting friends and family year-round.',
      },
      {
        id: 2,
        src: 'https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Lush garden landscape',
        title: 'Garden Oasis',
        description: 'Transform your yard into a peaceful retreat with strategic landscaping.',
      },
      {
        id: 3,
        src: 'https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Modern pool area',
        title: 'Pool Paradise',
        description: 'Make a splash with a custom pool design that complements your lifestyle.',
      },
    ],
    bedroom: [
      {
        id: 1,
        src: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Serene master bedroom',
        title: 'Serene Sanctuary',
        description: 'Create a peaceful retreat with soft colors and minimal distractions.',
      },
      {
        id: 2,
        src: 'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Modern bedroom with statement wall',
        title: 'Bold & Beautiful',
        description: 'Make a statement with dramatic colors or an accent wall that showcases your personality.',
      },
      {
        id: 3,
        src: 'https://images.pexels.com/photos/3144580/pexels-photo-3144580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Cozy bedroom with reading nook',
        title: 'Cozy Corners',
        description: 'Maximize your space with thoughtful nooks and multi-functional furniture.',
      },
    ],
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Vision Board</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Find Your Inspiration
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Browse through our curated collection of home design ideas to inspire your next project.
          </p>
        </div>

        <div className="mt-12">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Image Grid */}
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {inspirationImages[activeTab].map((image) => (
              <div key={image.id} className="group relative">
                <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-semibold">{image.title}</h3>
                  <p className="mt-1 text-sm">{image.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/features"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Explore More Ideas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionBoard;
