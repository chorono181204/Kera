import React from 'react'
import {
  Box
} from '@mui/material'
import Card from './Card/Card.jsx'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
const ListCards = ({ cards , openNewCardForm }) => {
    const COLUMN_HEADER_HEIGHT = '50px'
    const COLUMN_FOOTER_HEIGHT = !openNewCardForm? '50px':'100px'


    return (
    <SortableContext items={cards?.map(card => card.id)} strategy={verticalListSortingStrategy}>
      <Box sx={{ display:'flex', flexDirection: 'column', p:1, marginX:1, gap:1, overflowX:'hidden', overflowY:'auto',
        '&::-webkit-scrollbar-thumb':{ backgroundColor:'#ced0da' },
        '&::-webkit-scrollbar-thumb:hover':{ backgroundColor:'#bfc2cf' },
        maxHeight:(theme) => `calc(${theme.customProperties.boardContentHeight} - ${theme.spacing(6)} - ${COLUMN_HEADER_HEIGHT} - ${COLUMN_FOOTER_HEIGHT})`
      }}>
        {cards?.map(card => (<Card index={card.id} card={card} key={card.id} />))}
      </Box>
    </SortableContext>
  )
}
export default ListCards
