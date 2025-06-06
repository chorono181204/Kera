import React, { useCallback, useRef, useState } from 'react'
import {
  Box, Button, InputAdornment, TextField
} from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import Column from './Column/Column.jsx'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import CloseIcon from '@mui/icons-material/Close.js'
import { toast } from 'react-toastify'
import Popover from '@mui/material/Popover'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { arrayMove } from '@dnd-kit/sortable'
import { moveColumnInBoardAPI } from '../../../../apis'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '../../../../redux/activeBoard/activeBoardSlice'

const ListColumns = ({ columns, createColumn, boardId ,createCard }) => {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [columnTitleValue, setColumnTitleValue]=useState('')
  const [movePopoverOpen, setMovePopoverOpen] = useState(false)
  const [moveAnchorEl, setMoveAnchorEl] = useState(null)
  const [moveColumn, setMoveColumn] = useState(null)
  const [movePosition, setMovePosition] = useState(1)
  const activeBoard = useSelector(selectCurrentActiveBoard)
  const allColumns = activeBoard?.columns || columns || []

  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
    setColumnTitleValue('')
  }
  const addNewColumn= () => {
    if (!columnTitleValue) {
      toast.warn('Please enter a column title')
    }
    const data={
      title:columnTitleValue,
      boardId:boardId
    }
    createColumn(data)
    setOpenNewColumnForm(!openNewColumnForm)
    setColumnTitleValue('')
  }
  const handleOpenMovePopover = (column, anchor, position) => {
    setMovePopoverOpen(true)
    setMoveAnchorEl(anchor)
    setMoveColumn(column)
    setMovePosition(position)
  }
  const handleCloseMovePopover = () => {
    setMovePopoverOpen(false)
    setMoveAnchorEl(null)
    setMoveColumn(null)
  }
  const handleMoveColumn = async (newPosition) => {
    if (!moveColumn || !boardId) return;
    const oldIndex = allColumns.findIndex(col => col.id === moveColumn.id);
    const newIndex = newPosition - 1;
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
      handleCloseMovePopover();
      return;
    }
    handleCloseMovePopover();
    try {
      await moveColumnInBoardAPI({ boardId, columnIds: arrayMove(allColumns, oldIndex, newIndex).map(col => col.id) });
    } catch (error) {}
  };
  return (
    <SortableContext items={columns?.map(column => column.id)} strategy={horizontalListSortingStrategy} >
      <Box sx={{ display: 'flex',
        paddingLeft:'15px',
        paddingTop:'20px',
        paddingBottom:'10px',
        gap:2,
        overflowX: 'auto',
        overflowY: 'hidden',
        height: '100%'
      }}>
        {columns?.map((column, index) => (
          <Column key={column.id} column={column} index={index} createCard={createCard} onOpenMovePopover={handleOpenMovePopover} />
        ))}
        {!openNewColumnForm ?
          <Button sx={{ color:'text.primary', width:'300px', display:'flex', backgroundColor: 'background.default', height:'50px', minWidth:'300px', borderRadius: '10px' }} startIcon={<NoteAddIcon/>} onClick={toggleOpenNewColumnForm}>
                  Add new column
          </Button>
          :<Box sx={{ minWidth:'300px', width:'250px', gap:1, p:1, borderRadius:'6px', height:'fit-content', minHeight:'50px', backgroundColor: 'background.default', display:'flex', flexDirection:'column', paddingX:'16px' }}>
            <TextField id="outlined-column-title"
              placeholder="Enter column title..."
              autoFocus={true}
              type="text" size={'small'}
              variant="outlined"
              value={columnTitleValue}
              onChange={(e) => setColumnTitleValue(e.target.value)}
              InputProps={{ startAdornment:(
                <InputAdornment position="start">

                </InputAdornment>
              ),
              endAdornment:(
                <InputAdornment position="end">
                  <CloseIcon sx={{ color: 'text.primary', fontSize:'18px', cursor:'pointer' }}
                    onClick={() => setColumnTitleValue('')} />
                </InputAdornment>
              )
              }}

              sx={{ width:'268px'
                , '& label': { color:'text.primary' }
                , '& input': { color:'text.primary' }
                , '& label.Mui-focused': { color:'text.primary' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'text.primary' // Border mặc định (xám nhạt)
                  },
                  '&:hover fieldset': {
                    borderColor: 'text.primary' // Border khi hover (xanh của Jira)
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'text.primary' // Border khi focus (xanh của Jira)
                  }
                }
              }}/>
            <Box sx={{ display: 'flex', flexDirection:'row', alignItems:'center', gap:1 }}>
              <Button variant='contained' onClick={addNewColumn}>Add column</Button>
              <Button sx={{ width:'36.5px', height:'36.5px', padding:'0px !important' }} onClick={toggleOpenNewColumnForm}>
                <CloseIcon sx={{ color: 'text.primary', fontSize:'25px', cursor:'pointer', padding:0 }}
                />
              </Button>
            </Box>
          </Box>
        }
        <Popover
          open={movePopoverOpen && Boolean(moveAnchorEl) && !!moveColumn}
          anchorEl={moveAnchorEl}
          onClose={handleCloseMovePopover}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{ sx: { p: 2, minWidth: 260 } }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Move Card</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ minWidth: 60 }}>Position</Typography>
            <TextField
              select
              size="small"
              value={movePosition}
              onChange={e => setMovePosition(Number(e.target.value))}
              sx={{ minWidth: 80 }}
            >
              {Array.from({ length: allColumns.length }, (_, i) => i + 1)
                .filter(pos => moveColumn && pos !== allColumns.findIndex(col => col.id === moveColumn.id) + 1)
                .map(pos => (
                  <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                ))}
            </TextField>
          </Box>
          <Button variant="contained" fullWidth onClick={() => handleMoveColumn(movePosition)}>Move</Button>
        </Popover>
      </Box>
    </SortableContext>
  )
}
export default ListColumns
