export interface Story {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profile_picture: string;
  };
  mediaUrl: string;
  musicTrackId?: string;
  musicPreviewUrl?: string;
  musicName:string;
  caption?: string;
  viewedUsers: Array<{
    _id: string;
    username: string;
    profile_picture: string;
  }>;
  likedUsers: Array<{
    _id: string;
    username: string;
    profile_picture: string;
  }>;
  createdAt: string;
}