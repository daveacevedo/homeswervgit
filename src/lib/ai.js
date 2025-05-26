import { supabase } from './supabase';
import { logError, safelyAccessData } from '../utils/errorHandling';

export class AIConciergeService {
  /**
   * Get all conversations for the current user
   */
  static async getConversations() {
    try {
      const { data } = await supabase.auth.getUser();
      const user = safelyAccessData(data, 'user');
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data: conversations, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return conversations || [];
    } catch (error) {
      logError(error, { location: 'AIConciergeService.getConversations' });
      return [];
    }
  }
  
  /**
   * Create a new conversation
   */
  static async createConversation(conversationData = {}) {
    try {
      const { data } = await supabase.auth.getUser();
      const user = safelyAccessData(data, 'user');
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data: conversation, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          title: conversationData.title || 'New Conversation',
          project_id: conversationData.project_id || null
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return conversation;
    } catch (error) {
      logError(error, { location: 'AIConciergeService.createConversation' });
      throw error;
    }
  }
  
  /**
   * Get a conversation by ID with its messages
   */
  static async getConversationById(conversationId) {
    try {
      if (!conversationId) {
        throw new Error('Conversation ID is required');
      }
      
      const { data } = await supabase.auth.getUser();
      const user = safelyAccessData(data, 'user');
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Get the conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single();
      
      if (conversationError) {
        throw conversationError;
      }
      
      // Get the messages for this conversation
      const { data: messages, error: messagesError } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (messagesError) {
        throw messagesError;
      }
      
      return {
        ...conversation,
        messages: messages || []
      };
    } catch (error) {
      logError(error, { location: 'AIConciergeService.getConversationById', conversationId });
      // Return an empty conversation with messages array to prevent reduce errors
      return { messages: [] };
    }
  }
  
  /**
   * Add a message to a conversation
   */
  static async addMessage(conversationId, message) {
    try {
      if (!conversationId) {
        throw new Error('Conversation ID is required');
      }
      
      const { data } = await supabase.auth.getUser();
      const user = safelyAccessData(data, 'user');
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data: messageData, error } = await supabase
        .from('ai_messages')
        .insert({
          conversation_id: conversationId,
          role: message.role || 'user',
          content: message.content || ''
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update the conversation's updated_at timestamp
      await supabase
        .from('ai_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      
      return messageData;
    } catch (error) {
      logError(error, { 
        location: 'AIConciergeService.addMessage', 
        conversationId,
        messageRole: safelyAccessData(message, 'role')
      });
      throw error;
    }
  }
  
  /**
   * Send a message to the AI and get a response
   */
  static async sendMessage(conversationId, messageContent) {
    try {
      if (!conversationId) {
        throw new Error('Conversation ID is required');
      }
      
      if (!messageContent) {
        throw new Error('Message content is required');
      }
      
      const { data } = await supabase.auth.getUser();
      const user = safelyAccessData(data, 'user');
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Add the user message to the database
      const userMessage = await this.addMessage(conversationId, {
        role: 'user',
        content: messageContent
      });
      
      // In a real implementation, this would call an AI service
      // For now, we'll simulate a response
      const aiResponse = this.generateAIResponse(messageContent);
      
      // Add the AI response to the database
      const assistantMessage = await this.addMessage(conversationId, {
        role: 'assistant',
        content: aiResponse
      });
      
      return assistantMessage;
    } catch (error) {
      logError(error, { 
        location: 'AIConciergeService.sendMessage',
        conversationId
      });
      throw error;
    }
  }
  
  /**
   * Generate a simple AI response (placeholder for actual AI integration)
   */
  static generateAIResponse(userMessage = '') {
    // This is a simple placeholder. In a real implementation,
    // this would call an actual AI service like OpenAI's API
    
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return "Hello! I'm your Home Concierge. How can I help with your home project today?";
    }
    
    if (lowerCaseMessage.includes('kitchen')) {
      return "Kitchen renovations are exciting! Are you thinking about a full remodel or updating specific elements like cabinets or countertops? I can help you plan this project and connect you with qualified professionals.";
    }
    
    if (lowerCaseMessage.includes('bathroom')) {
      return "Bathroom projects can really transform your home! Are you looking for a complete renovation or specific updates? Let me know what you're envisioning, and I can help guide you through the process.";
    }
    
    if (lowerCaseMessage.includes('paint') || lowerCaseMessage.includes('painting')) {
      return "Fresh paint can make a huge difference! Are you painting interior or exterior? Do you have colors in mind, or would you like some suggestions based on current trends?";
    }
    
    if (lowerCaseMessage.includes('cost') || lowerCaseMessage.includes('price') || lowerCaseMessage.includes('budget')) {
      return "Budgeting is an important part of any home project. To give you a better estimate, I'd need to know more details about your project scope, materials, and your location. Would you like to share more specifics?";
    }
    
    if (lowerCaseMessage.includes('vision board')) {
      return "Creating a vision board is a great way to organize your ideas! You can collect inspiration images, color schemes, and material samples. Would you like me to help you set up a vision board for your project?";
    }
    
    if (lowerCaseMessage.includes('contractor') || lowerCaseMessage.includes('professional')) {
      return "Finding the right professional is crucial for your project's success. I can help you connect with verified contractors in your area. What specific skills or expertise are you looking for?";
    }
    
    // Default response
    return "That's an interesting aspect of your home project. Could you tell me more about what you're envisioning? The more details you share, the better I can help guide you through the process.";
  }
  
  /**
   * Create a suggestion for the user
   */
  static async createSuggestion(suggestionData = {}) {
    try {
      const { data } = await supabase.auth.getUser();
      const user = safelyAccessData(data, 'user');
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data: suggestion, error } = await supabase
        .from('ai_suggestions')
        .insert({
          user_id: user.id,
          conversation_id: suggestionData.conversation_id,
          project_id: suggestionData.project_id || null,
          suggestion_type: suggestionData.suggestion_type || 'general',
          content: suggestionData.content || {}
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return suggestion;
    } catch (error) {
      logError(error, { location: 'AIConciergeService.createSuggestion' });
      throw error;
    }
  }
  
  /**
   * Mark a suggestion as applied
   */
  static async applySuggestion(suggestionId) {
    try {
      if (!suggestionId) {
        throw new Error('Suggestion ID is required');
      }
      
      const { data } = await supabase.auth.getUser();
      const user = safelyAccessData(data, 'user');
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data: suggestion, error } = await supabase
        .from('ai_suggestions')
        .update({ is_applied: true })
        .eq('id', suggestionId)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return suggestion;
    } catch (error) {
      logError(error, { 
        location: 'AIConciergeService.applySuggestion',
        suggestionId
      });
      throw error;
    }
  }
  
  /**
   * Get suggestions for a user
   */
  static async getUserSuggestions(options = {}) {
    try {
      const { data } = await supabase.auth.getUser();
      const user = safelyAccessData(data, 'user');
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      let query = supabase
        .from('ai_suggestions')
        .select('*')
        .eq('user_id', user.id);
      
      if (options.project_id) {
        query = query.eq('project_id', options.project_id);
      }
      
      if (options.conversation_id) {
        query = query.eq('conversation_id', options.conversation_id);
      }
      
      if (options.suggestion_type) {
        query = query.eq('suggestion_type', options.suggestion_type);
      }
      
      const { data: suggestions, error } = await query
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return suggestions || [];
    } catch (error) {
      logError(error, { 
        location: 'AIConciergeService.getUserSuggestions',
        options
      });
      // Return empty array to prevent reduce errors
      return [];
    }
  }
}
