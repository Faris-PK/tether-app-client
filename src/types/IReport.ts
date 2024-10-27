export interface IReport {
    _id: string;
    postId: {
      isBlocked: any;
      _id: string;
      caption: string;
      mediaUrl?: string;
      userId: {
        username: string;
        profile_picture: string;
      };
    };
    reportedBy: {
      _id: string;
      username: string;
    };
    reason: string;
    status: 'pending' | 'reviewed' | 'resolved';
    createdAt: string;
  }