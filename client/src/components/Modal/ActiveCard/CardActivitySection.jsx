import moment from 'moment'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { useState, useRef } from 'react'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import { useColorScheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Popover from '@mui/material/Popover'

import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../redux/user/userSlice'
import { selectCurrentActiveCard } from '../../../redux/activeCard/activeCardSlice'
import CardAttachments from './CardAttachments'

function CardActivitySection({ cardsComment = [], onAddCardComment, onUpdateCardComment, onDeleteCardComment }) {
  const currentUser = useSelector(selectCurrentUser)
  const { mode } = useColorScheme();
  const card = useSelector(selectCurrentActiveCard)
  const cardId = card?.id
  // Sort comments by createdAt in descending order (newest first)
  const safeComments = Array.isArray(cardsComment) ? [...cardsComment] : [];
  const userId = currentUser?.id
  function getInitials(name) {
    if (!name) return '?';
    return name.trim().charAt(0).toUpperCase();
  }

  // State for comment editor
  const [isEditing, setIsEditing] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const textareaRef = useRef(null);

  // State for editing comment
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  // State for delete popover
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);

  const handleAddCardComment = async () => {
    if (!commentValue.trim()) return;
    const commentToAdd = {
      content: commentValue.trim(),
      cardId: cardId,
      userId: userId
    };
    await onAddCardComment(commentToAdd);
    setCommentValue('');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCommentValue('');
    setIsEditing(false);
  };

  const handleEditComment = async (commentId) => {
    if (!editingValue.trim()) return;
    if (onUpdateCardComment) {
      await onUpdateCardComment(commentId, { content:editingValue});
    }
    setEditingCommentId(null);
    setEditingValue('');
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingValue('');
  };

  const handleOpenDeletePopover = (event, commentId) => {
    setDeletingCommentId(commentId);
    setDeleteAnchorEl(event.currentTarget);
  };

  const handleCloseDeletePopover = () => {
    setDeletingCommentId(null);
    setDeleteAnchorEl(null);
  };

  const handleConfirmDelete = async () => {
    if (onDeleteCardComment && deletingCommentId) {
      await onDeleteCardComment(deletingCommentId);
    }
    setDeletingCommentId(null);
    setDeleteAnchorEl(null);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Xử lý thêm comment vào Card */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Avatar 
          sx={{ bgcolor: 'theme.palette.primary.main', width: 36 , height: 36 , fontWeight: 'bold', fontSize: 20 }} 
          src={currentUser?.avatar && currentUser.avatar.trim() !== '' ? currentUser.avatar : undefined} 
          alt={currentUser?.displayName}
        >
          {((!currentUser?.avatar || currentUser.avatar.trim() === '') && currentUser?.displayName) ? currentUser.displayName[0].toUpperCase() : '?'}
        </Avatar>
        {!isEditing ? (
          <TextField
            fullWidth
            placeholder="Write a comment..."
            type="text"
            variant="outlined"
            multiline
            minRows={1}
            maxRows={2}
            value={commentValue}
            onFocus={() => setIsEditing(true)}
            onClick={() => setIsEditing(true)}
            onChange={e => setCommentValue(e.target.value)}
            sx={{
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#22272b' : '#fff',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                minHeight: '40px',
                padding: '4px 14px',
                fontSize: 16,
                background: 'inherit',
                boxShadow: 'none',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: (theme) => theme.palette.mode === 'dark' ? '#bfc6d1' : '#b1b1b1',
                opacity: 1,
              },
            }}
          />
        ) : (
          <Box sx={{ flex: 1 }}>
            <Box data-color-mode={mode}>
              <MDEditor
                value={commentValue}
                onChange={setCommentValue}
                previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
                height={100}
                preview="edit"
                visiableDragbar={false}
                textareaProps={{
                  placeholder: "Write a comment...",
                  style: { minHeight: 60, maxHeight: 120 }
                }}
                style={{
                  background: mode === 'dark' ? '#22272b' : '#fff',
                  borderRadius: 8,
                  marginBottom: 8
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
              <Button
                onClick={handleCancel}
                variant="text"
                size="small"
                sx={{ color: '#888', minWidth: 64 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCardComment}
                variant="contained"
                color="info"
                size="small"
                sx={{ minWidth: 64 }}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Hiển thị danh sách các comments */}
      {safeComments.length === 0 &&
        <Typography sx={{ pl: '45px', fontSize: '14px', fontWeight: '500', color: '#b1b1b1' }}>No activity found!</Typography>
      }
      {safeComments.map((comment, index) => {
        const displayName = comment.user?.displayName || 'User';
        const avatar = comment.user?.avatar;
        const isEditingThis = editingCommentId === comment.id;
        return (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }} key={index}>
            <Avatar sx={{ bgcolor: 'theme.palette.primary.main', mr: 1, width: 36, height: 36, fontWeight: 'bold', fontSize: 18 }} src={avatar} alt={displayName}>
              {!avatar && getInitials(displayName)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography sx={{ fontWeight: 'bold', mr: 1 }}>{displayName}</Typography>
                <Typography sx={{ color: '#888', fontSize: 13 }}>
                  {comment.createdAt ? moment(comment.createdAt).fromNow() : ''}
                  {comment.updatedAt ? ' (Edited)' : ''}
                </Typography>
              </Box>
              {isEditingThis ? (
                <Box data-color-mode={mode}>
                  <MDEditor
                    value={editingValue}
                    onChange={setEditingValue}
                    previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
                    height={100}
                    preview="edit"
                    visiableDragbar={false}
                    textareaProps={{
                      placeholder: "Edit your comment...",
                      style: { minHeight: 60, maxHeight: 120 }
                    }}
                    style={{
                      background: mode === 'dark' ? '#22272b' : '#fff',
                      borderRadius: 8,
                      marginBottom: 8
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
                    <Button
                      onClick={() => handleEditComment(comment.id)}
                      variant="contained"
                      color="info"
                      size="small"
                      sx={{ minWidth: 64 }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="text"
                      size="small"
                      sx={{ color: '#888', minWidth: 64 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? '#22272b' : '#f4f5f7',
                  borderRadius: 2,
                  p: 1.2,
                  fontSize: 15,
                  mb: 0.5
                }}>
                  {comment.content}
                </Box>
              )}
              {currentUser?.id === comment.user?.id && !isEditingThis && (
                <Box sx={{ display: 'flex', gap: 1, color: '#888', fontSize: 13 }}>
                  <Typography sx={{ cursor: 'pointer' }} onClick={() => {
                    setEditingCommentId(comment.id);
                    setEditingValue(comment.content);
                  }}>Edit</Typography>
                  <Typography sx={{ cursor: 'pointer' }}>•</Typography>
                  <Typography sx={{ cursor: 'pointer' }} onClick={(e) => handleOpenDeletePopover(e, comment.id)}>Delete</Typography>
                </Box>
              )}
            </Box>
          </Box>
        );
      })}

      <Popover
        open={Boolean(deleteAnchorEl)}
        anchorEl={deleteAnchorEl}
        onClose={handleCloseDeletePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#22272b' : '#fff',
            borderRadius: 2,
            minWidth: 180,
            boxShadow: 3,
            p: 2
          }
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, mb: 1 }}>
            Delete comment?
            <IconButton onClick={handleCloseDeletePopover} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography sx={{ fontSize: 14, color: (theme) => theme.palette.text.primary, mb: 2 }}>
            This comment will be permanently deleted and cannot be undone.
          </Typography>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ width: '100%', fontWeight: 700, fontSize: 14 }}
          >
            Delete comment
          </Button>
        </Box>
      </Popover>

      
    </Box>
  )
}

export default CardActivitySection
