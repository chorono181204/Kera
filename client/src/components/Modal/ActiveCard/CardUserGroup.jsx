import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import AddIcon from '@mui/icons-material/Add'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '../../../redux/activeBoard/activeBoardSlice'
import { CARD_MEMBER_ACTIONS } from '../../../utils/constants'
import UserCardPopover from '../User/UserCardPopover'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { removeUserFromCardAPI, addUserToCardAPI } from '../../../apis'
import { selectCurrentActiveCard } from '../../../redux/activeCard/activeCardSlice'
function CardUserGroup({ cardId, cardUsers = [], onUpdateCardMembers }) {
  
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-users-popover' : undefined
  const card=useSelector(selectCurrentActiveCard)
  const [userPopover, setUserPopover] = useState({ anchorEl: null, user: null })

  const [searchText, setSearchText] = useState('')

  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const handleUserClick = (event, user) => {
    setUserPopover({ anchorEl: event.currentTarget, user })
  }

  const handleCloseUserPopover = () => {
    setUserPopover({ anchorEl: null, user: null })
  }

  const board = useSelector(selectCurrentActiveBoard)
  const allUsers = Array.isArray(board?.boardUsers) ? board.boardUsers : []

 
  const cardUserIds = cardUsers.map(cardUser => cardUser.user?.id)
  // Danh sách user object là thành viên card
  const cardMembers = cardUsers.map(cu => cu.user).filter(Boolean)
  // Danh sách user object là thành viên board nhưng chưa ở card
  const boardMembers = allUsers
    .map(u => u.user)
    .filter(Boolean)
    .filter(u => !cardMembers.some(cm => cm.id === u.id))

  const filterBySearch = (users) =>
    users.filter(u => u.displayName?.toLowerCase().includes(searchText.toLowerCase()))

  const handleUpdateCardMembers = async (user) => {
    const incomingUserInfo = {
      userId: user.id,
      action: cardUserIds.includes(user.id)
        ? CARD_MEMBER_ACTIONS.REMOVE
        : CARD_MEMBER_ACTIONS.ADD
    }
    if (incomingUserInfo.action === CARD_MEMBER_ACTIONS.ADD) {
      await addUserToCardAPI({ userId: user.id, cardId: card.id, role: 'MEMBER' });
    }
    onUpdateCardMembers(incomingUserInfo);
  }

  // Hàm remove user khỏi card
  const handleRemoveUser = async (user) => {
    const cardUser = cardUsers.find(cu => cu.user?.id === user.id);
    if (!cardUser) return;
    await removeUserFromCardAPI(card.id, cardUser.id);
    if (onUpdateCardMembers) onUpdateCardMembers();
  };

  return (
    <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {/* Hiển thị các user là thành viên của card */}
      {cardUsers.map((cardUser, index) =>
        <Tooltip title={cardUser.user?.displayName} key={cardUser.user?.id || index}>
          <Avatar
            sx={{ width: 34, height: 34, cursor: 'pointer' }}
            alt={cardUser.user?.displayName}
            src={cardUser.user?.avatar}
            onClick={(e) => handleUserClick(e, cardUser.user)}
          >
            {(!cardUser.user?.avatar && cardUser.user?.displayName) ? cardUser.user.displayName[0].toUpperCase() : ''}
          </Avatar>
        </Tooltip>
      )}

      {/* Nút này để mở popover thêm member */}
      <Tooltip title="Add new member">
        <Box
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          sx={{
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '50%',
            color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : theme.palette.grey[200],
            '&:hover': {
              color: (theme) => theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
            }
          }}
        >
          <AddIcon fontSize="small" />
        </Box>
      </Tooltip>

      {/* Khi Click vào + ở trên thì sẽ mở popover hiện toàn bộ users trong board để người dùng Click chọn thêm vào card  */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, minWidth: 300 }}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Members</Typography>
          <TextField
            fullWidth
            placeholder="Search members"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          />
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Card members</Typography>
          {filterBySearch(cardMembers).map(user => (
            <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, bgcolor: '#f4f5f7', borderRadius: 1, p: 1 }}>
              <Avatar sx={{ width: 32, height: 32 }}>{user.displayName?.[0]?.toUpperCase()}</Avatar>
              <Typography sx={{ ml: 1, flex: 1 }}>{user.displayName}</Typography>
              <Box
                sx={{ cursor: 'pointer', color: 'error.main', fontWeight: 700, ml: 1 }}
                onClick={() => handleRemoveUser(user)}
              >X</Box>
            </Box>
          ))}
          <Typography sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Board members</Typography>
          {filterBySearch(boardMembers).map(user => (
            <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, cursor: 'pointer', bgcolor: '#e9f2ff', borderRadius: 1, p: 1 }}
              onClick={() => handleUpdateCardMembers(user)}
            >
              <Avatar sx={{ width: 32, height: 32 }}>{user.displayName?.[0]?.toUpperCase()}</Avatar>
              <Typography sx={{ ml: 1 }}>{user.displayName}</Typography>
            </Box>
          ))}
        </Box>
      </Popover>

      {/* Popover khi click vào avatar user - dùng component riêng */}
      <UserCardPopover
        open={Boolean(userPopover.anchorEl)}
        anchorEl={userPopover.anchorEl}
        user={userPopover.user}
        onClose={handleCloseUserPopover}
        onRemoveFromCard={handleRemoveUser}
        onEditProfile={() => {/* handle edit profile */}}
      />
    </Box>
  )
}

export default CardUserGroup
