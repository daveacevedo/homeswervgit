import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AIConciergeService } from '../../lib/ai';
import { useError } from '../../contexts/ErrorContext';
import { safelyAccessData } from '../../utils/errorHandling';

const ConversationView = () => {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const { addError } = useError();

  // Fetch conversation and messages
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setLoading(true);
        if (!conversationId) {
          setMessages([]);
          setConversation(null);
          return;
        }
        
        const data = await AIConciergeService.getConversationById(conversationId);
        setConversation(data);
        setMessages(safelyAccessData(data, 'messages', []));
      } catch (error) {
        addError(error, { location: 'ConversationView.fetchConversation', conversationId });
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId, addError]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const response = await AIConciergeService.sendMessage(conversationId, newMessage);
      
      // Refresh messages
      const updatedConversation = await AIConciergeService.getConversationById(conversationId);
      setMessages(safelyAccessData(updatedConversation, 'messages', []));
      
      setNewMessage('');
    } catch (error) {
      addError(error, { location: 'ConversationView.handleSendMessage', conversationId });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!conversation && !loading) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-gray-700">Conversation not found</h2>
        <p className="text-gray-500 mt-2">The conversation you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-xl font-semibold">{safelyAccessData(conversation, 'title', 'Conversation')}</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <p>No messages yet. Start the conversation by sending a message below.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3/4 p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sending}
          />
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded-r-lg ${
              sending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationView;
