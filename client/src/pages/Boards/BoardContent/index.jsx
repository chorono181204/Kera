import React, { useCallback, useEffect, useRef } from 'react'
import {
  Box, Button, Typography
} from '@mui/material'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '../../../redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '../../../redux/user/userSlice'
import { requestJoinBoardAPI } from '../../../apis'
import { toast } from 'react-toastify'

import ListColumns from './ListColumns/ListColumns.jsx'
import { mapOrder } from '../../../utils/sorts.js'
import {
  closestCorners, defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay, getFirstCollision,

  pointerWithin,

  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column.jsx'
import Card from './ListColumns/Column/ListCards/Card/Card.jsx'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceHolderCard } from '../../../utils/formatter.js'
import { moveCardInBoardAPI, moveCardInColumnAPI, moveColumnInBoardAPI } from '../../../apis/index.js'
import { MouseSensor, TouchSensor } from '../../../customLibraries/dndKitSensors.js'


const ACTIVE_DRAG_ITEM_TYPE={
  COLUMN:'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD:'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
const BoardContent = ({ board, createColumn, createCard, moveColumnInBoard, moveCardInColumn, moveCardInBoard }) => {
  const currentUser = useSelector(selectCurrentUser)
  const boardUsers = board?.boardUsers || []

  // Check if current user is a board member
  const isBoardMember = boardUsers.some(u => (u.user?.id || u.id) === currentUser?.id)

  const handleRequestJoin = async () => {
    try {
      await requestJoinBoardAPI(board.id)
      toast.success('Join request sent successfully')
    } catch (error) {
      toast.error('Failed to send join request')
    }
  }

  

  //const pointerSensor=useSensor(PointerSensor, { activationConstraint:{ distance:10 } })
  const mouseSensor=useSensor(MouseSensor, { activationConstraint:{ distance:10 } })
  const touchSensor=useSensor(TouchSensor, { activationConstraint:{ delay:250, tolerance:5 } })
  //const sensors=useSensors(pointerSensor)
  const sensors=useSensors(mouseSensor, touchSensor)
  const [orderedColumns, setOrderedColumns] = React.useState([])
  const [activeDragItemId, setActiveDragItemId] = React.useState(null)
  const [activeDragItemType, setActiveDragItemType] = React.useState(null)
  const [activeDragItemData, setActiveDragItemData] = React.useState(null)
  const [oldColumnDraggingCard, setOldColumnDraggingCard] = React.useState(null)

  const lastOverId = useRef(null)
  useEffect(() => {
    setOrderedColumns(board?.columns)
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column.cards.map(card => card.id)?.includes(cardId))
  }
  const moveCardBetweenDifferentColumn=(overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData,isDragEnd) => {
    setOrderedColumns(prevColumns => {
      const overCardIndex=overColumn?.cards?.findIndex(card => card.id===overCardId)
      let newCardIndex
      const isBelowOverItem = active. rect.current.translated &&
              active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier: overColumn?.cards?.length + 1
      const nextColumns=cloneDeep(prevColumns)
      const nextActiveColumn=nextColumns.find(column => column.id===activeColumn.id)
      const nextOverColumn=nextColumns.find(column => column.id===overColumn.id)

      if (nextActiveColumn) {
        nextActiveColumn.cards=nextActiveColumn.cards.filter(card => card.id!==activeDraggingCardId)
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards=[generatePlaceHolderCard(nextActiveColumn)]
        }
        //nextActiveColumn.cardOrderIds=nextActiveColumn.cards.map(card => card.id)
        for (let i=0;i<nextActiveColumn.cards.length;i++) {
          nextActiveColumn.cards[i].orderIndex=i
        }
      }


      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card.id !== activeDraggingCardId)
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, { ...activeDraggingCardData })
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)
        for (let i = 0; i < nextOverColumn.cards.length; i++) {
          nextOverColumn.cards[i].orderIndex = i
        }
      }
      if (isDragEnd) {
        moveCardInBoard(activeDraggingCardId, oldColumnDraggingCard.id, nextOverColumn.id, nextColumns)
      }
      return nextColumns
    }
    )

  }
  const handleDragStart=(event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.cards? ACTIVE_DRAG_ITEM_TYPE.COLUMN:ACTIVE_DRAG_ITEM_TYPE.CARD)
    setActiveDragItemData(event?.active?.data?.current)
    if (!event?.active?.data?.current?.cards) {
      setOldColumnDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  const handleDragOver=(event) => {
    if (activeDragItemType===ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over }=event
    if (!over||!active) return
    const { id:activeDraggingCardId, data:{ current:activeDraggingCardData } } = active
    const { id:overCardId }=over
    const activeColumn=findColumnByCardId(activeDraggingCardId)
    const overColumn=findColumnByCardId(overCardId)
    if (!activeColumn||!overColumn) return
    if (activeColumn.id!==overColumn.id) {
      moveCardBetweenDifferentColumn(overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData)
    }

  }

  const handleDragEnd=(event) => {
    const { active, over }=event
    if (!over||!active) return
    if (activeDragItemType===ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id:activeDraggingCardId, data:{ current:activeDraggingCardData } } = active
      const { id:overCardId }=over
      const activeColumn=findColumnByCardId(activeDraggingCardId)
      const overColumn=findColumnByCardId(overCardId)
      if (!activeColumn||!overColumn) return
      if (oldColumnDraggingCard.id!==overColumn.id) {


        moveCardBetweenDifferentColumn(overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData, true)
       
      } else {
        const oldCardIndex = oldColumnDraggingCard?.cards?.findIndex(col => col.id === activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex(col => col.id === overCardId)
        const dndOrderedCards = arrayMove(oldColumnDraggingCard?.cards, oldCardIndex, newCardIndex)
        if (oldCardIndex!==newCardIndex) {
          setOrderedColumns(prevColumns => {
            const nextColumns = cloneDeep(prevColumns)
            const targetColumn = nextColumns.find(column => column.id === overColumn.id)

            // Clone từng card và cập nhật orderIndex
            const updatedCards = dndOrderedCards.map((card, index) => ({
              ...card,
              orderIndex: index
            }))

            // Gán mảng mới vào cards
            if (targetColumn) {
              targetColumn.cards = updatedCards
            }

            return nextColumns
          })
          console.log("okok")
          moveCardInColumn(dndOrderedCards, findColumnByCardId(activeDragItemId).id)
        }

      }
    }
    if (activeDragItemType===ACTIVE_DRAG_ITEM_TYPE.COLUMN&&active.id !== over.id) {
      const oldColumnIndex = orderedColumns.findIndex(col => col.id === active.id)
      const newColumnIndex = orderedColumns.findIndex(col => col.id === over.id)
      const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
      const updatedColumns = dndOrderedColumns.map((column, index) => ({
        ...column,
        orderIndex: index
      }))


      setOrderedColumns(updatedColumns)
      moveColumnInBoard(updatedColumns)

    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnDraggingCard(null)
  }
  const dropAnimation={
    sideEffects:defaultDropAnimationSideEffects({ styles:{ active: { opacity:'0.5' } } })
  }

  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
    const pointerIntersections = pointerWithin(args)
    if (!pointerIntersections?.length) return

    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      const intersectColumn = orderedColumns.find(col => col.id === overId)
      if (intersectColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container =>
            container.id !== overId && intersectColumn.cards.some(card => card.id === container.id)
          )
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} collisionDetection={collisionDetectionStrategy}>
      <Box sx={{
        width: '100%',
        height: `calc(100vh - ${(theme) => theme.customProperties.boardContentHeight})`,
        backgroundColor: 'background.paper'
      }}
      >

        <ListColumns columns={orderedColumns} createColumn={createColumn} createCard={createCard} boardId={board.id} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType&&null}
          {(activeDragItemType===ACTIVE_DRAG_ITEM_TYPE.COLUMN) &&<Column column={activeDragItemData}/>}
          {(activeDragItemType===ACTIVE_DRAG_ITEM_TYPE.CARD) &&<Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}
export default BoardContent
