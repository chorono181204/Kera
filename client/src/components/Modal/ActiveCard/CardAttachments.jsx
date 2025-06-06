import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import moment from 'moment'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'

function CardAttachments({ attachments = [], onAdd, onDeleteAttachment  }) {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [deleteAnchorEl, setDeleteAnchorEl] = useState(null)
  const [openDeletePopover, setOpenDeletePopover] = useState(false)

  const handleMenuOpen = (event, file) => {
    setMenuAnchorEl(event.currentTarget)
    setSelectedFile(file)
  }
  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    // Không reset selectedFile ở đây để popover còn dùng
  }

  const handleDownload = () => {
    if (selectedFile) {
      const link = document.createElement('a')
      link.href = selectedFile.url
      link.download = selectedFile.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    handleMenuClose()
  }

  // Khi chọn Delete ở menu
  const handleDelete = () => {
    setOpenDeletePopover(true)
    setDeleteAnchorEl(menuAnchorEl) // anchorEl là nút ba chấm
    setMenuAnchorEl(null)
  }
  const handleCloseDeletePopover = () => {
    setOpenDeletePopover(false)
    setDeleteAnchorEl(null)
    setSelectedFile(null)
  }
  const handleConfirmDelete = () => {
    if (selectedFile && onDeleteAttachment) onDeleteAttachment(selectedFile)
    setOpenDeletePopover(false)
    setDeleteAnchorEl(null)
    setSelectedFile(null)
  }

  if (!attachments.length && !onAdd) return null

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 22, color: '#172b4d' }}>
          <AttachFileOutlinedIcon sx={{ mr: 1, fontSize: 26 }} />
          Attachments
        </Typography>
        {onAdd && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{ minWidth: 0, px: 2, fontWeight: 600 }}
          >
            Add
          </Button>
        )}
      </Box>
      <Typography sx={{ fontWeight: 500, color: '#888', mb: 1, fontSize: 15 }}>
        File
      </Typography>
      {attachments.map(file => (
        <Box
          key={file.id || file.url}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 1,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#22272b' : '#f4f5f7',
            borderRadius: 2,
            p: 1.2
          }}
        >
          <Box
            sx={{
              minWidth: 48,
              minHeight: 48,
              bgcolor: '#e0e0e0',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 18
            }}
          >
            {file.name?.split('.').pop()?.toUpperCase()}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 600 }}>{file.name}</Typography>
            <Typography sx={{ fontSize: 13, color: '#888' }}>
              Added {file.createdAt ? moment(file.createdAt).fromNow() : ''}
            </Typography>
          </Box>
          <IconButton href={file.url} target="_blank" rel="noopener" size="small">
            <OpenInNewIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={e => handleMenuOpen(e, file)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDownload}>Download</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Delete</MenuItem>
      </Menu>
      <Popover
        open={openDeletePopover}
        anchorEl={deleteAnchorEl}
        onClose={handleCloseDeletePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            minWidth: 180,
            borderRadius: 2,
            p: 2,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#22272b' : '#fff'
          }
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 1 }}>
          Remove attachment?
        </Typography>
        <Typography sx={{ fontSize: 14, mb: 2 }}>
          Are you sure you want to remove this attachment?
        </Typography>
        <Button
          onClick={handleConfirmDelete}
          variant="contained"
          color="error"
          sx={{ width: '100%', fontWeight: 700 }}
        >
          Remove
        </Button>
      </Popover>
    </Box>
  )
}

export default CardAttachments 
