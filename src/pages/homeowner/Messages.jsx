import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const HomeownerMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch conversations from your database
      // For demo purposes, we'll use mock data
      
      // Mock conversations data
      const mockConversations = [
        {
          id: 1,
          provider: {
            id: 101,
            name: 'Michael Brown',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            company: 'Elite Home Renovations'
          },
          lastMessage: {
            text: 'I can come by on Friday at 2 PM to look at your kitchen.',
            timestamp: new Date(2023, 4, 10, 14, 30),
            isRead: true,
            sender: 'provider'
          },
          project: 'Kitchen Renovation',
          unreadCount: 0
        },
        {
          id: 2,
          provider: {
            id: 102,
            name: 'Jennifer Garcia',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            company: 'Perfect Painting Services'
          },
          lastMessage: {
            text: 'I have availability next week for your painting project.',
            timestamp: new Date(2023, 4, 9, 10, 15),
            isRead: false,
            sender: 'provider'
          },
          project: 'Interior Painting',
          unreadCount: 2
        },
        {
          id: 3,
          provider: {
            id: 103,
            name: 'Robert Martinez',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            company: 'Martinez Electrical'
          },
          lastMessage: {
            text: 'The electrical work in your home office is complete. All outlets are now working properly.',
            timestamp: new Date(2023, 4, 8, 16, 45),
            isRead: true,
            sender: 'provider'
          },
          project: 'Electrical Work',
          unreadCount: 0
        },
        {
          id: 4,
          provider: {
            id: 104,
            name: 'Lisa Anderson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            company: 'Green Thumb Landscaping'
          },
          lastMessage: {
            text: 'I\'ve prepared a design proposal for your front yard landscaping project.',
            timestamp: new Date(2023, 4, 7, 11, 30),
            isRead: true,
            sender: 'provider'
          },
          project: 'Landscaping',
          unreadCount: 0
        }
      ];
      
      setConversations(mockConversations);
      
      // Select the first conversation by default
      if (mockConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(mockConversations[0]);
      }
      
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      // In a real app, you would fetch messages from your database
      // For demo purposes, we'll use mock data
      
      // Mock messages data
      const mockMessages = {
        1: [
          {
            id: 1,
            text: 'Hi, I\'m interested in renovating my kitchen. Do you offer free consultations?',
            timestamp: new Date(2023, 4, 9, 9, 30),
            sender: 'homeowner'
          },
          {
            id: 2,
            text: 'Yes, we do offer free consultations. I\'d be happy to come take a look at your kitchen and discuss your renovation ideas.',
            timestamp: new Date(2023, 4, 9, 10, 15),
            sender: 'provider'
          },
          {
            id: 3,
            text: 'Great! When would you be available?',
            timestamp: new Date(2023, 4, 9, 10, 45),
            sender: 'homeowner'
          },
          {
            id: 4,
            text: 'I have availability this Thursday or Friday afternoon. Would either of those work for you?',
            timestamp: new Date(2023, 4, 9, 11, 30),
            sender: 'provider'
          },
          {
            id: 5,
            text: 'Friday afternoon would work well. How about 2 PM?',
            timestamp: new Date(2023, 4, 9, 14, 0),
            sender: 'homeowner'
          },
          {
            id: 6,
            text: '2 PM on Friday works for me. I\'ll put it on my calendar. Could you please provide your address?',
            timestamp: new Date(2023, 4, 9, 14, 45),
            sender: 'provider'
          },
          {
            id: 7,
            text: '123 Main St, Anytown, CA. Thanks!',
            timestamp: new Date(2023, 4, 9, 15, 30),
            sender: 'homeowner'
          },
          {
            id: 8,
            text: 'I can come by on Friday at 2 PM to look at your kitchen.',
            timestamp: new Date(2023, 4, 10, 14, 30),
            sender: 'provider'
          }
        ],
        2: [
          {
            id: 1,
            text: 'Hello, I\'m looking to get my living room, dining room, and hallway painted. Do you have availability in the next few weeks?',
            timestamp: new Date(2023, 4, 7, 10, 0),
            sender: 'homeowner'
          },
          {
            id: 2,
            text: 'Hi! Yes, I have some availability coming up. What colors are you thinking of using?',
            timestamp: new Date(2023, 4, 7, 11, 30),
            sender: 'provider'
          },
          {
            id: 3,
            text: 'I\'m thinking of a light gray for the living room and hallway, and a sage green for the dining room.',
            timestamp: new Date(2023, 4, 7, 13, 0),
            sender: 'homeowner'
          },
          {
            id: 4,
            text: 'Those colors sound nice. I can provide a quote if you let me know the approximate square footage or dimensions of the rooms.',
            timestamp: new Date(2023, 4, 7, 14, 30),
            sender: 'provider'
          },
          {
            id: 5,
            text: 'The living room is about 15x20, dining room is 12x14, and the hallway is about 30 feet long and 4 feet wide.',
            timestamp: new Date(2023, 4, 7, 15, 45),
            sender: 'homeowner'
          },
          {
            id: 6,
            text: 'Thanks for the information. Based on those dimensions, I estimate it would take about 3-4 days to complete the job. I have availability starting the week after next.',
            timestamp: new Date(2023, 4, 8, 9, 0),
            sender: 'provider'
          },
          {
            id: 7,
            text: 'I was hoping to get it done sooner. Do you have any availability next week?',
            timestamp: new Date(2023, 4, 8, 16, 20),
            sender: 'homeowner'
          },
          {
            id: 8,
            text: 'I have availability next week for your painting project.',
            timestamp: new Date(2023, 4, 9, 10, 15),
            sender: 'provider'
          }
        ],
        3: [
          {
            id: 1,
            text: 'Hi, I need to add some outlets in my home office. Can you help with that?',
            timestamp: new Date(2023, 4, 5, 9, 0),
            sender: 'homeowner'
          },
          {
            id: 2,
            text: 'Hello! Yes, I can help with adding outlets to your home office. How many outlets do you need and where would you like them placed?',
            timestamp: new Date(2023, 4, 5, 10, 30),
            sender: 'provider'
          },
          {
            id: 3,
            text: 'I need 3 new outlets - one on each wall of the office. I\'m currently only using extension cords which isn\'t ideal.',
            timestamp: new Date(2023, 4, 5, 11, 15),
            sender: 'homeowner'
          },
          {
            id: 4,
            text: 'I understand. Using extension cords long-term can be a fire hazard. I can install the new outlets for you. When would be a good time for me to come take a look?',
            timestamp: new Date(2023, 4, 5, 13, 0),
            sender: 'provider'
          },
          {
            id: 5,
            text: 'Would tomorrow afternoon work? I\'m free after 2 PM.',
            timestamp: new Date(2023, 4, 5, 14, 30),
            sender: 'homeowner'
          },
          {
            id: 6,
            text: 'Tomorrow at 3 PM works for me. I\'ll see you then!',
            timestamp: new Date(2023, 4, 5, 15, 0),
            sender: 'provider'
          },
          {
            id: 7,
            text: 'Great, see you at 3 PM. My address is 456 Oak Ave, Somewhere, CA.',
            timestamp: new Date(2023, 4, 5, 15, 30),
            sender: 'homeowner'
          },
          {
            id: 8,
            text: 'The electrical work in your home office is complete. All outlets are now working properly.',
            timestamp: new Date(2023, 4, 8, 16, 45),
            sender: 'provider'
          }
        ],
        4: [
          {
            id: 1,
            text: 'Hello, I\'m interested in redesigning my front yard with new landscaping. Do you offer design services?',
            timestamp: new Date(2023, 4, 5, 13, 0),
            sender: 'homeowner'
          },
          {
            id: 2,
            text: 'Hi! Yes, we offer comprehensive landscape design services. We can create a custom design based on your preferences, budget, and the specific conditions of your yard.',
            timestamp: new Date(2023, 4, 5, 14, 30),
            sender: 'provider'
          },
          {
            id: 3,
            text: 'That sounds great. I\'m looking for a low-maintenance design with native plants and perhaps a small seating area.',
            timestamp: new Date(2023, 4, 5, 15, 0),
            sender: 'homeowner'
          },
          {
            id: 4,
            text: 'Native plants and a seating area would make a beautiful, sustainable front yard. I\'d be happy to create a design proposal for you. Could we schedule a time for me to visit your property and take measurements?',
            timestamp: new Date(2023, 4, 6, 9, 0),
            sender: 'provider'
          },
          {
            id: 5,
            text: 'Yes, that would be helpful. How about this Saturday morning?',
            timestamp: new Date(2023, 4, 6, 10, 30),
            sender: 'homeowner'
          },
          {
            id: 6,
            text: 'Saturday morning works for me. How about 10 AM?',
            timestamp: new Date(2023, 4, 6, 11, 15),
            sender: 'provider'
          },
          {
            id: 7,
            text: '10 AM on Saturday is perfect. My address is 505 Spruce Ct, Somewhere, CA.',
            timestamp: new Date(2023, 4, 6, 13, 45),
            sender: 'homeowner'
          },
          {
            id: 8,
            text: 'I\'ve prepared a design proposal for your front yard landscaping project.',
            timestamp: new Date(2023, 4, 7, 11, 30),
            sender: 'provider'
          }
        ]
      };
      
      setMessages(mockMessages[conversationId] || []);
      
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;
    
    // In a real app, you would save the message to your database
    // For demo purposes, we'll just add it to the local state
    
    const newMessageObj = {
      id: messages.length + 1,
      text: newMessage,
      timestamp: new Date(),
      sender: 'homeowner'
    };
    
    setMessages([...messages, newMessageObj]);
    
    // Update the conversation with the new last message
    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id
        ? {
            ...conv,
            lastMessage: {
              text: newMessage,
              timestamp: new Date(),
              isRead: true,
              sender: 'homeowner'
            }
          }
        : conv
    ));
    
    setNewMessage('');
  };

  // Format timestamp
  const formatMessageTime = (timestamp) => {
    return format(timestamp, 'h:mm a');
  };
  
  const formatConversationTime = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    // If the message is from today, show the time
    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, 'h:mm a');
    }
    
    // If the message is from this week, show the day
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return format(messageDate, 'EEEE');
    }
    
    // Otherwise, show the date
    return format(messageDate, 'MMM d');
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => 
    conv.provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.provider.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="flex h-[calc(100vh-200px)]">
            {/* Conversation list */}
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search conversations"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-y-auto h-full pb-20">
                <ul className="divide-y divide-gray-200">
                  {filteredConversations.map((conversation) => (
                    <li
                      key={conversation.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 relative">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={conversation.provider.avatar}
                                alt={conversation.provider.name}
                              />
                              {conversation.unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <h3 className="text-sm font-medium text-gray-900">{conversation.provider.name}</h3>
                                <span className="ml-2 text-xs text-gray-500">
                                  {formatConversationTime(conversation.lastMessage.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 truncate">{conversation.provider.company}</p>
                              <p className="text-xs text-gray-500 truncate">{conversation.project}</p>
                              <p className={`text-sm truncate ${
                                conversation.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'
                              }`}>
                                {conversation.lastMessage.sender === 'homeowner' ? 'You: ' : ''}
                                {conversation.lastMessage.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Message area */}
            <div className="w-2/3 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Conversation header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={selectedConversation.provider.avatar}
                        alt={selectedConversation.provider.name}
                      />
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">{selectedConversation.provider.name}</h3>
                        <p className="text-sm text-gray-500">{selectedConversation.provider.company}</p>
                        <p className="text-xs text-gray-500">{selectedConversation.project}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <EllipsisHorizontalIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'homeowner' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.sender === 'provider' && (
                            <img
                              className="h-8 w-8 rounded-full mr-2 self-end"
                              src={selectedConversation.provider.avatar}
                              alt={selectedConversation.provider.name}
                            />
                          )}
                          <div
                            className={`rounded-lg px-4 py-2 max-w-xs sm:max-w-md ${
                              message.sender === 'homeowner'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p
                              className={`text-xs mt-1 text-right ${
                                message.sender === 'homeowner' ? 'text-blue-200' : 'text-gray-500'
                              }`}
                            >
                              {formatMessageTime(message.timestamp)}
                            </p>
                          </div>
                          {message.sender === 'homeowner' && (
                            <img
                              className="h-8 w-8 rounded-full ml-2 self-end"
                              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              alt="You"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Message input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                      <button
                        type="button"
                        className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <input
                        type="text"
                        className="block w-full mx-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">No conversation selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select a conversation from the list to view messages.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeownerMessages;
