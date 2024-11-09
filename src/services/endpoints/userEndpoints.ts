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
    updateProfile:'/user/remove-profile-picture'

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
  };


  export const storyRoutes = {
    createStory: 'stories/create',
    getAllStories: 'stories',
    getUserStories: 'stories/user',
    deleteStory: 'stories/delete',
    viewStory: 'stories/view'
  };


  export const marketplaceRoutes = {
    createProduct: 'market/create',
    getAllProducts: '/market/',
    getUserProducts: '/market/user/products',
    getProductById: '/market/products',
    updateProduct: '/market/products/update',
    deleteProduct: 'market/products/delete',
    searchProducts: 'market/search',
    getCategoriesProducts: 'market/category',
  };

  export const paymentRoutes = {
    createSubscription: '/user/create-subscription',
    verifyPayment: '/user/success'
  }; 