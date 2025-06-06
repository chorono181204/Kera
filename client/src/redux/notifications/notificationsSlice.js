import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '../../utils/authorizeAxios'
import { API_URL  } from '../../utils/constants'

const initialState = {
  currentNotifications: null, // Danh sách notification hiện tại
  loading: false,
  error: null
}

// Lấy danh sách notification từ API khi load trang hoặc F5
export const getNotificationByUserId = createAsyncThunk(
  'notifications/getNotificationByUserId',
  async (userId) => {
    const response = await authorizeAxiosInstance.get(`${API_URL}notifications?userId=${userId}&page=0&size=10`)
    //sort notification by createdAt
    response.data?.result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return response.data?.result
  }
)

// Cập nhật trạng thái lời mời tham gia board
export const updateInviteUserToBoard = createAsyncThunk(
  'notifications/updateInviteUserToBoard',
  async ({ data, notificationId }) => {
    const response = await authorizeAxiosInstance.put(`${API_URL}boards/invite/${notificationId}`, data)
    return response.data?.result
  }
)

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Thêm notification mới vào đầu danh sách (dùng cho WebSocket real-time hoặc client tạo notification)
    addNotification: (state, action) => {
      const incomingNotification = action.payload
      if (!state.currentNotifications) {
        state.currentNotifications = []
      }
      // Nếu notification đã tồn tại (tránh trùng lặp), không thêm nữa
      if (!state.currentNotifications.find(n => n.id === incomingNotification.id)) {
        state.currentNotifications.unshift(incomingNotification)
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Khi lấy notification từ API
      .addCase(getNotificationByUserId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getNotificationByUserId.fulfilled, (state, action) => {
        state.loading = false
        state.currentNotifications = action.payload
      })
      .addCase(getNotificationByUserId.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Khi cập nhật trạng thái lời mời
      .addCase(updateInviteUserToBoard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateInviteUserToBoard.fulfilled, (state, action) => {
        state.loading = false
        if (state.currentNotifications) {
          const index = state.currentNotifications.findIndex(
            notification => notification.id === action.payload.id
          )
          if (index !== -1) {
            state.currentNotifications[index] = action.payload
          }
        }
      })
      .addCase(updateInviteUserToBoard.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

// Action để thêm notification mới (dùng cho WebSocket real-time)
export const { addNotification } = notificationsSlice.actions

// Selector lấy danh sách notification
export const selectCurrentNotifications = (state) => state.notifications.currentNotifications
export const selectNotificationsLoading = (state) => state.notifications.loading
export const selectNotificationsError = (state) => state.notifications.error

export const notificationsReducer = notificationsSlice.reducer