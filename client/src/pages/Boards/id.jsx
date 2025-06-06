import React, { useEffect, useState } from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import ModeToggle from '../../components/ModeSelect/index.jsx'
import AppBar from '../../components/AppBar/index.jsx'
import BoardBar from './BoardBar/index.jsx'
import BoardContent from './BoardContent/index.jsx'
import { mockData } from '../../apis/mock-data.js'
import { useDispatch, useSelector } from 'react-redux'

import PageLoadingSpinner from '../../components/Loading/PageLoadingSpinner.jsx'
import { cloneDeep } from 'lodash'
import {
  createCardAPI,
  createColumnAPI,
  moveCardInBoardAPI,
  moveCardInColumnAPI,
  moveColumnInBoardAPI
} from '../../apis/index.js'
import { useParams } from 'react-router-dom'
import {
  fetchBoardDetailsAPI,
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '../../redux/activeBoard/activeBoardSlice.js'
import { generatePlaceHolderCard } from '../../utils/formatter.js'
import ActiveCard from '../../components/Modal/ActiveCard/ActiveCard.jsx'
import { requestJoinBoardAPI } from '../../apis'
import { toast } from 'react-toastify'

const Board = () => {


  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const currentUser = useSelector(state => state.user.currentUser)

  const { boardId } = useParams()
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    setFetchError(false);
    dispatch(fetchBoardDetailsAPI(boardId))
      .unwrap()
      .catch(() => setFetchError(true));
  }, [boardId, dispatch]);

  const createColumn = (data) => {
    createColumnAPI(data).then(column => {
      let newBoard = cloneDeep(board)

      // Đảm bảo column có mảng cards đúng kiểu
      let newColumn = {
        ...column,
        cards: [generatePlaceHolderCard(column)]
      }

      newBoard.columns = [...(newBoard.columns || []), newColumn]

      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  const createCard=(data) => {
    createCardAPI(data).then(card => {
      let newBoard=cloneDeep(board)
      let newColumn=newBoard.columns.find(column => column.id===data.columnId)
      newColumn.cards.push(card)
      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }
  const moveCardInColumn = (cards, columnId) => {
    const updatedColumns = board.columns.map(col =>
      col.id === columnId ? { ...col, cards } : col
    )

    const updatedBoard = {
      ...board,
      columns: updatedColumns
    }
    console.log("okok")
    //dispatch(updateCurrentActiveBoard(updatedBoard))
    moveCardInColumnAPI({
      columnId,
      cardIds: cards?.filter(c => !c.FE_PlaceholderCard).map(c => c.id)
    })
  }


  const moveColumnInBoard=(columns) => {
    let newBoard={ ...board }
    newBoard.columns=columns
    // eslint-disable-next-line no-console


    //dispatch(updateCurrentActiveBoard(newBoard))
    moveColumnInBoardAPI(
      {
        boardId:boardId,
        columnIds:columns.map((column) => column.id)
      }
    )
  }
  const moveCardInBoard=(cardId, oldColumnId, newColumnId, columns) => {
    let newBoard={ ...board }
    newBoard.columns=columns
    //dispatch(updateCurrentActiveBoard(newBoard))
    const updateData={
      cardId:cardId,
      oldColumnId:oldColumnId,
      newColumnId:newColumnId,
      oldColumnCardIds:columns.find(col => col.id===oldColumnId)?.cards?.filter(card => !card.FE_PlaceholderCard).map(card => card.id),
      newColumnCardIds:columns.find(col => col.id===newColumnId)?.cards?.filter(card => !card.FE_PlaceholderCard).map(card => card.id)
    }

    moveCardInBoardAPI(updateData)
  }

  const handleRequestJoin = async () => {
    try {
      await requestJoinBoardAPI(boardId, currentUser.id)
      toast.success('Join request sent successfully')
    } catch (error) {
      toast.error('Failed to send join request')
    }
  }

  if (fetchError) {
    return (
      <Container disableGutters maxWidth={false} sx={{ height: '100vh', backgroundColor: 'background.paper', overflowY:'hidden !important' }}>
        <AppBar />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
          <Typography variant="h5" mb={2}>You don't have access to this board.</Typography>
          <Button variant="contained" color="primary" onClick={handleRequestJoin}>Request Join Board</Button>
        </Box>
      </Container>
    );
  }
  if (!board) {
    return <PageLoadingSpinner caption='Loading Board...' />
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', backgroundColor: 'background.paper', overflowY:'hidden !important' }} >
      <AppBar />
      <ActiveCard />
      <BoardBar board = {board} />
      <BoardContent board = {board} createColumn = {createColumn} createCard = {createCard} moveCardInColumn = {moveCardInColumn} moveColumnInBoard = {moveColumnInBoard} moveCardInBoard = {moveCardInBoard} />
    </Container>

  )
}
export default Board
