import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { User } from '../ts/UserInterfaces'
import { axiosInstance } from '../axiosInstance/axios';

// Define the initial state
const initialState: User & { loading: boolean; error: string | null } = {
  username: "",
  email: "",
  image:"",
  loading: false,
  error: null
}

export const fetchUserData = createAsyncThunk<User, void>(
  'user/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/user');
      if (!response) {
        throw new Error('Failed to fetch user data');
      }
      console.log(await response);
      return await response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
)

// Create user slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<User>) => {
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.image=action.payload.image||"";
        state.loading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
})

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
