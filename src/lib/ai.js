import { supabase } from './supabase';

export class AIConciergeService {
  /**
   * Get all conversations for the current user
   */
  static async getConversations() {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Create a new conversation
   */
  static async createConversation(conversationData) {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: user.user.id,
        title: conversationData.title || 'New Conversation',
        project_id: conversationData.project_id || null
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Get a conversation by ID with its messages
   */
  static async getConversationById(conversationId) {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get the conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', user.user.id)
      .single();
    
    if (conversationError) {
      console.error('Error fetching conversation:', conversationError);
      throw conversationError;
    }
    
    // Get the messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      throw messagesError;
    }
    
    return {
      ...conversation,
      messages: messages || []
    };
  }
  
  /**
   * Add a message to a conversation
   */
  static async addMessage(conversationId, message) {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        role: message.role,
        content: message.content
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding message:', error);
      throw error;
    }
    
    // Update the conversation's updated_at timestamp
    await supabase
      .from('ai_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
    
    return data;
  }
  
  /**
   * Send a message to the AI and get a response
   */
  static async sendMessage(conversationId, messageContent) {
    const { data: user } = await supabase.auth.getUser();
    
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
  }
  
  /**
   * Generate a simple AI response (placeholder for actual AI integration)
   */
  static generateAIResponse(userMessage) {
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
  static async createSuggestion(suggestionData) {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('ai_suggestions')
      .insert({
        user_id: user.user.id,
        conversation_id: suggestionData.conversation_id,
        project_id: suggestionData.project_id || null,
        suggestion_type: suggestionData.suggestion_type,
        content: suggestionData.content
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating suggestion:', error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Mark a suggestion as applied
   */
  static async applySuggestion(suggestionId) {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('ai_suggestions')
      .update({ is_applied: true })
      .eq('id', suggestionId)
      .eq('user_id', user.user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error applying suggestion:', error);
      throw error;
    }
    
    return data;
  }
}
