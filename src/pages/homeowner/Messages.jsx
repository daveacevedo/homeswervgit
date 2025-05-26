import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  
  useEffect(() => {
    if (user) {
      fetchConversations()
      
      // Subscribe to new messages
      const messagesSubscription = supabase
        .from('messages')
        .on('INSERT', payload => {
          if (payload.new.conversation_id === selectedConversation?.id) {
            setMessages(prevMessages => [...prevMessages, payload.new])
          } else if (payload.new.receiver_id === user.id) {
            // Refresh conversations to update unread count
            fetchConversations()
          }
        })
        .subscribe()
      
      return () => {
        supabase.removeSubscription(messagesSubscription)
      }
    }
  }, [user, selectedConversation])
  
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
      markConversationAsRead(selectedConversation.id)
    }
  }, [selectedConversation])
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const fetchConversations = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          homeowners!conversations_homeowner_id_fkey (
            first_name,
            last_name
          ),
          service_providers!conversations_provider_id_fkey (
            business_name,
            logo_url
          ),
          estimate_requests (
            title
          )
        `)
        .or(`homeowner_id.eq.${user.id},provider_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false })
      
      if (error) throw error
      
      // Get unread message counts for each conversation
      const conversationsWithUnread = await Promise.all(
        data.map(async (conversation) => {
          const { count, error: countError } = await supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('conversation_id', conversation.id)
            .eq('receiver_id', user.id)
            .eq('read', false)
          
          if (countError) throw countError
          
          return {
            ...conversation,
            unreadCount: count || 0
          }
        })
      )
      
      setConversations(conversationsWithUnread)
      
      // Select first conversation if none selected
      if (!selectedConversation && conversationsWithUnread.length > 0) {
        setSelectedConversation(conversationsWithUnread[0])
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      setError('Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }
  
  const fetchMessages = async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      setError('Failed to load messages')
    }
  }
  
  const markConversationAsRead = async (conversationId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', user.id)
        .eq('read', false)
      
      if (error) throw error
      
      // Update unread count in conversations list
      setConversations(conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 }
        }
        return conv
      }))
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }
  
  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !selectedConversation) return
    
    try {
      setSendingMessage(true)
      
      // Determine receiver ID
      const receiverId = selectedConversation.homeowner_id === user.id
        ? selectedConversation.provider_id
        : selectedConversation.homeowner_id
      
      // Send message
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: selectedConversation.id,
            sender_id: user.id,
            receiver_id: receiverId,
            content: newMessage,
            read: false
          }
        ])
      
      if (error) throw error
      
      // Update conversation last_message_at
      const { error: updateError } = await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id)
      
      if (updateError) throw updateError
      
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to send message')
    } finally {
      setSendingMessage(false)
    }
  }
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  const formatConversationDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }
  
  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">
          Communicate with service providers about your projects.
        </p>
      </div>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {conversations.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="flex h-[calc(100vh-16rem)]">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {conversations.map((conversation) => {
                  const isHomeowner = user.id === conversation.homeowner_id
                  const otherPartyName = isHomeowner
                    ? conversation.service_providers?.business_name
                    : `${conversation.homeowners?.first_name} ${conversation.homeowners?.last_name}`
                  
                  return (
                    <li
                      key={conversation.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              {isHomeowner ? (
                                conversation.service_providers?.logo_url ? (
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={conversation.service_providers.logo_url}
                                    alt={conversation.service_providers.business_name}
                                  />
                                ) : (
                                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                )
                              ) : (
                                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="flex items-center">
                                <p className={`text-sm font-medium ${
                                  conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {otherPartyName}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                    {conversation.unreadCount}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 truncate">
                                {conversation.estimate_requests?.title || 'General conversation'}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatConversationDate(conversation.last_message_at)}
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            
            {/* Messages */}
            <div className="w-2/3 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {user.id === selectedConversation.homeowner_id ? (
                        selectedConversation.service_providers?.logo_url ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={selectedConversation.service_providers.logo_url}
                            alt={selectedConversation.service_providers.business_name}
                          />
                        ) : (
                          <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )
                      ) : (
                        <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user.id === selectedConversation.homeowner_id
                          ? selectedConversation.service_providers?.business_name
                          : `${selectedConversation.homeowners?.first_name} ${selectedConversation.homeowners?.last_name}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.estimate_requests?.title || 'General conversation'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Messages List */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    {messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isCurrentUser = message.sender_id === user.id
                          
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                                  isCurrentUser
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 text-right ${
                                  isCurrentUser ? 'text-primary-100' : 'text-gray-500'
                                }`}>
                                  {formatDate(message.created_at)}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4">
                    <form onSubmit={handleSendMessage} className="flex">
                      <input
                        type="text"
                        className="flex-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sendingMessage}
                      />
                      <button
                        type="submit"
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        disabled={!newMessage.trim() || sendingMessage}
                      >
                        {sendingMessage ? (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                          </svg>
                        )}
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select a conversation from the list to view messages.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any conversations yet. Request an estimate from a service provider to start a conversation.
            </p>
            <div className="mt-6">
              <a
                href="/homeowner/find-providers"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Find Service Providers
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Messages
