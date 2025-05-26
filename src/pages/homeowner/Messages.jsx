import React, { useState } from 'react';

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  
  const conversations = [
    {
      id: 1,
      provider: {
        id: 101,
        name: 'Elite Cabinets',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
        online: true
      },
      unread: 2,
      lastMessage: {
        text: 'I can come by tomorrow at 2pm to measure your kitchen cabinets.',
        time: '10:42 AM',
        isRead: false
      },
      messages: [
        {
          id: 1,
          sender: 'provider',
          text: 'Hello! Thanks for reaching out about your kitchen renovation project.',
          time: 'Yesterday, 4:30 PM',
          isRead: true
        },
        {
          id: 2,
          sender: 'user',
          text: 'Hi there! I\'m interested in getting new cabinets installed. Do you have availability in the next couple of weeks?',
          time: 'Yesterday, 5:15 PM',
          isRead: true
        },
        {
          id: 3,
          sender: 'provider',
          text: 'Yes, we do have some openings. I\'d need to come by and take measurements first. Would you be available for an in-home consultation?',
          time: 'Yesterday, 5:45 PM',
          isRead: true
        },
        {
          id: 4,
          sender: 'user',
          text: 'That sounds great. When would you be able to come by?',
          time: 'Today, 9:30 AM',
          isRead: true
        },
        {
          id: 5,
          sender: 'provider',
          text: 'I can come by tomorrow at 2pm to measure your kitchen cabinets.',
          time: '10:42 AM',
          isRead: false
        }
      ]
    },
    {
      id: 2,
      provider: {
        id: 102,
        name: 'Modern Plumbing',
        avatar: 'https://images.pexels.com/photos/8486972/pexels-photo-8486972.jpeg?auto=compress&cs=tinysrgb&w=100',
        online: false
      },
      unread: 0,
      lastMessage: {
        text: 'The parts have arrived. I can schedule the installation for next Tuesday.',
        time: 'Yesterday',
        isRead: true
      },
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'Hi, I need to replace my bathroom faucet. Do you provide and install new fixtures?',
          time: '3 days ago, 2:15 PM',
          isRead: true
        },
        {
          id: 2,
          sender: 'provider',
          text: 'Hello! Yes, we do provide and install bathroom fixtures. Do you have a specific style in mind?',
          time: '3 days ago, 3:30 PM',
          isRead: true
        },
        {
          id: 3,
          sender: 'user',
          text: 'I\'m looking for something modern with a brushed nickel finish. Do you have any recommendations?',
          time: '2 days ago, 10:20 AM',
          isRead: true
        },
        {
          id: 4,
          sender: 'provider',
          text: 'We have several options that would work well. I\'ll need to order the parts. It should take about 3-5 days to arrive.',
          time: '2 days ago, 11:45 AM',
          isRead: true
        },
        {
          id: 5,
          sender: 'provider',
          text: 'The parts have arrived. I can schedule the installation for next Tuesday.',
          time: 'Yesterday, 4:30 PM',
          isRead: true
        }
      ]
    },
    {
      id: 3,
      provider: {
        id: 103,
        name: 'Luxury Baths',
        avatar: 'https://images.pexels.com/photos/6585758/pexels-photo-6585758.jpeg?auto=compress&cs=tinysrgb&w=100',
        online: true
      },
      unread: 0,
      lastMessage: {
        text: 'I\'ve attached the quote for your bathroom remodel. Let me know if you have any questions!',
        time: 'Monday',
        isRead: true
      },
      messages: [
        {
          id: 1,
          sender: 'provider',
          text: 'Hello! I understand you\'re interested in a bathroom remodel. How can we help?',
          time: 'Monday, 9:15 AM',
          isRead: true
        },
        {
          id: 2,
          sender: 'user',
          text: 'Yes, I\'d like to completely renovate my master bathroom. Can you provide a quote?',
          time: 'Monday, 10:30 AM',
          isRead: true
        },
        {
          id: 3,
          sender: 'provider',
          text: 'I\'ve attached the quote for your bathroom remodel. Let me know if you have any questions!',
          time: 'Monday, 3:45 PM',
          isRead: true
        }
      ]
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    // In a real app, you would send this to your backend
    console.log('Sending message:', newMessage);
    
    // Clear the input
    setNewMessage('');
  };

  const currentConversation = conversations.find(conv => conv.id === activeConversation);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex h-[calc(100vh-250px)]">
          {/* Conversation list */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search messages"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-2.5">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <li 
                  key={conversation.id}
                  className={`hover:bg-gray-50 cursor-pointer ${activeConversation === conversation.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="relative px-4 py-4">
                    <div className="flex items-start">
                      <div className="relative flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-full" 
                          src={conversation.provider.avatar} 
                          alt={conversation.provider.name} 
                        />
                        {conversation.provider.online && (
                          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{conversation.provider.name}</p>
                          <p className="text-xs text-gray-500">{conversation.lastMessage.time}</p>
                        </div>
                        <p className={`text-sm ${conversation.unread > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'} line-clamp-1`}>
                          {conversation.lastMessage.text}
                        </p>
                      </div>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-xs font-medium text-white">
                          {conversation.unread}
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Message area */}
          <div className="w-2/3 flex flex-col">
            {currentConversation ? (
              <>
                {/* Conversation header */}
                <div className="p-4 border-b border-gray-200 flex items-center">
                  <div className="relative flex-shrink-0">
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={currentConversation.provider.avatar} 
                      alt={currentConversation.provider.name} 
                    />
                    {currentConversation.provider.online && (
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{currentConversation.provider.name}</p>
                    <p className="text-xs text-gray-500">
                      {currentConversation.provider.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                  <div className="ml-auto flex space-x-2">
                    <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {currentConversation.messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Message input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-center">
                    <button 
                      type="button"
                      className="p-2 rounded-full text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      type="button"
                      className="p-2 rounded-full text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message"
                      className="flex-1 mx-4 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a conversation to start messaging.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
