import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHomeowner } from '../../contexts/HomeownerContext';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';

const Messages = () => {
  const { user } = useAuth();
  const { homeownerProfile } = useHomeowner();
  const [searchParams] = useSearchParams();
  const initialProviderId = searchParams.get('provider');
  
  const [providers, setProviders] = useState([]);
  const [conversations, setConversations] = useState({});
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockProviders = [
          {
            id: 'prov-1',
            name: 'Ace Plumbing & Remodeling',
            category: 'Plumbing',
            avatar: 'https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            online: true,
            lastSeen: null,
            unreadCount: 2
          },
          {
            id: 'prov-2',
            name: 'Green Thumb Landscaping',
            category: 'Landscaping',
            avatar: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            online: false,
            lastSeen: '2023-11-02T14:30:00',
            unreadCount: 0
          },
          {
            id: 'prov-3',
            name: 'Bright Spark Electric',
            category: 'Electrical',
            avatar: 'https://images.pexels.com/photos/8961292/pexels-photo-8961292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            online: true,
            lastSeen: null,
            unreadCount: 0
          },
          {
            id: 'prov-4',
            name: 'Top Notch Roofing',
            category: 'Roofing',
            avatar: 'https://images.pexels.com/photos/6474343/pexels-photo-6474343.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            online: false,
            lastSeen: '2023-11-01T09:15:00',
            unreadCount: 0
          }
        ];
        
        const mockConversations = {
          'prov-1': [
            {
              id: 'msg-1',
              sender: 'provider',
              text: 'Hi there! I wanted to follow up on the bathroom renovation project. We\'re on track to start the tile installation next week.',
              timestamp: '2023-11-02T10:30:00',
              read: true
            },
            {
              id: 'msg-2',
              sender: 'homeowner',
              text: 'That sounds great! Do you need me to select the grout color before you start?',
              timestamp: '2023-11-02T10:35:00',
              read: true
            },
            {
              id: 'msg-3',
              sender: 'provider',
              text: 'Yes, that would be helpful. I can bring some samples tomorrow if you\'re available.',
              timestamp: '2023-11-02T10:40:00',
              read: true
            },
            {
              id: 'msg-4',
              sender: 'homeowner',
              text: 'Perfect. I\'ll be home after 3pm tomorrow.',
              timestamp: '2023-11-02T10:45:00',
              read: true
            },
            {
              id: 'msg-5',
              sender: 'provider',
              text: 'Great! I\'ll stop by around 4pm with the samples.',
              timestamp: '2023-11-02T10:50:00',
              read: false
            },
            {
              id: 'msg-6',
              sender: 'provider',
              text: 'Also, I wanted to let you know that the new vanity you selected is now in stock. Would you like me to go ahead and order it?',
              timestamp: '2023-11-02T14:15:00',
              read: false
            }
          ],
          'prov-2': [
            {
              id: 'msg-7',
              sender: 'homeowner',
              text: 'Hello! I\'m wondering when you\'ll be coming for the first lawn service?',
              timestamp: '2023-10-28T09:30:00',
              read: true
            },
            {
              id: 'msg-8',
              sender: 'provider',
              text: 'Hi there! We have you scheduled for November 10th, between 9am and 12pm. Does that still work for you?',
              timestamp: '2023-10-28T11:45:00',
              read: true
            },
            {
              id: 'msg-9',
              sender: 'homeowner',
              text: 'Yes, that works perfectly. Do I need to do anything to prepare?',
              timestamp: '2023-10-28T13:20:00',
              read: true
            },
            {
              id: 'msg-10',
              sender: 'provider',
              text: 'Just make sure any pets are kept inside during the service, and if there are any specific areas you want us to focus on, please mark them or let us know when we arrive.',
              timestamp: '2023-10-28T14:05:00',
              read: true
            },
            {
              id: 'msg-11',
              sender: 'homeowner',
              text: 'Will do. Thanks!',
              timestamp: '2023-10-28T14:10:00',
              read: true
            }
          ],
          'prov-3': [
            {
              id: 'msg-12',
              sender: 'provider',
              text: 'The electrical panel upgrade has been completed successfully. All circuits are labeled and the permit has been finalized.',
              timestamp: '2023-10-28T16:30:00',
              read: true
            },
            {
              id: 'msg-13',
              sender: 'homeowner',
              text: 'Thank you for the quick and professional work! Everything seems to be working great.',
              timestamp: '2023-10-28T18:45:00',
              read: true
            },
            {
              id: 'msg-14',
              sender: 'provider',
              text: 'You\'re welcome! Don\'t hesitate to reach out if you have any questions or concerns. We provide a 1-year warranty on all our work.',
              timestamp: '2023-10-29T09:15:00',
              read: true
            }
          ],
          'prov-4': []
        };
        
        setProviders(mockProviders);
        setConversations(mockConversations);
        
        // If provider ID was passed in URL, select that provider
        if (initialProviderId) {
          setSelectedProviderId(initialProviderId);
        } else if (mockProviders.length > 0) {
          // Otherwise select the first provider with unread messages, or just the first provider
          const providerWithUnread = mockProviders.find(p => p.unreadCount > 0);
          setSelectedProviderId(providerWithUnread ? providerWithUnread.id : mockProviders[0].id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [initialProviderId]);
  
  useEffect(() => {
    // Scroll to bottom of messages when conversation changes or new message is added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedProviderId, conversations]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedProviderId) return;
    
    // Add new message to conversation
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'homeowner',
      text: message,
      timestamp: new Date().toISOString(),
      read: true
    };
    
    setConversations(prev => ({
      ...prev,
      [selectedProviderId]: [...(prev[selectedProviderId] || []), newMessage]
    }));
    
    // Clear message input
    setMessage('');
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time only
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Within a week - show day name
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      // Older - show date
      return date.toLocaleDateString();
    }
  };
  
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return '';
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `Last seen ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) {
        return `Last seen ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) {
          return 'Last seen yesterday';
        } else {
          return `Last seen ${diffDays} days ago`;
        }
      }
    }
  };
  
  const filteredProviders = providers.filter(provider => 
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const selectedProvider = providers.find(p => p.id === selectedProviderId);
  const currentConversation = selectedProviderId ? conversations[selectedProviderId] || [] : [];
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Messages
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Communicate with your service providers
          </p>
        </div>
      </div>
      
      {/* Messages Interface */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="flex h-[calc(80vh-8rem)]">
          {/* Providers List */}
          <div className="w-full sm:w-80 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Search providers"
                />
              </div>
            </div>
            
            {/* Providers */}
            <div className="flex-1 overflow-y-auto">
              {filteredProviders.length === 0 ? (
                <div className="py-8 text-center">
                  <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No providers found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search terms
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredProviders.map((provider) => (
                    <li 
                      key={provider.id}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedProviderId === provider.id ? 'bg-gray-50' : ''}`}
                      onClick={() => setSelectedProviderId(provider.id)}
                    >
                      <div className="px-4 py-4 sm:px-6 flex items-center">
                        <div className="relative flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-full object-cover"
                            src={provider.avatar}
                            alt={provider.name}
                          />
                          {provider.online && (
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                          )}
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">{provider.name}</p>
                            {provider.unreadCount > 0 && (
                              <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                                {provider.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{provider.category}</p>
                          <p className="text-xs text-gray-400 truncate">
                            {provider.online ? 'Online' : formatLastSeen(provider.lastSeen)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Conversation */}
          <div className="hidden sm:flex flex-1 flex-col">
            {selectedProvider ? (
              <>
                {/* Provider Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={selectedProvider.avatar}
                        alt={selectedProvider.name}
                      />
                      {selectedProvider.online && (
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{selectedProvider.name}</p>
                      <p className="text-xs text-gray-500">
                        {selectedProvider.online ? 'Online' : formatLastSeen(selectedProvider.lastSeen)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full border border-gray-300 bg-white p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full border border-gray-300 bg-white p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <VideoCameraIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full border border-gray-300 bg-white p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <InformationCircleIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full border border-gray-300 bg-white p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {currentConversation.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Start the conversation with {selectedProvider.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentConversation.map((msg, index) => {
                        const isHomeowner = msg.sender === 'homeowner';
                        const showTimestamp = index === 0 || 
                          new Date(msg.timestamp).toDateString() !== 
                          new Date(currentConversation[index - 1].timestamp).toDateString();
                        
                        return (
                          <div key={msg.id}>
                            {showTimestamp && (
                              <div className="flex justify-center my-4">
                                <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                                  {new Date(msg.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isHomeowner ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                                isHomeowner 
                                  ? 'bg-primary-600 text-white rounded-br-none' 
                                  : 'bg-white text-gray-900 rounded-bl-none shadow'
                              }`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 text-right ${
                                  isHomeowner ? 'text-primary-100' : 'text-gray-500'
                                }`}>
                                  {formatTimestamp(msg.timestamp)}
                                  {isHomeowner && (
                                    <span className="ml-1">
                                      {msg.read ? '✓✓' : '✓'}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-center">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <input
                      type="text"
                      name="message"
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm mx-2"
                      placeholder={`Message ${selectedProvider.name}...`}
                    />
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <FaceSmileIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className={`ml-2 inline-flex items-center rounded-full p-2 ${
                        message.trim() 
                          ? 'bg-primary-600 text-white hover:bg-primary-700' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                    >
                      <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a provider from the list to start messaging
                </p>
              </div>
            )}
          </div>
          
          {/* Mobile: Show selected conversation or prompt to select */}
          <div className="flex flex-col flex-1 sm:hidden">
            {selectedProvider ? (
              <>
                {/* Provider Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setSelectedProviderId(null)}
                      className="mr-2 text-gray-400 hover:text-gray-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="relative flex-shrink-0">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={selectedProvider.avatar}
                        alt={selectedProvider.name}
                      />
                      {selectedProvider.online && (
                        <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white"></span>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{selectedProvider.name}</p>
                      <p className="text-xs text-gray-500">
                        {selectedProvider.online ? 'Online' : formatLastSeen(selectedProvider.lastSeen)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full border border-gray-300 bg-white p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full border border-gray-300 bg-white p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <EllipsisHorizontalIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {currentConversation.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Start the conversation with {selectedProvider.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentConversation.map((msg, index) => {
                        const isHomeowner = msg.sender === 'homeowner';
                        const showTimestamp = index === 0 || 
                          new Date(msg.timestamp).toDateString() !== 
                          new Date(currentConversation[index - 1].timestamp).toDateString();
                        
                        return (
                          <div key={msg.id}>
                            {showTimestamp && (
                              <div className="flex justify-center my-4">
                                <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                                  {new Date(msg.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isHomeowner ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs px-4 py-2 rounded-lg ${
                                isHomeowner 
                                  ? 'bg-primary-600 text-white rounded-br-none' 
                                  : 'bg-white text-gray-900 rounded-bl-none shadow'
                              }`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 text-right ${
                                  isHomeowner ? 'text-primary-100' : 'text-gray-500'
                                }`}>
                                  {formatTimestamp(msg.timestamp)}
                                  {isHomeowner && (
                                    <span className="ml-1">
                                      {msg.read ? '✓✓' : '✓'}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
                
                {/* Message Input */}
                <div className="p-3 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-center">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <input
                      type="text"
                      name="message"
                      id="message-mobile"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm mx-2"
                      placeholder="Type a message..."
                    />
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className={`inline-flex items-center rounded-full p-1.5 ${
                        message.trim() 
                          ? 'bg-primary-600 text-white hover:bg-primary-700' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                    >
                      <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">
                  Select a conversation from the list
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
