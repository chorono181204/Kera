import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  Box,
  Button, InputAdornment,
  Menu,
  MenuItem, TextField,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import AddCardIcon from '@mui/icons-material/AddCard'
import ListCards from './ListCards/ListCards.jsx'
import { mapOrder } from '../../../../../utils/sorts.js'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CloseIcon from '@mui/icons-material/Close'
import {toast} from 'react-toastify';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Popover from '@mui/material/Popover';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { deleteColumnAPI, moveColumnInBoardAPI, updateColumnAPI } from '../../../../../apis/index'
import { arrayMove } from '@dnd-kit/sortable'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '../../../../../redux/activeBoard/activeBoardSlice'




const Column = ({ column, createCard, updateColumnTitle, onOpenMovePopover }) => {
  const activeBoard = useSelector(selectCurrentActiveBoard)
  const columns = activeBoard?.columns || []
  const boardId = activeBoard?.id
  const currentUser = useSelector(state => state.user.currentUser);
  const boardUsers = activeBoard?.boardUsers || [];
  const currentUserBoardRole = useMemo(() => {
    const found = boardUsers.find(u => (u.user?.id) === currentUser?.id);
    return found?.role || '';
  }, [boardUsers, currentUser]);
  const canDeleteColumn =
    column.createdBy === currentUser?.username ||
    currentUserBoardRole === 'OWNER' ||
    currentUserBoardRole === 'MANAGER';

  const orderedCards=column?.cards
  const { attributes, listeners, setNodeRef, transform, transition, isDragging }=useSortable(
    {
      id:column.id,
      data:{ ...column }
    }
  )
  const dndKitColumnStyles = {
    transform:CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    height: 'calc(100vh - 166px)'


  }

  const [anchorEl, setAnchorEl] = React.useState(null )
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [cardTitleValue, setCardTitleValue]=useState('')
  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm)
    setCardTitleValue('')
  }
  const addNewColumn= () => {
    if (!cardTitleValue) {
      toast.warn('Please enter a card title')

    }
    const data={
      columnId:column.id,
      title:cardTitleValue,
    }
    createCard(data)
    setOpenNewCardForm(!openNewCardForm)
    setCardTitleValue('')
  }
  const COLUMN_HEADER_HEIGHT = '50px'
  const COLUMN_FOOTER_HEIGHT = !openNewCardForm? '50px':'100px'

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(column?.title || '')
  const inputRef = useRef(null)

  // Focus input when editing
  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditingTitle])

  const handleTitleClick = () => {
    setIsEditingTitle(true)
  }

  const handleTitleChange = (e) => {
    setTitleValue(e.target.value)
  }

  const handleTitleBlurOrEnter = async (e) => {
    if (e.type === 'blur' || (e.type === 'keydown' && e.key === 'Enter')) {
      setIsEditingTitle(false)
      if (titleValue.trim() && titleValue !== column.title) {
        try {
          await updateColumnAPI(column.id, { title: titleValue })
          // Nếu có props updateColumnTitle thì gọi để cập nhật lại board ngoài
          if (updateColumnTitle) await updateColumnTitle(column.id, titleValue)
        } catch (error) {
          toast.error('Failed to update column title')
          setTitleValue(column.title)
        }
      } else {
        setTitleValue(column.title)
      }
    }
  }

  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deleteAnchorEl, setDeleteAnchorEl] = useState(null)

  const moreButtonRef = useRef(null);

  const handleMove = () => {
    handleClose();
    setTimeout(() => {
      if (typeof onOpenMovePopover === 'function') {
        onOpenMovePopover(column, moreButtonRef.current, columns.findIndex(col => col.id === column.id) + 1);
      }
    }, 0);
  }

  const handleOpenDeleteModal = (event) => {
    setOpenDeleteModal(true)
    setDeleteAnchorEl(event.currentTarget)
    handleClose()
  }
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setDeleteAnchorEl(null)
  }
  const handleDeleteColumn = async () => {
    try {
      await deleteColumnAPI(column.id)
    } catch (error) {
      // Có thể xử lý lỗi nếu muốn
    }
    setOpenDeleteModal(false)
    setDeleteAnchorEl(null)
  }

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes} >
      <Box
        {...listeners}
        sx={{
          minWidth:'300px',
          maxWidth:'300px',
          backgroundColor: 'background.default',
          borderRadius:'10px',
          height:'fit-content',
          maxHeight: (theme) => `calc(${theme.customProperties.boardContentHeight} - ${theme.spacing(6)})`
        }}>
        <Box sx={{
          height: COLUMN_HEADER_HEIGHT,
          p:2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {isEditingTitle ? (
            <TextField
              inputRef={inputRef}
              value={titleValue}
              onChange={handleTitleChange}
              onBlur={handleTitleBlurOrEnter}
              onKeyDown={handleTitleBlurOrEnter}
              variant="outlined"
              size="small"
              sx={{
                width: '90%',
                '& .MuiInputBase-root': {
                  backgroundColor: (theme) => theme.palette.background.default,
                  color: (theme) => theme.palette.text.primary,
                  fontWeight: 'bold',
                  fontSize: 20,
                  borderRadius: 2,
                  padding: '2px 8px',
                },
                '& input': {
                  padding: 0,
                  height: '28px',
                }
              }}
              inputProps={{
                style: {
                  fontWeight: 'bold',
                  fontSize: 20,
                  padding: 0,
                  height: '28px',
                }
              }}
            />
          ) : (
            <Typography
              variant='h6'
              sx={{ cursor:'pointer', userSelect: 'none' }}
              onClick={handleTitleClick}
              title="Click để đổi tên cột"
            >
              {titleValue}
            </Typography>
          )}
          <Box>
            <Tooltip title='More options'>
              <Button
                ref={moreButtonRef}
                id="basic-button-workspaces"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ filter: 'brightness(100%)', // Độ sáng ban đầu
                  display: 'flex', justifyContent: 'center', alignItems: 'center', color:'text.primary' }}
              >
                <MoreHorizIcon/>
              </Button>
            </Tooltip>
            <Menu
              id="basic-menu-workspaces"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button-workspaces'
              }}
              PaperProps={{
                sx: { minWidth: 180 }
              }}
            >
              <MenuItem onClick={handleMove}>
                <ArrowForwardIcon fontSize="small" sx={{mr:1}} /> Move
              </MenuItem>
              {canDeleteColumn && (
                <MenuItem onClick={handleOpenDeleteModal}>
                  <DeleteOutlineIcon fontSize="small" sx={{mr:1, color: 'error.main'}} /> Delete
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Box>
        <ListCards cards={orderedCards} openNewCardForm={openNewCardForm} createCard={createCard} columnId={column.id} />

        <Box sx={{
          height: COLUMN_FOOTER_HEIGHT,
          p:2,
          display: 'flex',
          alignItems: 'center',

        }}>
          {!openNewCardForm?

            <Button sx={{ color:'text.primary', width:'100%', display:'flex', justifyContent:'start' }} startIcon={<AddCardIcon/>} onClick={toggleOpenNewCardForm}>
                Add new card
            </Button>

            :
            <Box sx={{ width:'100%', gap:1, p:1, display:'flex', flexDirection:'column',paddingX:'0px',paddingBottom:'16px',paddingTop:'16px' }}>
              <TextField id="outlined-column-title"
                placeholder="Enter card title..."
                autoFocus={true}
                type="text" size={'small'}
                variant="outlined"
                value={cardTitleValue}
                onChange={(e) => setCardTitleValue(e.target.value)}
                InputProps={{ startAdornment:(
                  <InputAdornment position="start">

                  </InputAdornment>
                ),
                endAdornment:(
                  <InputAdornment position="end">
                    <CloseIcon sx={{ color: 'text.primary', fontSize:'18px', cursor:'pointer' }}
                      onClick={() => setCardTitleValue('')} />
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
                <Button variant='contained' onClick={addNewColumn}>Add card</Button>
                <Button sx={{ width:'36.5px', height:'36.5px', padding:'0px !important' }} onClick={toggleOpenNewCardForm}>
                  <CloseIcon sx={{ color: 'text.primary', fontSize:'25px', cursor:'pointer', padding:0 }}
                  />
                </Button>
              </Box>
            </Box>
          }
        </Box>
      </Box>
      {/* Delete Popover giữ nguyên */}
      <Popover
        open={openDeleteModal}
        anchorEl={deleteAnchorEl}
        onClose={handleCloseDeleteModal}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 2, minWidth: 220 } }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Confirm Delete</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>Are you sure you want to delete this column?</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={handleCloseDeleteModal} size="small">Cancel</Button>
          <Button onClick={handleDeleteColumn} color="error" variant="contained" size="small">Delete</Button>
        </Box>
      </Popover>
    </div>
  )
}
export default Column
