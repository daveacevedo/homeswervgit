import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const ProviderCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch events from your database
      // For demo purposes, we'll use mock data
      
      // Mock events data
      const mockEvents = [
        {
          id: 1,
          title: 'Kitchen Consultation',
          client: 'John Smith',
          address: '123 Main St, Anytown, CA',
          date: new Date(2023, 4, 15, 10, 0),
          endDate: new Date(2023, 4, 15, 11, 30),
          type: 'consultation',
          notes: 'Initial consultation for kitchen renovation project.'
        },
        {
          id: 2,
          title: 'Bathroom Remodel',
          client: 'Sarah Johnson',
          address: '456 Oak Ave, Somewhere, CA',
          date: new Date(2023, 4, 16, 14, 30),
          endDate: new Date(2023, 4, 16, 17, 0),
          type: 'work',
          notes: 'Installing new shower fixtures and vanity.'
        },
        {
          id: 3,
          title: 'Deck Measurement',
          client: 'Michael Brown',
          address: '789 Pine Rd, Nowhere, CA',
          date: new Date(2023, 4, 18, 9, 0),
          endDate: new Date(2023, 4, 18, 10, 0),
          type: 'measurement',
          notes: 'Taking measurements for new deck installation.'
        },
        {
          id: 4,
          title: 'Interior Painting',
          client: 'Emily Wilson',
          address: '101 Elm St, Anytown, CA',
          date: new Date(2023, 4, 20, 13, 0),
          endDate: new Date(2023, 4, 20, 18, 0),
          type: 'work',
          notes: 'Painting living room and dining room.'
        },
        {
          id: 5,
          title: 'Roof Inspection',
          client: 'David Lee',
          address: '202 Cedar Ave, Somewhere, CA',
          date: new Date(2023, 4, 22, 11, 0),
          endDate: new Date(2023, 4, 22, 12, 0),
          type: 'inspection',
          notes: 'Inspecting roof for potential leaks.'
        },
        {
          id: 6,
          title: 'Fence Installation',
          client: 'Jennifer Garcia',
          address: '303 Maple Dr, Nowhere, CA',
          date: new Date(2023, 4, 25, 8, 0),
          endDate: new Date(2023, 4, 25, 16, 0),
          type: 'work',
          notes: 'Installing new privacy fence in backyard.'
        },
        {
          id: 7,
          title: 'Electrical Work',
          client: 'Robert Martinez',
          address: '404 Birch Ln, Anytown, CA',
          date: new Date(2023, 4, 28, 15, 0),
          endDate: new Date(2023, 4, 28, 17, 0),
          type: 'work',
          notes: 'Updating electrical panel and adding new outlets.'
        },
        {
          id: 8,
          title: 'Landscaping Consultation',
          client: 'Lisa Anderson',
          address: '505 Spruce Ct, Somewhere, CA',
          date: new Date(2023, 4, 30, 10, 0),
          endDate: new Date(2023, 4, 30, 11, 0),
          type: 'consultation',
          notes: 'Discussing front yard landscaping design.'
        }
      ];
      
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setShowEventModal(false);
  };

  // Get event type badge
  const getEventTypeBadge = (type) => {
    const types = {
      consultation: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Consultation' },
      work: { bg: 'bg-green-100', text: 'text-green-800', label: 'Work' },
      measurement: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Measurement' },
      inspection: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Inspection' }
    };
    
    const typeInfo = types[type] || { bg: 'bg-gray-100', text: 'text-gray-800', label: type };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.bg} ${typeInfo.text}`}>
        {typeInfo.label}
      </span>
    );
  };

  // Format time
  const formatTime = (date) => {
    return format(date, 'h:mm a');
  };

  // Render calendar header
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    );
  };

  // Render days of week
  const renderDays = () => {
    const days = [];
    const date = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-semibold text-gray-600 text-sm py-2">
          {format(addDays(date, i), 'EEEE')}
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-1">{days}</div>;
  };

  // Render cells
  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, 'd');
        const dayEvents = events.filter(event => isSameDay(event.date, day));
        
        days.push(
          <div
            key={day.toString()}
            className={`min-h-[120px] p-2 border border-gray-200 ${
              !isSameMonth(day, monthStart)
                ? 'bg-gray-50 text-gray-400'
                : isSameDay(day, new Date())
                ? 'bg-blue-50'
                : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className={`text-sm font-medium ${
                !isSameMonth(day, monthStart)
                  ? 'text-gray-400'
                  : isSameDay(day, new Date())
                  ? 'text-blue-600'
                  : 'text-gray-900'
              }`}>
                {formattedDate}
              </span>
              {isSameMonth(day, monthStart) && (
                <button
                  type="button"
                  className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                >
                  <div className="font-medium truncate">{event.title}</div>
                  <div className="text-xs text-blue-600">{formatTime(event.date)}</div>
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-1">{rows}</div>;
  };

  // Render list view
  const renderListView = () => {
    // Group events by date
    const eventsByDate = events.reduce((acc, event) => {
      const dateKey = format(event.date, 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(eventsByDate).sort();

    return (
      <div className="space-y-6">
        {sortedDates.map(dateKey => {
          const date = new Date(dateKey);
          const dayEvents = eventsByDate[dateKey];
          
          return (
            <div key={dateKey} className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {format(date, 'EEEE, MMMM d, yyyy')}
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {dayEvents.map(event => (
                  <li key={event.id}>
                    <div
                      className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-blue-600 truncate">{event.title}</p>
                          <div className="ml-2">
                            {getEventTypeBadge(event.type)}
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {formatTime(event.date)} - {formatTime(event.endDate)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Client: {event.client}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            {event.address}
                          </p>
                        </div>
                      </div>
                      {event.notes && (
                        <div className="mt-2 text-sm text-gray-500">
                          <p>{event.notes}</p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };

  // Event modal
  const renderEventModal = () => {
    if (!selectedEvent) return null;

    return (
      <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseModal}></div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {selectedEvent.title}
                </h3>
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-500 w-24">Type:</span>
                    <div>{getEventTypeBadge(selectedEvent.type)}</div>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-500 w-24">Date:</span>
                    <span className="text-sm text-gray-900">{format(selectedEvent.date, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-500 w-24">Time:</span>
                    <span className="text-sm text-gray-900">{formatTime(selectedEvent.date)} - {formatTime(selectedEvent.endDate)}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-500 w-24">Client:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.client}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-500 w-24">Address:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.address}</span>
                  </div>
                  {selectedEvent.notes && (
                    <div className="flex items-start mb-2">
                      <span className="text-sm font-medium text-gray-500 w-24">Notes:</span>
                      <span className="text-sm text-gray-900">{selectedEvent.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [view, setView] = useState('calendar'); // 'calendar' or 'list'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                view === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setView('calendar')}
            >
              Calendar View
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                view === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setView('list')}
            >
              List View
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Event
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg p-6">
          {view === 'calendar' ? (
            <>
              {renderHeader()}
              {renderDays()}
              {renderCells()}
            </>
          ) : (
            renderListView()
          )}
        </div>
      </div>
      {showEventModal && renderEventModal()}
    </div>
  );
};

export default ProviderCalendar;
