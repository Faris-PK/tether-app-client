import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUser from '@/types/IUser';

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  profile: any | null;
}

const initialUserState: UserState = {
  user: null,
  isAuthenticated: false,
  profile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.profile = null;
    },
    addPostToUser: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.posts.push(action.payload);
      }
    },
    removePostFromUser: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.posts = state.user.posts.filter(postId => postId !== action.payload);
      }
    },
  
    addFollowedUser: (state, action: PayloadAction<string>) => {
      if (state.user && !state.user.following?.includes(action.payload)) {
        state.user.following = [...(state.user.following || []), action.payload];
      }
    },
    removeFollowedUser: (state, action: PayloadAction<string>) => {
      if (state.user && state.user.following) {
        state.user.following = state.user.following.filter(id => id !== action.payload);
      }
    },
    updatePremiumStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.premium_status = action.payload;
      }
    },

  },
});

export const { 
  setUser, 
  clearUser, 
  addPostToUser, 
  removePostFromUser,
  addFollowedUser,
  removeFollowedUser ,
  updatePremiumStatus
} = userSlice.actions;

export default userSlice.reducer;