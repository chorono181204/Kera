import React, { useRef, useEffect, useState } from "react";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../../../redux/user/userSlice';
import { getNotificationByUserId, updateInviteUserToBoard, selectCurrentNotifications, selectNotificationsLoading } from '../../../redux/notifications/notificationsSlice';
import moment from 'moment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { showModalActiveCard, fetchCardDetailsAPI } from '../../../redux/activeCard/activeCardSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const NotificationPopover = ({
  open,
  anchorEl,
  modalBoxRef,
  onClose,
  onlyUnread = true,
  onToggleUnread
}) => {
  const popoverRef = useRef();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const notifications = useSelector(selectCurrentNotifications);
  const loading = useSelector(selectNotificationsLoading);
  const userId = currentUser?._id || currentUser?.id;
  const navigate = useNavigate();
  const [inviteRole, setInviteRole] = useState('MEMBER');

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target) && open) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open || !userId) return;
    dispatch(getNotificationByUserId(userId));
  }, [open, userId, dispatch]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'COMMENT': return <ChatBubbleOutlineIcon sx={{ color: '#1976d2', fontSize: 22 }} />;
      case 'ASSIGNMENT': return <AssignmentIndIcon sx={{ color: '#ffa940', fontSize: 22 }} />;
      case 'MENTION': return <AlternateEmailIcon sx={{ color: '#36b37e', fontSize: 22 }} />;
      case 'INVITE': return <PersonAddIcon sx={{ color: '#36b37e', fontSize: 22 }} />;
      default: return <ChatBubbleOutlineIcon sx={{ color: '#b3bac5', fontSize: 22 }} />;
    }
  };

  // Hàm lấy role từ message
  const getRoleFromMessage = (message) => {
    if (message?.toLowerCase().includes('manager')) return 'MANAGER';
    return 'MEMBER';
  };

  const handleUpdateInvite = async (notification, status) => {
    const role = getRoleFromMessage(notification.message);
    const payload = {
      status,
      role
    };
    await dispatch(updateInviteUserToBoard({ data: payload, notificationId: notification.id })).unwrap();
    if (status === 'ACCEPTED') {
      toast.success('Invite updated successfully');
      navigate(`/boards/${notification.boardId}`);
    }
    // Refresh notifications after update
    dispatch(getNotificationByUserId(userId));
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === 'INVITE') return;
    if (notification.cardId) {
      dispatch(showModalActiveCard());
      dispatch(fetchCardDetailsAPI(notification.cardId));
    }
  };

  if (!open || !anchorEl || !modalBoxRef?.current) return null;
  const modalRect = modalBoxRef.current.getBoundingClientRect();
  const rect = anchorEl.getBoundingClientRect();
  const popoverWidth = 360;
  let left = rect.right - modalRect.left - popoverWidth + rect.width;
  const maxLeft = modalRect.width - popoverWidth - 8;
  if (left > maxLeft) left = maxLeft;
  if (left < 8) left = 8;
  const top = rect.bottom - modalRect.top + 8;

  return (
    <div
      ref={popoverRef}
      style={{
        position: "absolute",
        top,
        left,
        width: popoverWidth,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        padding: 0,
        zIndex: 1300,
        border: 'none'
      }}
    >
      <div style={{
        padding: "16px 20px 0 20px",
        fontWeight: 600,
        fontSize: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        Notifications
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14
        }}>
          <span>Show only unread</span>
          <input
            type="checkbox"
            checked={onlyUnread}
            onChange={e => onToggleUnread?.(e.target.checked)}
            style={{ accentColor: "#1976d2", width: 18, height: 18, marginLeft: 4 }}
          />
        </div>
      </div>
      <div style={{
        borderTop: "1px solid #eee",
        margin: "16px 0 0 0"
      }} />
      {loading ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          padding: "40px 0"
        }}>
          Loading...
        </div>
      ) : (!notifications || notifications.length === 0 || (onlyUnread && notifications.filter(n => !n.isRead).length === 0)) ? (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 0 32px 0"
        }}>
          <div style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: "#f4f5f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18
          }}>
            <NotificationsNoneIcon style={{ fontSize: 60, color: "#b3bac5", position: "absolute" }} />
          </div>
          <div style={{
            fontSize: 18,
            fontWeight: 500,
            color: "#1a2343"
          }}>
            No unread notifications
          </div>
        </div>
      ) : (
        <div style={{ maxHeight: 350, overflowY: 'auto', padding: '8px 0' }}>
          {(onlyUnread ? notifications.filter(n => !n.isRead) : notifications).map(n => (
            <div
              key={n.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 18px',
                borderRadius: 10,
                margin: '4px 8px',
                background: n.isRead ? '#fff' : '#f4f6fb',
                boxShadow: '0 1px 2px rgba(18, 38, 63, 0.03)',
                transition: 'background 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#f0f4ff'}
              onMouseOut={e => e.currentTarget.style.background = n.isRead ? '#fff' : '#f4f6fb'}
              onClick={() => handleNotificationClick(n)}
            >
              <div style={{ marginTop: 2 }}>
                {getTypeIcon(n.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, color: '#1a2343', fontWeight: 500, marginBottom: 2 }}>
                  {n.message}
                </div>
                <div style={{ fontSize: 13, color: '#888' }}>
                  {moment(n.createdAt).fromNow()}
                </div>
                {n.type === 'INVITE' && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      style={{
                        background: '#1976d2',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '4px 12px',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateInvite(n, 'ACCEPTED');
                      }}
                    >
                      Accept
                    </button>
                    <button
                      style={{
                        background: '#fff',
                        color: '#d32f2f',
                        border: '1px solid #d32f2f',
                        borderRadius: 4,
                        padding: '4px 12px',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateInvite(n, 'REJECT');
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;
