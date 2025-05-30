import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProvider } from '../../contexts/ProviderContext';
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
  const { providerProfile } = useProvider();
  const [searchParams] = useSearchParams();
  const initialClientId = searchParams.get('client');
  
  const [clients, setClients] = useState([]);
  const [conversations, setConversations] = useState({});
  const [selectedClientId, setSelectedClientId] = useState(null);
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
        const mockClients = [
          {
            id: 'client-1',
            name: 'Sarah Johnson',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            address: '123 Main St, Anytown, CA',
            online: true,
            lastSeen: null,
            unreadCount: 2
          },
          {
            id: 'client-2',
            name: 'Michael Chen',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            address: '456 Oak Ave, Somewhere, CA',
            online: false,
            lastSeen: '2023-11-02T14:30:00',
            unreadCount: 0
          },
          {
            id: 'client-3',
            name: 'Emily Rodriguez',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            address: '789 Pine St, Elsewhere, CA',
            online: true,
            lastSeen: null,
            unreadCount: 0
          },
          {
            id: 'client-4',
            name: 'David Wilson',
            avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            address: '101 Elm St, Somewhere, CA',
            online: false,
            lastSeen: '2023-11-01T09:15:00',
            unreadCount: 0
          },
          {
            id: 'client-5',
            name: 'Jennifer Lee',
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            address: '202 Cedar St, Anytown, CA',
            online: false,
            lastSeen: '2023-10-30T16:45:00',
            unreadCount: 0
          }
        ];
        
        const mockConversations = {
          'client-1': [
            {
              id: 'msg-1',
              sender: 'provider',
              text: 'Hi Sarah, I wanted to follow up on the bathroom renovation project. We\'re on track to start the tile installation next week.',
              timestamp: '2023-11-02T10:30:00',
              read: true
            },
            {
              id: 'msg-2',
              sender: 'client',
              text: 'That sounds great! Do I need to select the grout color before you start?',
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
              sender: 'client',
              text: 'Perfect. I\'ll be home after 3pm tomorrow.',
              timestamp: '2023-11-02T10:45:00',
              read: true
            },
            {
              id: 'msg-5',
              sender: 'provider',
              text: 'Great! I\'ll stop by around 4pm with the samples.',
              timestamp: '2023-11-02T10:50:00',
              read: true
            },
            {
              id: 'msg-6',
              sender: 'provider',
              text: 'Also, I wanted to let you know that the new vanity you selected is now in stock. Would you like me to go ahead and order it?',
              timestamp: '2023-11-02T14:15:00',
              read: false
            }
          ],
          'client-2': [
            {
              id: 'msg-7',
              sender: 'client',
              text: 'Hello! I\'m wondering when you\'ll be coming to fix my kitchen sink?',
              timestamp: '2023-10-28T09:30:00',
              read: true
            },
            {
              id: 'msg-8',
              sender: 'provider',
              text: 'Hi Michael! We have you scheduled for November 12th, between 9am and 12pm. Does that still work for you?',
              timestamp: '2023-10-28T11:45:00',
              read: true
            },
            {
              id: 'msg-9',
              sender: 'client',
              text: 'Yes, that works perfectly. Do I need to do anything to prepare?',
              timestamp: '2023-10-28T13:20:00',
              read: true
            },
            {
              id: 'msg-10',
              sender: 'provider',
              text: 'Just make sure the area under the sink is cleared out so I can access it easily. And it\'s helpful if you can turn off the water to the sink before I arrive, but I can do that too if needed.',
              timestamp: '2023-10-28T14:05:00',
              read: true
            },
            {
              id: 'msg-11',
              sender: 'client',
              text: 'Will do. Thanks!',
              timestamp: '2023-10-28T14:10:00',
              read: true
            }
          ],
          'client-3': [
            {
              id: 'msg-12',
              sender: 'provider',
              text: 'The bathroom faucet installation has been completed. Everything is working properly and I\'ve cleaned up the area.',
              timestamp: '2023-10-28T16:30:00',
              read: true
            },
            {
              id: 'msg-13',
              sender: 'client',
              text: 'Thank you for the quick and professional work! Everything looks great.',
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
          'client-4': [
            {
              id: 'msg-15',
              sender: 'provider',
              text: 'Hi David, I\'m following up on your request for a water heater replacement. I\'ve scheduled the installation for November 20th. Does that work for you?',
              timestamp: '2023-11-01T10:30:00',
              read: true
            },
            {
              id: 'msg-16',
              sender: 'client',
              text: 'Yes, that works for me. What time should I expect you?',
              timestamp: '2023-11-01T11:45:00',
              read: true
            },
            {
              id: 'msg-17',
              sender: 'provider',
              text: 'We\'ll be there between 8am and 10am. The installation should take about 3-4 hours.',
              timestamp: '2023-11-01T13:20:00',
              read: true
            },
            {
              id: 'msg-18',
              sender: 'client',
              text: 'Perfect. I\'ll make sure to be home.',
              timestamp: '2023-11-01T14:05:00',
              read: true
            }
          ],
          'client-5': [
            {
              id: 'msg-19',
              sender: 'provider',
              text: 'Hi Jennifer, I wanted to update you on the pipe repair. We\'re still waiting for the special part to arrive. It should be here by next week.',
              timestamp: '2023-10-18T11:45:00',
              read: true
            },
            {
              id: 'msg-20',
              sender: 'client',
              text: 'Thanks for the update. Is there anything we can do in the meantime?',
              timestamp: '2023-10-18T13:30:00',
              read: true
            },
            {
              id: 'msg-21',
              sender: 'provider',
              text: 'I\'d recommend keeping a bucket under the pipe to catch any drips, and try to minimize use of that sink if possible. I\'ll let you know as soon as the part arrives.',
              timestamp: '2023-10-18T14:15:00',
              read: true
            },
            {
              id: 'msg-22',
              sender: 'client',
              text: 'Will do. Thanks for your help!',
              timestamp: '2023-10-18T14:30:00',
              read: true
            }
          ]
        };
        
        setClients(mockClients);
        setConversations(mockConversations);
        
        // If client ID was passed in URL, select that client
        if (initialClientId) {
          setSelectedClientId(initialClientId);
        } else if (mockClients.length > 0) {
          // Otherwise select the first client with unread messages, or just the first client
          const clientWithUnread = mockClients.find(c => c.unreadCount > 0);
          setSelectedClientId(clientWithUnread ? clientWithUnread.id : mockClients[0].id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [initialClientId]);
  
  useEffect(() => {
    // Scroll to bottom of messages when conversation changes or new message is added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedClientId, conversations]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedClientId) return;
    
    // Add new message to conversation
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'provider',
      text: message,
      timestamp: new Date().toISOString(),
      read: true
    };
    
    setConversations(prev => ({
      ...prev,
      [selectedClientId]: [...(prev[selectedClientId] || []), newMessage]
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
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const selectedClient = clients.find(c => c.id === selectedClientId);
  const currentConversation = selectedClientId ? conversations[selectedClientId] || [] : [];
  
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
            Communicate with your clients
          </p>
        </div>
      </div>
      
      {/* Messages Interface */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="flex h-[calc(80vh-8rem)]">
          {/* Clients List */}
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
                  placeholder="Search clients"
                />
              </div>
            </div>
            
            {/* Clients */}
            <div className="flex-1 overflow-y-auto">
              {filteredClients.length === 0 ? (
                <div className="py-8 text-center">
                  <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search terms
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <li 
                      key={client.id}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedClientId === client.id ? 'bg-gray-50' : ''}`}
                      onClick={() => setSelectedClientId(client.id)}
                    >
                      <div className="px-4 py-4 sm:px-6 flex items-center">
                        <div className="relative flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-full object-cover"
                            src={client.avatar}
                            alt={client.name}
                          />
                          {client.online && (
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                          )}
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">{client.name}</p>
                            {client.unreadCount > 0 && (
                              <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                                {client.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{client.address}</p>
                          <p className="text-xs text-gray-400 truncate">
                            {client.online ? 'Online' : formatLastSeen(client.lastSeen)}
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
            {selectedClient ? (
              <>
                {/* Client Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={selectedClient.avatar}
                        alt={selectedClient.name}
                      />
                      {selectedClient.online && (
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{selectedClient.name}</p>
                      <p className="text-xs text-gray-500">
                        {selectedClient.online ? 'Online' : formatLastSeen(selectedClient.lastSeen)}
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
                        Start the conversation with {selectedClient.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentConversation.map((msg, index) => {
                        const isProvider = msg.sender === 'provider';
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
                            <div className={`flex ${isProvider ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                                isProvider 
                                  ? 'bg-primary-600 text-white rounded-br-none' 
                                  : 'bg-white text-gray-900 rounded-bl-none shadow'
                              }`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 text-right ${
                                  isProvider ? 'text-primary-100' : 'text-gray-500'
                                }`}>
                                  {formatTimestamp(msg.timestamp)}
                                  {isProvider && (
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
                      placeholder={`Message ${selectedClient.name}...`}
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
                  Choose a client from the list to start messaging
                </p>
              </div>
            )}
          </div>
          
          {/* Mobile: Show selected conversation or prompt to select */}
          <div className="flex flex-col flex-1 sm:hidden">
            {selectedClient ? (
              <>
                {/* Client Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setSelectedClientId(null)}
                      className="mr-2 text-gray-400 hover:text-gray-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="relative flex-shrink-0">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={selectedClient.avatar}
                        alt={selectedClient.name}
                      />
                      {selectedClient.online && (
                        <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white"></span>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{selectedClient.name}</p>
                      <p className="text-xs text-gray-500">
                        {selectedClient.online ? 'Online' : formatLastSeen(selectedClient.lastSeen)}
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
                        Start the conversation with {selectedClient.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentConversation.map((msg, index) => {
                        const isProvider = msg.sender === 'provider';
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
                            <div className={`flex ${isProvider ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs px-4 py-2 rounded-lg ${
                                isProvider 
                                  ? 'bg-primary-600 text-white rounded-br-none' 
                                  : 'bg-white text-gray-900 rounded-bl-none shadow'
                              }`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 text-right ${
                                  isProvider ? 'text-primary-100' : 'text-gray-500'
                                }`}>
                                  {formatTimestamp(msg.timestamp)}
                                  {isProvider && (
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
