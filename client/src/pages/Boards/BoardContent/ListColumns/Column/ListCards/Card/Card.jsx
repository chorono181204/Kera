import React from 'react'
import { Button, CardActions, CardContent, CardMedia, Typography, Box, Avatar, Tooltip } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group.js'
import CommentIcon from '@mui/icons-material/Comment.js'
import AttachmentIcon from '@mui/icons-material/Attachment.js'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import { Card as MuiCard } from '@mui/material'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch } from 'react-redux'
import { fetchCardDetailsAPI, showModalActiveCard } from '../../../../../../../redux/activeCard/activeCardSlice'
import { toast } from 'react-toastify'
import moment from 'moment'
import { getDateBadgeStatus } from '../../../../../../../utils/dateBadge'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
// Hàm lấy màu chữ tương phản với màu nền label
function getContrastTextColor(bgColor) {
  if (!bgColor) return '#000';
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1) : bgColor;
  const r = parseInt(color.substr(0,2),16);
  const g = parseInt(color.substr(2,2),16);
  const b = parseInt(color.substr(4,2),16);
  const luminance = (0.299*r + 0.587*g + 0.114*b)/255;
  return luminance > 0.5 ? '#172b4d' : '#fff';
}

const Card = ({ card }) => {
  const dispatch = useDispatch()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging }=useSortable(
    {
      id:card.id,
      data:{ ...card }
    }
  )
  const dndKitCardStyles = {
    transform:CSS.Translate.toString(transform),
      transition: transition ?? 'transform 200ms ease',
    opacity: isDragging ? 0.5 : undefined,
      willChange: 'transform',
  }
  const shouldShowCardActions = !!card?.memberIds?. length || !!card?.comments?.length || !!card?.attachments?.length

  const setActiveCard = () => {
    toast.promise(
      dispatch(fetchCardDetailsAPI(card.id)),
      { pending: 'Loading card data...' }
    ).then(() => dispatch(showModalActiveCard()))
  }

  // Format ngày cho badge
  let dateBadge = null;
  if (card?.startDate || card?.dueDate) {
    let dateStr = '';
    if (card.startDate) dateStr += moment(card.startDate).format('D [thg] M');
    if (card.startDate && card.dueDate) dateStr += ' - ';
    if (card.dueDate) dateStr += moment(card.dueDate).format('D [thg] M');
    const { badgeColor } = getDateBadgeStatus(card.startDate, card.dueDate);
    dateBadge = (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', background: badgeColor, color: '#172b4d', borderRadius: 2, px: 1.2, py: 0.3, fontWeight: 600, fontSize: 14, gap: 0.5 }}>
        <AccessTimeIcon sx={{ fontSize: 18, mr: 0.5 }} />
        {dateStr}
      </Box>
    );
  }

  // Lấy danh sách member (nếu có)
  const members = card?.cardUsers || [];

  return (
    <MuiCard
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      sx={{
        cursor: 'pointer',
        p:1.5,
        overflow:'unset',
        opacity: card?.FE_PlaceholderCard ? '0' : '1',
        minWidth: card.FE_PlaceholderCard ? '280px' : 'unset',
        pointerEvents: card.FE_PlaceholderCard ? 'none' : 'unset',
        position: card.FE_PlaceholderCard ? 'fixed' : 'unset',
        borderRadius: '10px'
      }}
      onClick={setActiveCard}
    >
      {card.cover && (
        <CardMedia
          component="img"
          image={card.cover}
          alt="cover"
          sx={{
            width: '100%',
            height: 140,
            objectFit: 'cover',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            mb: 0.5
          }}
        />
      )}
      {/* Badge labels sort by createdAt */}
      {Array.isArray(card?.labels) && card.labels.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
          {[...card.labels].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map(label => (
            <Tooltip title={label.name} key={label.id}>
              <span
                style={{
                  background: label.color,
                  color: getContrastTextColor(label.color),
                  borderRadius: 6,
                  padding: '4px 12px',
                  fontWeight: 600,
                  fontSize: 13,
                  minWidth: 24,
                  display: 'inline-block',
                  textAlign: 'center',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  backgroundClip: 'padding-box',
                  border: 'none',
                }}
              >
                {/* Không hiện tên label trong span */}
              </span>
            </Tooltip>
          ))}
        </Box>
      )}
      {/* Badge ngày */}
      {dateBadge && (
        <Box sx={{ mb: 0.5 }}>{dateBadge}</Box>
      )}
      <CardContent sx={{ p:'10px !important', borderRadius: '10px', pb: '8px !important' }} >
        <Typography >
          {card.title}
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, pt: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!!card?.comments?.length && (
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: 14, fontWeight: 500 }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 18, mr: 0.3 }} />{card.comments.length}
            </Box>
          )}
          {!!card?.attachments?.length && (
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: 14, fontWeight: 500 }}>
              <AttachmentIcon sx={{ fontSize: 18, mr: 0.3 }} />{card.attachments.length}
            </Box>
          )}
          {/* Checklist progress */}
          {!!card?.checkLists?.length && (
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: 14, fontWeight: 500 }}>
              <TaskAltOutlinedIcon sx={{ fontSize: 18, mr: 0.3 }} />
              {(() => {
                const total = card.checkLists.length;
                const checked = card.checkLists.filter(cl => cl.isChecked).length;
                return `${checked}/${total}`;
              })()}
            </Box>
          )}
        </Box>
        {/* Member avatar group */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {members.slice(0, 1).map((member, idx) => (
            <Tooltip title={member.user?.displayName} key={member.user?.id || idx}>
              <Avatar
                sx={{ width: 28, height: 28, fontSize: 15, fontWeight: 600, bgcolor: '#bdbdbd' }}
                src={member.user?.avatar}
                alt={member.user?.displayName}
              >
                {(!member.user?.avatar && member.user?.displayName) ? member.user.displayName[0].toUpperCase() : ''}
              </Avatar>
            </Tooltip>
          ))}
          {members.length > 2 && (
            <Avatar sx={{ width: 28, height: 28, fontSize: 15, fontWeight: 600, bgcolor: '#bdbdbd' }}>+{members.length - 1}</Avatar>
          )}
        </Box>
      </Box>
    </MuiCard>
  )
}
export default Card
