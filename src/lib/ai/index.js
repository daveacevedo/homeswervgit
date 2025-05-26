import { supabase } from '../supabase';

/**
 * AI Concierge service for managing AI conversations and suggestions
 */
export const AIConciergeService = {
  /**
   * Get all conversations for the current user
   * @returns {Promise<Array>} List of conversations
   */
  async getConversations() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Get a specific conversation by ID
   * @param {string} id - Conversation ID
   * @returns {Promise<Object>} Conversation with messages
   */
  async getConversationById(id) {
    const { data: conversation, error: convError } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (convError) {
      console.error(`Error fetching conversation ${id}:`, convError);
      throw convError;
    }
    
    const { data: messages, error: msgError } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });
    
    if (msgError) {
      console.error(`Error fetching messages for conversation ${id}:`, msgError);
      throw msgError;
    }
    
    return {
      ...conversation,
      messages: messages || []
    };
  },
  
  /**
   * Create a new conversation
   * @param {Object} conversationData - Conversation details
   * @returns {Promise<Object>} Created conversation
   */
  async createConversation(conversationData = {}) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: user.id,
        project_id: conversationData.projectId || null,
        title: conversationData.title || 'New Conversation'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Add a message to a conversation
   * @param {string} conversationId - Conversation ID
   * @param {Object} messageData - Message details
   * @returns {Promise<Object>} Created message
   */
  async addMessage(conversationId, messageData) {
    const { data, error } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        role: messageData.role,
        content: messageData.content
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Error adding message to conversation ${conversationId}:`, error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Send a message to the AI and get a response
   * @param {string} conversationId - Conversation ID
   * @param {string} message - User message
   * @returns {Promise<Object>} AI response
   */
  async sendMessage(conversationId, message) {
    // 1. Add the user message to the conversation
    await this.addMessage(conversationId, {
      role: 'user',
      content: message
    });
    
    // 2. In a real app, this would call an AI service like OpenAI
    // For now, we'll simulate a response
    const aiResponse = await this.simulateAIResponse(message);
    
    // 3. Add the AI response to the conversation
    const responseMessage = await this.addMessage(conversationId, {
      role: 'assistant',
      content: aiResponse.content
    });
    
    // 4. If the AI generated any suggestions, save them
    if (aiResponse.suggestions && aiResponse.suggestions.length > 0) {
      const { data: { user } } = await supabase.auth.getUser();
      
      for (const suggestion of aiResponse.suggestions) {
        await supabase
          .from('ai_suggestions')
          .insert({
            user_id: user.id,
            conversation_id: conversationId,
            project_id: suggestion.projectId || null,
            suggestion_type: suggestion.type,
            content: suggestion.content
          });
      }
    }
    
    return responseMessage;
  },
  
  /**
   * Simulate an AI response (in a real app, this would call an AI service)
   * @param {string} userMessage - User message
   * @returns {Promise<Object>} Simulated AI response
   */
  async simulateAIResponse(userMessage) {
    // Simple response logic based on keywords in the user message
    const lowerMessage = userMessage.toLowerCase();
    let content = '';
    let suggestions = [];
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      content = "Hello! I'm your Project Concierge. How can I help with your home project today?";
    } else if (lowerMessage.includes('kitchen') || lowerMessage.includes('remodel')) {
      content = "Kitchen remodels are exciting projects! The average cost for a kitchen remodel ranges from $15,000 to $50,000 depending on the scope. Would you like me to help you plan your kitchen remodel step by step?";
      
      suggestions.push({
        type: 'timeline',
        content: {
          title: 'Kitchen Remodel Timeline',
          steps: [
            { name: 'Planning & Design', duration: '2-4 weeks' },
            { name: 'Demolition', duration: '1 week' },
            { name: 'Plumbing & Electrical', duration: '1-2 weeks' },
            { name: 'Cabinets & Countertops', duration: '2-3 weeks' },
            { name: 'Flooring & Backsplash', duration: '1-2 weeks' },
            { name: 'Appliance Installation', duration: '1 week' },
            { name: 'Final Touches', duration: '1 week' }
          ]
        }
      });
    } else if (lowerMessage.includes('bathroom')) {
      content = "Bathroom renovations can transform your home! Depending on the size and quality of fixtures, bathroom remodels typically cost between $10,000 and $30,000. What specific aspects of your bathroom are you looking to update?";
    } else if (lowerMessage.includes('contractor') || lowerMessage.includes('provider')) {
      content = "Finding the right contractor is crucial for your project's success. I can help you find top-rated providers in your area. What type of service are you looking for, and what's your location?";
      
      suggestions.push({
        type: 'provider',
        content: {
          title: 'Recommended Contractors',
          providers: [
            { name: 'Quality Home Builders', rating: 4.8, specialties: ['Kitchen', 'Bathroom', 'Additions'] },
            { name: 'Modern Renovations', rating: 4.7, specialties: ['Kitchen', 'Bathroom', 'Whole House'] },
            { name: 'Precision Contractors', rating: 4.9, specialties: ['Custom Work', 'Historic Homes'] }
          ]
        }
      });
    } else if (lowerMessage.includes('budget') || lowerMessage.includes('cost')) {
      content = "Budgeting is a smart first step! To give you accurate cost estimates, I'll need to know more about your project. What type of project are you planning, and what's your approximate square footage?";
    } else if (lowerMessage.includes('permit') || lowerMessage.includes('regulation')) {
      content = "Permits are often required for home improvement projects. Requirements vary by location, but generally, structural changes, electrical work, plumbing, and additions require permits. Would you like me to provide more specific information based on your location?";
    } else {
      content = "I'm here to help with all aspects of your home project! I can assist with planning, budgeting, finding contractors, creating timelines, and answering questions about materials or permits. What specific aspect of your project would you like guidance on?";
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      content,
      suggestions
    };
  },
  
  /**
   * Get suggestions for the current user
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of suggestions
   */
  async getUserSuggestions(options = {}) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    let query = supabase
      .from('ai_suggestions')
      .select('*')
      .eq('user_id', user.id);
    
    if (options.projectId) {
      query = query.eq('project_id', options.projectId);
    }
    
    if (options.type) {
      query = query.eq('suggestion_type', options.type);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user suggestions:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Mark a suggestion as applied
   * @param {string} id - Suggestion ID
   * @returns {Promise<Object>} Updated suggestion
   */
  async applySuggestion(id) {
    const { data, error } = await supabase
      .from('ai_suggestions')
      .update({ is_applied: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error applying suggestion ${id}:`, error);
      throw error;
    }
    
    return data;
  }
};
