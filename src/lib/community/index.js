import { supabase } from '../supabase';

/**
 * Service for managing community posts and interactions
 */
export const CommunityService = {
  /**
   * Get community posts with optional filtering
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of posts
   */
  async getPosts(options = {}) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    let query = supabase.from('community_posts')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        ),
        likes_count:community_likes(count),
        comments_count:community_comments(count)
      `);
    
    // Apply filters
    if (options.featured) {
      query = query.eq('is_featured', true);
    }
    
    if (options.tag) {
      query = query.contains('tags', [options.tag]);
    }
    
    if (options.userId) {
      query = query.eq('user_id', options.userId);
    }
    
    // Apply sorting
    const sortField = options.sortBy || 'created_at';
    const sortOrder = options.sortOrder || { ascending: false };
    query = query.order(sortField, sortOrder);
    
    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Get a specific post by ID
   * @param {string} id - Post ID
   * @returns {Promise<Object>} Post details
   */
  async getPostById(id) {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        ),
        likes_count:community_likes(count),
        comments_count:community_comments(count),
        project:project_id (
          id,
          title,
          provider:provider_id (
            id,
            business_name,
            logo_url
          )
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Create a new community post
   * @param {Object} postData - Post details
   * @returns {Promise<Object>} Created post
   */
  async createPost(postData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        title: postData.title,
        content: postData.description,
        images: postData.images,
        tags: postData.tags,
        project_id: postData.projectId,
        is_featured: false // Only admins can feature posts
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Update a community post
   * @param {string} id - Post ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated post
   */
  async updatePost(id, updates) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Check if the user owns the post
    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (postError) {
      console.error(`Error fetching post ${id}:`, postError);
      throw postError;
    }
    
    if (post.user_id !== user.id) {
      throw new Error('You do not have permission to update this post');
    }
    
    const { data, error } = await supabase
      .from('community_posts')
      .update({
        title: updates.title,
        content: updates.description,
        images: updates.images,
        tags: updates.tags,
        project_id: updates.projectId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Delete a community post
   * @param {string} id - Post ID
   * @returns {Promise<void>}
   */
  async deletePost(id) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Check if the user owns the post
    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (postError) {
      console.error(`Error fetching post ${id}:`, postError);
      throw postError;
    }
    
    if (post.user_id !== user.id) {
      throw new Error('You do not have permission to delete this post');
    }
    
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Like a community post
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} Created like
   */
  async likePost(postId) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('community_likes')
      .insert({
        post_id: postId,
        user_id: user.id
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Error liking post ${postId}:`, error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Unlike a community post
   * @param {string} postId - Post ID
   * @returns {Promise<void>}
   */
  async unlikePost(postId) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('community_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id);
    
    if (error) {
      console.error(`Error unliking post ${postId}:`, error);
      throw error;
    }
  },
  
  /**
   * Check if the user has liked a post
   * @param {string} postId - Post ID
   * @returns {Promise<boolean>} Whether the user has liked the post
   */
  async hasUserLikedPost(postId) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('community_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned, user hasn't liked the post
        return false;
      }
      
      console.error(`Error checking if user liked post ${postId}:`, error);
      throw error;
    }
    
    return !!data;
  },
  
  /**
   * Add a comment to a post
   * @param {string} postId - Post ID
   * @param {string} content - Comment content
   * @returns {Promise<Object>} Created comment
   */
  async addComment(postId, content) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('community_comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content
      })
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .single();
    
    if (error) {
      console.error(`Error adding comment to post ${postId}:`, error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Get comments for a post
   * @param {string} postId - Post ID
   * @returns {Promise<Array>} List of comments
   */
  async getComments(postId) {
    const { data, error } = await supabase
      .from('community_comments')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Delete a comment
   * @param {string} id - Comment ID
   * @returns {Promise<void>}
   */
  async deleteComment(id) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Check if the user owns the comment
    const { data: comment, error: commentError } = await supabase
      .from('community_comments')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (commentError) {
      console.error(`Error fetching comment ${id}:`, commentError);
      throw commentError;
    }
    
    if (comment.user_id !== user.id) {
      throw new Error('You do not have permission to delete this comment');
    }
    
    const { error } = await supabase
      .from('community_comments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting comment ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get popular tags from community posts
   * @param {number} limit - Maximum number of tags to return
   * @returns {Promise<Array>} List of tags with counts
   */
  async getPopularTags(limit = 10) {
    // In a real app, this would be a database query that aggregates tags
    // For now, we'll return mock data
    
    return [
      { tag: 'kitchen', count: 42 },
      { tag: 'bathroom', count: 38 },
      { tag: 'renovation', count: 35 },
      { tag: 'diy', count: 29 },
      { tag: 'landscaping', count: 24 },
      { tag: 'flooring', count: 22 },
      { tag: 'painting', count: 19 },
      { tag: 'lighting', count: 17 },
      { tag: 'furniture', count: 15 },
      { tag: 'outdoor', count: 14 }
    ].slice(0, limit);
  }
};
