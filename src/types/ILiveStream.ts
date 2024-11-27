export default interface ILiveStream {
  _id: string;
  host: {
    _id: string;
    username: string;
    profile_picture: string;
  };
  roomId: string;
  viewers: string[];
  isActive: boolean;
  startedAt?: string;
  endedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}