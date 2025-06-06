import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from '../../utils/constants'
import authorizeAxiosInstance from '../../utils/authorizeAxios'
import { toast } from 'react-toastify'
import { updateUserAPI as updateUserAPIService } from '../../apis'

const initialState = {
  currentUser: null,
  accessToken: null
}

// Thunks
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.post(`${API_URL}auth/login`, data)
    return response?.data?.result // { accessToken, user }
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.post(`${API_URL}auth/logout`,data)
    return response.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data, { getState }) => {
    const state = getState();
    const userId = state.user.currentUser?.id || state.user.currentUser?._id;
    const result = await updateUserAPIService(data, userId);
    return result; // trả về updated user
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // dùng để cập nhật accessToken khi refresh
    setAccessToken(state, action) {
      state.accessToken = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loginUserAPI.fulfilled, (state, action) => {
        const { accessToken, user } = action.payload
        state.accessToken = accessToken
        state.currentUser = user
      })
      .addCase(logoutUserAPI.fulfilled, state => {
        state.currentUser = null
        state.accessToken = null
      })
      .addCase(updateUserAPI.fulfilled, (state, action) => {
        state.currentUser = action.payload
      })
  }
})

export const { setAccessToken } = userSlice.actions
export const selectCurrentUser = state => state.user.currentUser
export const selectAccessToken = state => state.user.accessToken

export const userReducer = userSlice.reducer
