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
  };



  export const networkRoutes = {
    getFollowRequests: 'user/follow-requests',
    getPeopleSuggestions: 'user/suggestions',
    followUser: 'user/follow',
    unfollowUser: 'user/unfollow',
    removeFollowRequest: 'user/remove-request',
    removeSuggestion: 'user/remove-suggestion',
  };
