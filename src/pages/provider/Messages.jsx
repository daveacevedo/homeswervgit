import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function Messages() {
  const { user, providerProfile } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef(null)
  
  useEffect(() => {
    if (providerProfile) {
      fetchConversations()
    }
  }, [providerProfile])
  
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id)
      
      // Subscribe to new messages
      const subscription = supabase
        .channel(`conversation:${activeConversation.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConversation.id}`
        }, (payload) => {
          setMessages(current => [...current, payload.new])
        })
        .subscribe()
      
      return () => {
        supabase.removeChannel(subscription)
      }
    }
  }, [activeConversation])
  
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
          homeowner:homeowner_id (
            id,
            first_name,
            last_name,
            email
          ),
          provider:provider_id (
            id,
            business_name,
            contact_name,
            email
          ),
          project:project_id (
            id,
            title
          ),
          messages (
            id,
            created_at,
            content
          )
        `)
        .eq('provider_id', providerProfile.id)
        .order('updated_at', { ascending: false })
      
      if (error) throw error
      
      setConversations(data || [])
      
      // Set first conversation as active if there are any
      if (data && data.length > 0 && !activeConversation) {
        setActiveConversation(data[0])
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchMessages = async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (
            id,
            email
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      
      setMessages(data || [])
      
      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('sender_id', 'not.eq', user.id)
        .eq('is_read', false)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }
  
  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !activeConversation) return
    
    try {
      setSendingMessage(true)
      
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: activeConversation.id,
            sender_id: user.id,
            content: newMessage.trim(),
            is_read: false
          }
        ])
        .select()
      
      if (error) throw error
      
      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', activeConversation.id)
      
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSendingMessage(false)
    }
  }
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }
  
  const getLastMessage = (conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return 'No messages yet'
    }
    
    const lastMessage = conversation.messages[conversation.messages.length - 1]
    return lastMessage.content.length > 30
      ? `${lastMessage.content.substring(0, 30)}...`
      : lastMessage.content
  }
  
  const getUnreadCount = (conversation) => {
    if (!conversation.messages) return 0
    
    return conversation.messages.filter(
      message => !message.is_read && message.sender_id !== user.id
    ).length
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
          Communicate with homeowners about their projects.
        </p>
      </div>
      
      <div className="bg-white shadow sm:rounded-lg">
        <div className="h-[calc(100vh-250px)] flex">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Conversations</h2>
            </div>
            
            {conversations.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {conversations.map((conversation) => (
                  <li
                    key={conversation.id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      activeConversation?.id === conversation.id ? 'bg-gray-50' : ''
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="px-4 py-4">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {conversation.homeowner?.first_name} {conversation.homeowner?.last_name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(conversation.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        {conversation.project?.title || 'No project'}
                      </p>
                      <div className="mt-2 flex justify-between">
                        <p className="text-sm text-gray-500 truncate">
                          {getLastMessage(conversation)}
                        </p>
                        {getUnreadCount(conversation) > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {getUnreadCount(conversation)}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500">No conversations yet.</p>
              </div>
            )}
          </div>
          
          {/* Messages */}
          <div className="w-2/3 flex flex-col">
            {activeConversation ? (
              <>
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        {activeConversation.homeowner?.first_name} {activeConversation.homeowner?.last_name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {activeConversation.project?.title || 'No project'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === user.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                              message.sender_id === user.id
                                ? 'bg-primary-100 text-primary-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="mt-1 text-xs text-gray-500">
                              {formatDate(message.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </div>
                
                <div className="px-4 py-3 border-t border-gray-200">
                  <form onSubmit={handleSendMessage}>
                    <div className="flex">
                      <input
                        type="text"
                        name="message"
                        id="message"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sendingMessage}
                      />
                      <button
                        type="submit"
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        disabled={!newMessage.trim() || sendingMessage}
                      >
                        {sendingMessage ? (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          'Send'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Select a conversation to view messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages
