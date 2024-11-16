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
    userFind:'/user/find'

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
    getUserProducts: '/market/products',
    searchProducts: '/market/search',
    getCategoriesProducts: '/market/category',
    getProductsByPrice: '/market/products/price',
    getProductsByDate: '/market/products/date',
    promoteProduct: '/market/promote',
  };

  export const paymentRoutes = {
    createSubscription: '/user/create-subscription',
    verifyPayment: '/user/success'
  }; 