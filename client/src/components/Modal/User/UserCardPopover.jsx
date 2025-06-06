import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import InfoIcon from '@mui/icons-material/Info'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import { removeUserFromCardAPI } from '../../../apis'
import { Button } from '@mui/material'
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined'

function UserCardPopover({
  open,
  anchorEl,
  user,
  onClose,
  onRemoveFromCard,
  onEditProfile,
  cardId,
  cardUsers,
  onUpdateCardMembers
}) {
  

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Box sx={{ p: 2, minWidth: 220 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{ width: 56, height: 56, mb: 1, bgcolor: '#3f51b5', fontSize: 32 }}
            alt={user?.displayName}
            src={user?.avatar}
          >
            {user?.displayName?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ fontWeight: 600, fontSize: 18 }}>{user?.displayName}</Box>
          <Box sx={{ color: 'gray', fontSize: 14 }}>@{user?.displayName}</Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              p: 1,
              borderRadius: 1,
              transition: 'background 0.2s',
              '&:hover': {
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? '#23272f' : '#f5f5f5'
              }
            }}
            onClick={() => { onEditProfile && onEditProfile(user) }}
          >
            <InfoIcon sx={{ mr: 1, color: '#1976d2' }} />
            View profile
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<PersonRemoveOutlinedIcon />}
            onClick={() => {
              onRemoveFromCard && onRemoveFromCard(user);
              onClose();
            }}
          >
            Remove
          </Button>
        </Box>
      </Box>
    </Popover>
  )
}

export default UserCardPopover 