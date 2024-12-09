
export interface IUser {
  _id: string;
  username: string;
  profile_picture?: string;
}

export interface IMessage {
  _id: string;
  sender: IUser;
  receiver: IUser;
  content: string;
  chatId: string;
  isRead: boolean;
  messageType: 'text' | 'image' | 'video';
  createdAt: Date;
}

export interface IChat {
  _id: string;
  participants: IUser[];
  lastMessage?: IMessage;
  isGroupChat: boolean;
  groupName?: string;
  createdAt: Date;
  updatedAt: Date;
}