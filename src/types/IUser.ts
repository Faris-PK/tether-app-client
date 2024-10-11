 export default interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  mobile: string;
  googleId?: string;
  isBlocked: boolean;
  bio?: string;
  profile_picture?: string;
  cover_photo?: string;
  premium_status: boolean;
  dob:string;
  premium_expiration?: Date;
  followers: string[];
  following: string[];
  social_links?: string[];
  blocked_users: string[];
  }