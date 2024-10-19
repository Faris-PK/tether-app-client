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
  },
});

export const { setUser, clearUser, addPostToUser, removePostFromUser } = userSlice.actions;
export default userSlice.reducer;