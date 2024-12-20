export interface Sender {
  _id: string;
  username: string;
  profile_picture: string;
}

export interface Message {
  _id: string;
  sender: Sender;
  text: string;
  createdAt: string;
  read:boolean;
  receiver:string
  isDeleted:boolean;
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
