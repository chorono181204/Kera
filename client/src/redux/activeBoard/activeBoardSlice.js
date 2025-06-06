import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {API_URL} from '../../utils/constants'
import {mapOrder} from '../../utils/sorts'
import {isEmpty} from 'lodash'
import authorizeAxiosInstance from '../../utils/authorizeAxios'
import axios from 'axios';
import {generatePlaceHolderCard} from '../../utils/formatter.js';

const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi api(bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsyncThunk di
// đi kèm với extraReducer

export const fetchBoardDetailsAPI = createAsyncThunk('activeBoard/fetchBoardDetailsAPI', async (boardId) => {
  const response = await authorizeAxiosInstance.get(`${API_URL}boards/${boardId}`)
  // Lưu ý: axios sẽ trả về kết quả về qua property của nó là data
  //sort card label by createdAt
  
  return response.data?.result
})

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // reducers: noi xu ly du lieu dong bo (sync)
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
       // payload la du lieu nhan vao reducer
      // update lai du lieu cua currentActiveBoard
      let board = action.payload

      
      board.columns = mapOrder(board.columns)

      board.columns.forEach((column) => {
        
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceHolderCard(column)]
        } else {
        
          column.cards = mapOrder(column.cards)
        }
      })

      state.currentActiveBoard = board
    },

    updateCardInBoard: (state, action) => {
      const incomingCard = action.payload

      const column = state.currentActiveBoard.columns.find((column) => column._id === incomingCard.columnId)

      if (column) {
        const card = column.cards.find((card) => card.id === incomingCard.id)
        if (card) {
          Object.assign(card, incomingCard)
        }
      }
    }
  },
  // ExtraReducer: noi xu ly du lieu bat dong bo (async)
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // payload la response.data o api(fetchBoardDetailsAPI) tren
      let board = action.payload

      
      board.columns = mapOrder(board.columns)

      board.columns.forEach((column) => {
        
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceHolderCard(column)]
        } else {
        
          column.cards = mapOrder(column.cards)
        }
      })

      state.currentActiveBoard = board
    })
  }
})

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions

export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

export const activeBoardReducer = activeBoardSlice.reducer
