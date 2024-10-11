import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: any | null;
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
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
  },
});

export const { setUser, clearUser, setProfile } = userSlice.actions;
export default userSlice.reducer;