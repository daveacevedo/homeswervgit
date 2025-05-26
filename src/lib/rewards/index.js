import { supabase } from '../supabase';

/**
 * Rewards service for managing user points and deals
 */
export const RewardsService = {
  /**
   * Get the current user's points balance
   * @returns {Promise<Object>} Points balance
   */
  async getUserPoints() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('rewards_points')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching user points:', error);
      throw error;
    }
    
    return data || { points: 0, lifetime_points: 0 };
  },
  
  /**
   * Get the user's point transactions
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of transactions
   */
  async getUserTransactions(options = { limit: 10, offset: 0 }) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('rewards_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(options.offset, options.offset + options.limit - 1);
    
    if (error) {
      console.error('Error fetching user transactions:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Award points to the user
   * @param {Object} pointData - Point transaction details
   * @returns {Promise<Object>} Transaction details
   */
  async awardPoints(pointData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('rewards_transactions')
      .insert({
        user_id: user.id,
        points: pointData.points,
        transaction_type: 'earn',
        source: pointData.source,
        reference_id: pointData.referenceId,
        description: pointData.description
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error awarding points:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Get available deals for redemption
   * @returns {Promise<Array>} List of deals
   */
  async getAvailableDeals() {
    const { data, error } = await supabase
      .from('rewards_deals')
      .select('*')
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString().split('T')[0])
      .order('points_required', { ascending: true });
    
    if (error) {
      console.error('Error fetching available deals:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Redeem a deal with points
   * @param {string} dealId - Deal ID
   * @returns {Promise<Object>} Redemption details
   */
  async redeemDeal(dealId) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get the deal
    const { data: deal, error: dealError } = await supabase
      .from('rewards_deals')
      .select('*')
      .eq('id', dealId)
      .single();
    
    if (dealError) {
      console.error(`Error fetching deal ${dealId}:`, dealError);
      throw dealError;
    }
    
    // Check if the deal is active
    if (!deal.is_active || new Date(deal.end_date) < new Date()) {
      throw new Error('This deal is no longer available');
    }
    
    // Check if the user has enough points
    const { data: pointsData } = await this.getUserPoints();
    
    if (!pointsData || pointsData.points < deal.points_required) {
      throw new Error('Not enough points to redeem this deal');
    }
    
    // Generate a redemption code
    const { data: redemptionCode, error: codeError } = await supabase
      .rpc('generate_redemption_code');
    
    if (codeError) {
      console.error('Error generating redemption code:', codeError);
      throw codeError;
    }
    
    // Start a transaction (in a real app, this would be a database transaction)
    
    // 1. Create the redemption record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Expire in 30 days
    
    const { data: redemption, error: redemptionError } = await supabase
      .from('rewards_redemptions')
      .insert({
        user_id: user.id,
        deal_id: dealId,
        points_spent: deal.points_required,
        redemption_code: redemptionCode,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();
    
    if (redemptionError) {
      console.error('Error creating redemption:', redemptionError);
      throw redemptionError;
    }
    
    // 2. Deduct points from the user
    const { data: transaction, error: transactionError } = await supabase
      .from('rewards_transactions')
      .insert({
        user_id: user.id,
        points: deal.points_required,
        transaction_type: 'spend',
        source: 'deal_redemption',
        reference_id: redemption.id,
        description: `Redeemed: ${deal.title}`
      })
      .select()
      .single();
    
    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      throw transactionError;
    }
    
    return {
      ...redemption,
      deal: deal,
      transaction: transaction
    };
  },
  
  /**
   * Get the user's redemptions
   * @returns {Promise<Array>} List of redemptions
   */
  async getUserRedemptions() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('rewards_redemptions')
      .select(`
        *,
        deal:deal_id (
          title,
          description,
          image_url,
          points_required
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user redemptions:', error);
      throw error;
    }
    
    return data || [];
  }
};
