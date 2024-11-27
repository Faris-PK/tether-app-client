import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
  admin: any | null;
  isAdmin: boolean;
}

const initialAdminState: AdminState = {
  admin: null,
  isAdmin: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState: initialAdminState,
  reducers: {
    setAdmin: (state, action: PayloadAction<any>) => {   
      state.admin = action.payload;
      state.isAdmin = true;
    },
    clearAdmin: (state) => {
      state.admin = null;
      state.isAdmin = false;
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;