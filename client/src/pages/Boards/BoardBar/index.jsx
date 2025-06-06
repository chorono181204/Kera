import React, { useState, useEffect, useMemo } from 'react'
import { AvatarGroup, Box, Button, Chip, Popover, TextField } from '@mui/material'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { capitalizeFirstLetter } from "../../../utils/formatter.js"
import InvitationModal from '../../../components/Modal/Invitation/Invitation.jsx'
import { toast } from 'react-toastify'
import { toggleBoardStarredAPI, updateBoardAPI, toggleBoardArchivedAPI, deleteBoardAPI } from '../../../apis'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../redux/user/userSlice'
import ArchiveIcon from '@mui/icons-material/Archive'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'

const LABEL_COLORS = [
  '#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0',
  '#0079bf', '#00c2e0', '#51e898', '#ff78cb', '#344563',
  '#b6bbbf', '#ff8ed4', '#ffb74d', '#ffd54f', '#81c784',
  '#4fc3f7', '#7986cb', '#9575cd', '#4db6ac', '#4dd0e1'
]

const BoardBar = (props) => {
  const { board, onBoardUpdate } = props
  const [boardType, setBoardType] = useState(board?.type || 'public')
  const [openInvite, setOpenInvite] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState(board?.title || '')
  const [colorAnchorEl, setColorAnchorEl] = useState(null)
  const allUsers = Array.isArray(board?.boardUsers) ? board.boardUsers : []
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const [deleteAnchorEl, setDeleteAnchorEl] = useState(null)
  const openDeletePopover = Boolean(deleteAnchorEl)

  // Get current user's role in the board
  const currentUserBoardRole = useMemo(() => {
    const found = allUsers.find(u => (u.user?.id || u.id) === user.id);
    if (!found) return '';
    if (found.role === 'OWNER') return 'Owner';
    if (found.role === 'MANAGER') return 'Manager';
    return 'Member';
  }, [allUsers, user]);

  useEffect(() => {
    setNewTitle(board?.title || '')
  }, [board?.title])

  const handleToggleType = async () => {
    try {
      const newType = boardType === 'public' ? 'private' : 'public'
      await updateBoardAPI(board.id, { type: newType })
      setBoardType(newType)
      if (onBoardUpdate) onBoardUpdate()
    } catch (error) {
      toast.error('Failed to update board type')
    }
  }

  const handleUpdateTitle = async () => {
    if (!newTitle.trim()) {
      toast.error('Board title cannot be empty!')
      setNewTitle(board?.title || '')
      setEditingTitle(false)
      return
    }
    if (newTitle === board.title) {
      setEditingTitle(false)
      return
    }
    try {
      await updateBoardAPI(board.id, { title: newTitle.trim() })
      setEditingTitle(false)
      if (onBoardUpdate) onBoardUpdate()
    } catch (error) {
      toast.error('Failed to update board title')
      setNewTitle(board?.title || '')
      setEditingTitle(false)
    }
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleUpdateTitle()
    } else if (e.key === 'Escape') {
      setNewTitle(board?.title || '')
      setEditingTitle(false)
    }
  }

  const handleColorClick = (event) => {
    setColorAnchorEl(event.currentTarget)
  }

  const handleColorClose = () => {
    setColorAnchorEl(null)
  }

  const handleColorSelect = async (color) => {
    try {
      await updateBoardAPI(board.id, { color })
      if (onBoardUpdate) onBoardUpdate()
      handleColorClose()
    } catch (error) {
      toast.error('Failed to update board color')
    }
  }

  const handleToggleStarred = async () => {
    try {
      await toggleBoardStarredAPI(board.id,user?.id)
      if (onBoardUpdate) onBoardUpdate()
      toast.success(board.starred ? 'Board unstarred' : 'Board starred')
    } catch (error) {
      toast.error('Failed to update board starred status')
    }
  }
  const handleToggleArchived = async () => {
    try {
      await toggleBoardArchivedAPI(board.id,user?.id)
      if (onBoardUpdate) onBoardUpdate()
      toast.success(board.archived ? 'Board unarchived' : 'Board archived')
    } catch (error) {
      toast.error('Failed to update board archived status')
    }
  }

  const handleDeleteClick = (event) => {
    setDeleteAnchorEl(event.currentTarget)
  }

  const handleDeleteClose = () => {
    setDeleteAnchorEl(null)
  }

  const handleDeleteConfirm = async () => {
    handleDeleteClose()
    try {
      await deleteBoardAPI(board.id)
      toast.success('Board deleted successfully')
      navigate('/boards')
    } catch (error) {
      toast.error('Failed to delete board')
    }
  }

  return (
    <Box sx={{ 
      backgroundColor: 'background.paper',
      width: '100%',
      height: (theme) => theme.customProperties.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      overflowX: 'auto',
      borderBottom: (theme) => `1px solid ${theme.palette.background.default}`,
      justifyContent: 'space-between',
      paddingX: '20px'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {editingTitle ? (
          <TextField
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={handleTitleKeyDown}
            autoFocus
            variant="standard"
            InputProps={{
              startAdornment: <SpaceDashboardIcon sx={{ mr: 1, color: 'text.primary' }} />,
              sx: {
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'text.primary',
                '&:before, &:after': {
                  display: 'none'
                }
              }
            }}
            sx={{
              minWidth: '200px',
              '& .MuiInputBase-root': {
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }
            }}
            disabled={currentUserBoardRole !== 'Owner'}
          />
        ) : (
          <Chip 
            icon={<SpaceDashboardIcon />}
            label={board?.title}
            clickable={currentUserBoardRole === 'Owner'}
            onDoubleClick={() => {
              if (currentUserBoardRole === 'Owner') {
                setNewTitle(board?.title || '')
                setEditingTitle(true)
              }
            }}
            sx={{ 
              color: 'text.primary',
              backgroundColor: 'background.paper',
              borderRadius: '4px',
              paddingX: '0px',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              '& .MuiSvgIcon-root': {
                color: 'text.primary'
              }
            }} 
          />
        )}

        <Box
          onClick={currentUserBoardRole === 'Owner' ? handleColorClick : undefined}
          sx={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            backgroundColor: board?.color || '#b3bac5',
            cursor: currentUserBoardRole === 'Owner' ? 'pointer' : 'not-allowed',
            border: '2px solid',
            borderColor: 'background.paper',
            '&:hover': {
              opacity: currentUserBoardRole === 'Owner' ? 0.8 : 1
            }
          }}
        />

        <Popover
          open={Boolean(colorAnchorEl)}
          anchorEl={colorAnchorEl}
          onClose={handleColorClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
            {LABEL_COLORS.map((color) => (
              <Box
                key={color}
                onClick={() => handleColorSelect(color)}
                sx={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  backgroundColor: color,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: board?.color === color ? 'primary.main' : 'transparent',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              />
            ))}
          </Box>
        </Popover>

        <Box
          onClick={handleToggleStarred}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          {board?.starred ? (
            <StarIcon sx={{ color: '#FFD600', fontSize: 22 }} />
          ) : (
            <StarBorderIcon sx={{ color: 'text.primary', fontSize: 22 }} />
          )}
        </Box>

        <Chip
          icon={boardType === 'public' ? <PublicIcon /> : <LockIcon />}
          label={capitalizeFirstLetter(boardType)}
          clickable={currentUserBoardRole === 'Owner'}
          onClick={currentUserBoardRole === 'Owner' ? handleToggleType : undefined}
          sx={{ 
            color: 'text.primary',
            backgroundColor: 'background.paper',
            borderRadius: '4px',
            paddingX: '0px',
            fontSize: 14,
            cursor: currentUserBoardRole === 'Owner' ? 'pointer' : 'not-allowed',
            '& .MuiSvgIcon-root': {
              color: 'text.primary'
            }
          }}
        />

        <Chip 
          icon={<ArchiveIcon />}
          label='Archive'
          clickable 
          onClick={handleToggleArchived}
          sx={{ 
            color: 'text.primary',
            backgroundColor: 'background.paper',
            borderRadius: '4px',
            paddingX: '0px',
            '& .MuiSvgIcon-root': {
              color: 'text.primary'
            }
          }} 
        />
        {currentUserBoardRole === 'Owner' && (
          <>
            <Chip
              icon={<DeleteIcon />}
              label='Delete'
              clickable
              onClick={handleDeleteClick}
              sx={{
                color: 'text.primary',
                backgroundColor: 'background.paper',
                borderRadius: '4px',
                paddingX: '0px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                },
                '& .MuiSvgIcon-root': {
                  color: 'text.primary'
                }
              }}
            />
            <Popover
              open={openDeletePopover}
              anchorEl={deleteAnchorEl}
              onClose={handleDeleteClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              <Box sx={{ p: 2, minWidth: 200 }}>
                <Typography mb={2}>Are you sure you want to delete this board?</Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button size="small" onClick={handleDeleteClose}>Cancel</Button>
                  <Button size="small" color="error" variant="contained" onClick={handleDeleteConfirm}>Delete</Button>
                </Box>
              </Box>
            </Popover>
          </>
        )}
      
        
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {currentUserBoardRole === 'Owner' && (
          <Button 
            variant="contained" 
            startIcon={<PersonAddIcon/>} 
            onClick={() => setOpenInvite(true)}
          >
            Invite
          </Button>
        )}
        <AvatarGroup 
          max={6} 
          sx={{ 
            gap: '10px', 
            '& .MuiAvatar-root': {
              width: 30, 
              height: 30, 
              border: 'none', 
              '&:first-of-style': { 
                bgcolor: 'text.primary' 
              } 
            } 
          }}
        >
          {allUsers.map((boardUser, index) => (
            <Avatar
              key={boardUser?.user?.id || index}
              sx={{ width: 34, height: 34 }}
              alt={boardUser?.user?.displayName}
              src={boardUser?.user?.avatar || undefined}
            >
              {((!boardUser?.user?.avatar || boardUser?.user?.avatar === '') && boardUser?.user?.displayName) ? boardUser?.user?.displayName[0].toUpperCase() : ''}
            </Avatar>
          ))}
        </AvatarGroup>
      </Box>

      <InvitationModal 
        open={openInvite} 
        onClose={() => setOpenInvite(false)} 
        boardId={board?.id} 
        boardUsers={board?.boardUsers} 
        requests={board?.requests} 
      />
    </Box>
  )
}

export default BoardBar
