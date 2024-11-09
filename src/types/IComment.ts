export interface Comment {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profile_picture: string;
  };
  content: string;
  createdAt: string;
  parentCommentId?: string;
  replies?: Comment[]; 
  likes: string[]
}
  
  export interface CommentResponse {
    success: boolean;
    message: string;
    data: Comment;
  }
  
  export interface CommentsResponse {
    success: boolean;
    message: string;
    data: Comment[];
  }