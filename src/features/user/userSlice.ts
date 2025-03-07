import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILocalSession } from '@/types/auth/local-session.types';
import { getUserSession } from '@/utils/session-helper';

const sessionData = getUserSession();

const initialState: ILocalSession = {
  id: sessionData?.id || '',
  name: sessionData?.name || '',
  email: sessionData?.email || '',
};

const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    changeUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setUser: (state, action: PayloadAction<ILocalSession>) => {
      state = action.payload;
    },
  },
});

export const { changeUserName, setUser } = userSlice.actions;
export default userSlice.reducer;
