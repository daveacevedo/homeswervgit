import { supabase } from '../supabase';

/**
 * Service for handling third-party integrations
 */
export const IntegrationService = {
  /**
   * Get all available integrations
   * @returns {Promise<Array>} List of integrations
   */
  async getIntegrations() {
    const { data, error } = await supabase
      .from('integrations')
      .select('*');
    
    if (error) {
      console.error('Error fetching integrations:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Get integration by ID
   * @param {string} id - Integration ID
   * @returns {Promise<Object>} Integration details
   */
  async getIntegrationById(id) {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching integration:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Create a new integration
   * @param {Object} integration - Integration data
   * @returns {Promise<Object>} Created integration
   */
  async createIntegration(integration) {
    const { data, error } = await supabase
      .from('integrations')
      .insert(integration)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating integration:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Update an existing integration
   * @param {string} id - Integration ID
   * @param {Object} integration - Updated integration data
   * @returns {Promise<Object>} Updated integration
   */
  async updateIntegration(id, integration) {
    const { data, error } = await supabase
      .from('integrations')
      .update(integration)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating integration:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Toggle integration status (active/inactive)
   * @param {string} id - Integration ID
   * @param {boolean} isActive - New status
   * @returns {Promise<Object>} Updated integration
   */
  async toggleIntegrationStatus(id, isActive) {
    const { data, error } = await supabase
      .from('integrations')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error toggling integration status:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Get user's connected integrations
   * @returns {Promise<Array>} List of user's integrations
   */
  async getUserIntegrations() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('user_integrations')
      .select(`
        *,
        integration:integration_id (
          id,
          name,
          logo_url,
          description
        )
      `)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching user integrations:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Connect a new integration for the user
   * @param {string} integrationId - Integration ID
   * @param {Object} credentials - Integration credentials
   * @returns {Promise<Object>} Connected integration
   */
  async connectIntegration(integrationId, credentials) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // In a real app, you would securely store credentials
    // For now, we'll just store a flag indicating the integration is connected
    const { data, error } = await supabase
      .from('user_integrations')
      .insert({
        user_id: user.id,
        integration_id: integrationId,
        is_connected: true,
        metadata: { connected_at: new Date().toISOString() }
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error connecting integration:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Disconnect an integration for the user
   * @param {string} integrationId - Integration ID
   * @returns {Promise<void>}
   */
  async disconnectIntegration(integrationId) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('user_integrations')
      .delete()
      .eq('user_id', user.id)
      .eq('integration_id', integrationId);
    
    if (error) {
      console.error('Error disconnecting integration:', error);
      throw error;
    }
  }
};

/**
 * Service for handling API keys
 */
export const ApiKeyService = {
  /**
   * Get all API keys for the current user
   * @returns {Promise<Array>} List of API keys
   */
  async getApiKeys() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching API keys:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Create a new API key
   * @param {Object} keyData - API key data
   * @returns {Promise<Object>} Created API key
   */
  async createApiKey(keyData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Generate a random key value (in a real app, you'd use a more secure method)
    const keyValue = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        name: keyData.name,
        key_value: keyValue, // In a real app, you'd store a hashed version
        permissions: keyData.permissions || {},
        rate_limit: keyData.rate_limit || 1000,
        expires_at: keyData.expires_at || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating API key:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Revoke an API key
   * @param {string} keyId - API key ID
   * @returns {Promise<void>}
   */
  async revokeApiKey(keyId) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error revoking API key:', error);
      throw error;
    }
  },
  
  /**
   * Validate an API key
   * @param {string} keyValue - API key value
   * @returns {Promise<Object>} API key data if valid
   */
  async validateApiKey(keyValue) {
    // In a real app, this would be done server-side
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key_value', keyValue)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error validating API key:', error);
      throw new Error('Invalid API key');
    }
    
    // Check if key is expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      throw new Error('API key has expired');
    }
    
    // Update last used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id);
    
    return data;
  }
};

/**
 * Service for handling Stripe payments
 */
export const StripeService = {
  /**
   * Create a payment intent
   * @param {Object} options - Payment options
   * @returns {Promise<Object>} Payment intent
   */
  async createPaymentIntent(options) {
    // In a real app, this would make a request to your backend
    // which would then create a payment intent with Stripe
    // For now, we'll simulate a successful response
    
    return {
      id: `pi_${Math.random().toString(36).substring(2, 15)}`,
      amount: options.amount,
      currency: options.currency,
      status: 'requires_payment_method',
      client_secret: `seti_${Math.random().toString(36).substring(2, 15)}_secret_${Math.random().toString(36).substring(2, 15)}`,
      created: Date.now() / 1000
    };
  },
  
  /**
   * Get payment methods for the current user
   * @returns {Promise<Array>} List of payment methods
   */
  async getPaymentMethods() {
    // In a real app, this would fetch from Stripe
    // For now, we'll return mock data
    
    return [
      {
        id: 'pm_1234567890',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025
        }
      },
      {
        id: 'pm_0987654321',
        type: 'card',
        card: {
          brand: 'mastercard',
          last4: '5555',
          exp_month: 10,
          exp_year: 2024
        }
      }
    ];
  },
  
  /**
   * Process a payment
   * @param {string} paymentIntentId - Payment intent ID
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<Object>} Payment result
   */
  async processPayment(paymentIntentId, paymentMethodId) {
    // In a real app, this would confirm the payment with Stripe
    // For now, we'll simulate a successful payment
    
    return {
      id: paymentIntentId,
      status: 'succeeded',
      amount_received: 10000, // $100.00
      currency: 'usd',
      payment_method: paymentMethodId,
      created: Date.now() / 1000
    };
  }
};

// For backward compatibility
export const IntegrationsService = IntegrationService;
