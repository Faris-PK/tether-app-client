export interface Sender {
  _id: string;
  username: string;
  profile_picture: string;
}

export interface Message {
  _id: string;
  sender: Sender;
  text?: string;
  fileUrl?: string;
  fileType?: 'image' | 'video';
  createdAt: string;
  read: boolean;
  receiver: string;
  isDeleted: boolean;
  replyTo?: Message;
}
export interface Contact {
  id: string;
  name: string;
  username: string;
  profile_picture: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
}
