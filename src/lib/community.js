// This is a mock service for the Community Hub functionality
// In a real application, this would connect to your Supabase backend

export const CommunityService = {
  // Get posts with optional filtering
  getPosts: async (options = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    const allPosts = [
      {
        id: '1',
        title: 'Modern Kitchen Renovation',
        content: 'Just finished my kitchen renovation and wanted to share the results!',
        images: ['https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
        tags: ['kitchen', 'modern', 'renovation'],
        likes_count: 24,
        comments_count: 8,
        is_featured: true,
        created_at: '2023-05-15T14:30:00Z',
        user: {
          id: 'user1',
          email: 'sarah@example.com',
          user_metadata: {
            full_name: 'Sarah Johnson'
          }
        }
      },
      {
        id: '2',
        title: 'Backyard Patio Makeover',
        content: 'Transformed our boring backyard into an outdoor oasis!',
        images: ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
        tags: ['outdoor', 'patio', 'landscaping'],
        likes_count: 18,
        comments_count: 5,
        is_featured: false,
        created_at: '2023-05-10T09:15:00Z',
        user: {
          id: 'user2',
          email: 'mike@example.com',
          user_metadata: {
            full_name: 'Mike Thompson'
          }
        }
      },
      {
        id: '3',
        title: 'Bathroom Remodel on a Budget',
        content: 'How I remodeled my bathroom for under $5,000',
        images: ['https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
        tags: ['bathroom', 'budget', 'DIY'],
        likes_count: 32,
        comments_count: 12,
        is_featured: true,
        created_at: '2023-05-05T16:45:00Z',
        user: {
          id: 'user3',
          email: 'jessica@example.com',
          user_metadata: {
            full_name: 'Jessica Lee'
          }
        }
      },
      {
        id: '4',
        title: 'Living Room Paint Transformation',
        content: 'Amazing what a fresh coat of paint can do!',
        images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
        tags: ['living room', 'paint', 'color'],
        likes_count: 15,
        comments_count: 3,
        is_featured: false,
        created_at: '2023-04-28T11:20:00Z',
        user: {
          id: 'user4',
          email: 'david@example.com',
          user_metadata: {
            full_name: 'David Wilson'
          }
        }
      },
      {
        id: '5',
        title: 'DIY Floating Shelves Installation',
        content: 'Step-by-step guide to installing floating shelves in any room',
        images: ['https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
        tags: ['shelves', 'DIY', 'storage'],
        likes_count: 27,
        comments_count: 9,
        is_featured: false,
        created_at: '2023-04-22T08:10:00Z',
        user: {
          id: 'user5',
          email: 'emily@example.com',
          user_metadata: {
            full_name: 'Emily Garcia'
          }
        }
      },
      {
        id: '6',
        title: 'Home Office Renovation',
        content: 'Created my dream home office during the pandemic',
        images: ['https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
        tags: ['office', 'workspace', 'renovation'],
        likes_count: 21,
        comments_count: 7,
        is_featured: true,
        created_at: '2023-04-15T13:25:00Z',
        user: {
          id: 'user6',
          email: 'robert@example.com',
          user_metadata: {
            full_name: 'Robert Chen'
          }
        }
      }
    ];
    
    // Apply filters based on options
    let filteredPosts = [...allPosts];
    
    if (options.featured) {
      filteredPosts = filteredPosts.filter(post => post.is_featured);
    }
    
    if (options.tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags && post.tags.includes(options.tag)
      );
    }
    
    // Sort by most recent
    filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    return filteredPosts;
  },
  
  // Get a single post by ID
  getPost: async (postId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - would be fetched from database in real app
    const posts = await CommunityService.getPosts();
    return posts.find(post => post.id === postId);
  },
  
  // Check if user has liked a post
  hasUserLikedPost: async (postId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock data - would check user's likes in database
    // For demo, randomly return true/false
    return Math.random() > 0.5;
  },
  
  // Like a post
  likePost: async (postId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Would add user's like to database
    return { success: true };
  },
  
  // Unlike a post
  unlikePost: async (postId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Would remove user's like from database
    return { success: true };
  },
  
  // Get popular tags
  getPopularTags: async (limit = 10) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock data - would be calculated from database
    return [
      { tag: 'kitchen', count: 42 },
      { tag: 'bathroom', count: 38 },
      { tag: 'DIY', count: 35 },
      { tag: 'renovation', count: 31 },
      { tag: 'modern', count: 28 },
      { tag: 'outdoor', count: 25 },
      { tag: 'budget', count: 22 },
      { tag: 'paint', count: 19 },
      { tag: 'lighting', count: 17 },
      { tag: 'storage', count: 15 }
    ].slice(0, limit);
  },
  
  // Create a new post
  createPost: async (postData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Would save post to database
    return {
      id: Date.now().toString(),
      ...postData,
      created_at: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0
    };
  },
  
  // Get comments for a post
  getComments: async (postId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock data - would be fetched from database
    return [
      {
        id: 'comment1',
        post_id: postId,
        content: 'This looks amazing! What paint color did you use?',
        created_at: '2023-05-16T10:30:00Z',
        user: {
          id: 'user7',
          email: 'lisa@example.com',
          user_metadata: {
            full_name: 'Lisa Brown'
          }
        }
      },
      {
        id: 'comment2',
        post_id: postId,
        content: 'Great job! How long did the project take?',
        created_at: '2023-05-15T14:45:00Z',
        user: {
          id: 'user8',
          email: 'james@example.com',
          user_metadata: {
            full_name: 'James Miller'
          }
        }
      },
      {
        id: 'comment3',
        post_id: postId,
        content: 'I\'m planning a similar project. Would you mind sharing your contractor\'s info?',
        created_at: '2023-05-14T09:15:00Z',
        user: {
          id: 'user9',
          email: 'sophia@example.com',
          user_metadata: {
            full_name: 'Sophia Martinez'
          }
        }
      }
    ];
  },
  
  // Add a comment to a post
  addComment: async (postId, content) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Would save comment to database
    return {
      id: Date.now().toString(),
      post_id: postId,
      content,
      created_at: new Date().toISOString(),
      user: {
        id: 'current-user',
        email: 'current@example.com',
        user_metadata: {
          full_name: 'Current User'
        }
      }
    };
  }
};
