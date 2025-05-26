import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AIConciergeService } from '../../lib/ai';
import { useError } from '../../contexts/ErrorContext';
import { safelyAccessData } from '../../utils/errorHandling';

const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { addError } = useError();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await AIConciergeService.getConversations();
        setConversations(data || []);
      } catch (error) {
        addError(error, { location: 'ConversationsList.fetchConversations' });
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [addError]);

  const handleCreateConversation = async () => {
    try {
      setCreating(true);
      const newConversation = await AIConciergeService.createConversation({
        title: 'New Conversation'
      });
      
      // Navigate to the new conversation
      if (newConversation && newConversation.id) {
        navigate(`/ai/conversations/${newConversation.id}`);
      }
    } catch (error) {
      addError(error, { location: 'ConversationsList.handleCreateConversation' });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Your Conversations</h1>
        <button
          onClick={handleCreateConversation}
          disabled={creating}
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
            creating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {creating ? 'Creating...' : 'New Conversation'}
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">No conversations yet</h2>
          <p className="text-gray-500 mt-2">Start a new conversation with your AI Concierge.</p>
          <button
            onClick={handleCreateConversation}
            disabled={creating}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {creating ? 'Creating...' : 'Start Conversation'}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              to={`/ai/conversations/${conversation.id}`}
              className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold text-lg truncate">{conversation.title}</h2>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(conversation.updated_at || conversation.created_at).toLocaleDateString()}
              </p>
              <div className="mt-2 text-sm text-gray-600">
                {conversation.project_id ? (
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Project Linked
                  </span>
                ) : (
                  <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    General
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationsList;
