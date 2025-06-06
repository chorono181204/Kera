import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '../../utils/authorizeAxios'
import { API_URL } from '../../utils/constants'

const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}
//sort like this: checklists, comments, attachments, labels
export const fetchCardDetailsAPI = createAsyncThunk(
  'activeCard/fetchCardDetailsAPI',
  async (cardId) => {
    const response = await authorizeAxiosInstance.get(`${API_URL}cards/${cardId}`)
    const fullCard = response.data?.result
    if (fullCard && Array.isArray(fullCard.checkLists)) {
      fullCard.checkLists = [...fullCard.checkLists].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (fullCard && Array.isArray(fullCard.comments)) {
      fullCard.comments = [...fullCard.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (fullCard && Array.isArray(fullCard.attachments)) {
      fullCard.attachments = [...fullCard.attachments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (fullCard && Array.isArray(fullCard.labels)) {
      fullCard.labels = [...fullCard.labels].sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return fullCard
  }
)

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },

    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null,
      state.isShowModalActiveCard = false
    },

    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload

      // Sort comments by createdAt descending if comments exist
      if (fullCard && Array.isArray(fullCard.comments)) {
        fullCard.comments = [...fullCard.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      //sort labels by alphabetical order
      if (fullCard && Array.isArray(fullCard.labels)) {
        fullCard.labels = [...fullCard.labels].sort((a, b) => a.name.localeCompare(b.name));
      }
      //sort attachments by createdAt descending
      if (fullCard && Array.isArray(fullCard.attachments)) {
        fullCard.attachments = [...fullCard.attachments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      //sort checklists by createdAt descending
      if (fullCard && Array.isArray(fullCard.checkLists)) {
        fullCard.labels = [...fullCard.labels].sort((a, b) => a.name.localeCompare(b.name));
      }
      state.currentActiveCard = fullCard
    },

    // WebSocket reducers
    updateCardFromWebSocket: (state, action) => {
      const updatedCard = action.payload;
      if (state.currentActiveCard && state.currentActiveCard.id === updatedCard.id) {
        state.currentActiveCard = {
          ...state.currentActiveCard,
          ...updatedCard
        };
      }
    },

    addCommentFromWebSocket: (state, action) => {
      const newComment = action.payload;
      if (state.currentActiveCard && state.currentActiveCard.id === newComment.cardId) {
        state.currentActiveCard.comments = [
          newComment,
          ...(state.currentActiveCard.comments || [])
        ];
      }
    },

    updateAssignmentFromWebSocket: (state, action) => {
      const assignment = action.payload;
      if (state.currentActiveCard && state.currentActiveCard.id === assignment.cardId) {
        if (!state.currentActiveCard.assignees) {
          state.currentActiveCard.assignees = [];
        }
        
        if (assignment.type === 'assign') {
          state.currentActiveCard.assignees.push(assignment.user);
        } else if (assignment.type === 'unassign') {
          state.currentActiveCard.assignees = state.currentActiveCard.assignees.filter(
            assignee => assignee.id !== assignment.user.id
          );
        }
      }
    },

    deleteCardFromWebSocket: (state, action) => {
      const deletedCardId = action.payload;
      if (state.currentActiveCard && state.currentActiveCard.id === deletedCardId) {
        state.currentActiveCard = null;
        state.isShowModalActiveCard = false;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCardDetailsAPI.fulfilled, (state, action) => {
      let fullCard = action.payload
      if (fullCard && Array.isArray(fullCard.comments)) {
        fullCard.comments = [...fullCard.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      state.currentActiveCard = fullCard
    })
  }
})

export const { 
  showModalActiveCard, 
  clearAndHideCurrentActiveCard, 
  updateCurrentActiveCard,
  updateCardFromWebSocket,
  addCommentFromWebSocket,
  updateAssignmentFromWebSocket,
  deleteCardFromWebSocket
} = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => state.activeCard.currentActiveCard

export const selectIsShowModalActiveCard = (state) => state.activeCard.isShowModalActiveCard

export const activeCardReducer = activeCardSlice.reducer

