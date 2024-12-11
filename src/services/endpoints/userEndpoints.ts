export const authRoutes = {
    SignIn:'/auth/login',
    Register:'/auth/register',
    Otp:'/auth/verify-otp',
    ResendOtp:'/auth/resend-otp',
    logout:'/auth/logout',
    googleRegister:'/auth/google',
    googleLogin:'/auth/google',
    userProfile: '/user/profile',
    uploadImage: '/user/upload-image',
    updateProfile:'/user/remove-profile-picture',
    userSearch:'/user/search',
    ForgotPassword: '/auth/forgot-password',
    ResetPassword: '/auth/reset-password',

} 



export const postRoutes = {
    createPost: 'posts/create',
    getAllPosts: 'posts',
    getUserPots: 'posts/profile',
    deletePost: 'posts/delete',
    updatePost: 'posts/update',
    likePost: 'posts/like',
    reportPost: 'posts/report',
    getComments: 'posts/comments',
    addComment: 'posts/comments/add',
    editComment: 'posts/comments/edit',
    deleteComment: 'posts/comments/delete',
    addReplyToComment: 'posts/comments/reply',
    getSinglePost : 'posts/singlePost'
    
  };



  export const networkRoutes = {
    getFollowRequests: 'user/follow-requests',
    getPeopleSuggestions: 'user/suggestions',
    getFollowers: '/user/followers',
    getFollowing: '/user/following',
    followUser: 'user/follow',
    unfollowUser: 'user/unfollow',
    removeFollowRequest: 'user/remove-request',
    removeSuggestion: 'user/remove-suggestion',
    getUserNotifications: 'user/notifications',

  };




  export const marketplaceRoutes = {
    createProduct: 'market/create',
    getAllProducts: '/market/',
    getUserProducts: '/market/products',
    promoteProduct: '/market/promote',
    updateProduct: '/market/update',
   deleteProduct: '/market/delete'
  };

  export const paymentRoutes = {
    createSubscription: '/user/create-subscription',
    verifyPayment: '/user/success'
  }; 

  export const storyRoutes = {
    search: '/story/spotify/search',
    createStory:'/story/create',
    getStories:'/story/',
    viewStory:'/story/view',
    toggleLike: '/story/like',
    deleteStory: '/story/delete',

  
    
  };

  export const chatRoutes = {
    getContacts: '/chat/contacts',
    getMessages: '/chat/messages',
    sendMessage: '/chat/send',
    markMessagesAsRead: '/chat/read',
    searchUsers:'/chat/search',
    startNewChat:'/chat/start-chat'
  };