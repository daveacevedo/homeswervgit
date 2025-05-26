import { supabase } from '../supabase';
import { StripeService } from '../integrations';

/**
 * Project service for managing projects and milestones
 */
export const ProjectService = {
  /**
   * Get all projects for the current user
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of projects
   */
  async getProjects(options = {}) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    let query = supabase.from('projects').select('*');
    
    // Filter by user role
    if (options.role === 'homeowner') {
      query = query.eq('homeowner_id', user.id);
    } else if (options.role === 'provider') {
      // Get provider profile ID first
      const { data: providerProfile } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (providerProfile) {
        query = query.eq('provider_id', providerProfile.id);
      }
    }
    
    // Apply status filter
    if (options.status) {
      query = query.eq('status', options.status);
    }
    
    // Apply sorting
    const sortField = options.sortBy || 'created_at';
    const sortOrder = options.sortOrder || { ascending: false };
    query = query.order(sortField, sortOrder);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Get a specific project by ID
   * @param {string} id - Project ID
   * @returns {Promise<Object>} Project details
   */
  async getProjectById(id) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        provider:provider_id (
          id,
          business_name,
          logo_url,
          user_id
        ),
        homeowner:homeowner_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Get milestones for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} List of milestones
   */
  async getProjectMilestones(projectId) {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('due_date', { ascending: true });
    
    if (error) {
      console.error(`Error fetching milestones for project ${projectId}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Create a new milestone for a project
   * @param {string} projectId - Project ID
   * @param {Object} milestoneData - Milestone details
   * @returns {Promise<Object>} Created milestone
   */
  async createMilestone(projectId, milestoneData) {
    const { data, error } = await supabase
      .from('project_milestones')
      .insert({
        project_id: projectId,
        name: milestoneData.name,
        description: milestoneData.description,
        amount: milestoneData.amount,
        due_date: milestoneData.dueDate,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Error creating milestone for project ${projectId}:`, error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Update a milestone
   * @param {string} id - Milestone ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated milestone
   */
  async updateMilestone(id, updates) {
    const { data, error } = await supabase
      .from('project_milestones')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating milestone ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Mark a milestone as completed
   * @param {string} id - Milestone ID
   * @returns {Promise<Object>} Updated milestone
   */
  async completeMilestone(id) {
    return this.updateMilestone(id, { status: 'completed' });
  },
  
  /**
   * Create a payment intent for a milestone
   * @param {string} milestoneId - Milestone ID
   * @returns {Promise<Object>} Payment intent details
   */
  async createMilestonePayment(milestoneId) {
    // Get the milestone
    const { data: milestone, error: milestoneError } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('id', milestoneId)
      .single();
    
    if (milestoneError) {
      console.error(`Error fetching milestone ${milestoneId}:`, milestoneError);
      throw milestoneError;
    }
    
    // Create a payment intent with Stripe
    const paymentIntent = await StripeService.createPaymentIntent({
      amount: milestone.amount * 100, // Convert to cents
      currency: 'usd',
      description: `Payment for milestone: ${milestone.name}`
    });
    
    // Update the milestone with the payment ID
    await this.updateMilestone(milestoneId, {
      payment_id: paymentIntent.id
    });
    
    return paymentIntent;
  },
  
  /**
   * Get financing options for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} List of financing options
   */
  async getProjectFinancing(projectId) {
    const { data, error } = await supabase
      .from('project_financing')
      .select('*')
      .eq('project_id', projectId);
    
    if (error) {
      console.error(`Error fetching financing for project ${projectId}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Apply for financing for a project
   * @param {string} projectId - Project ID
   * @param {Object} financingData - Financing details
   * @returns {Promise<Object>} Created financing record
   */
  async applyForFinancing(projectId, financingData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('project_financing')
      .insert({
        project_id: projectId,
        user_id: user.id,
        provider: financingData.provider,
        amount: financingData.amount,
        terms: financingData.terms || {},
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Error applying for financing for project ${projectId}:`, error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Update financing status
   * @param {string} id - Financing ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated financing record
   */
  async updateFinancingStatus(id, status) {
    const { data, error } = await supabase
      .from('project_financing')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating financing status ${id}:`, error);
      throw error;
    }
    
    return data;
  }
};
