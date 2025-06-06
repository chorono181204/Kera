import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, Avatar, MenuItem, IconButton, Typography, Divider, Autocomplete, CircularProgress, Popover } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { inviteUserToBoardAPI, searchUserAPI, removeUserFromBoardAPI, acceptBoardRequestAPI, rejectBoardRequestAPI } from '../../../apis';
import { API_URL } from '../../../utils/constants';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/user/userSlice';

const roles = ['Owner', 'Manager', 'Member'];

const InvitationModal = ({ open, onClose, boardId, boardUsers = [] }) => {
  const [tab, setTab] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inviteRole, setInviteRole] = useState('Member');
  const [members, setMembers] = useState([]);
  const user = useSelector(selectCurrentUser);
  const [removeAnchorEl, setRemoveAnchorEl] = useState(null);
  const [memberToRemove, setMemberToRemove] = useState(null);
  
  // Lấy role của user hiện tại trong board
  const currentUserBoardRole = useMemo(() => {
    const found = boardUsers.find(u => (u.user?.id || u.id) === user.id);
    if (!found) return '';
    if (found.role === 'OWNER') return 'Owner';
    if (found.role === 'MANAGER') return 'Manager';
    return 'Member';
  }, [boardUsers, user]);
  console.log(currentUserBoardRole)
  // Map lại members từ boardUsers (ưu tiên lấy từ u.user)
  useEffect(() => {
    if (Array.isArray(boardUsers)) {
      const mappedMembers = boardUsers.map(u => {
        const userInfo = u.user || {};
        return {
          id: userInfo.id || u.id,
          displayName: userInfo.displayName || userInfo.username || userInfo.email || 'No name',
          email: userInfo.email || '',
          avatar: userInfo.avatar || '',
          role: u.role === 'OWNER' ? 'Owner' : u.role === 'MANAGER' ? 'Manager' : 'Member',
          status: u.status,
          isYou: user && userInfo.id === user.id
        }
      });
      setMembers(mappedMembers);
    }
  }, [boardUsers, user?.id]);

  // Get IDs of users already in the board
  const boardUserIds = useMemo(() => boardUsers.map(u => u.user?.id || u.id), [boardUsers]);

  // Debounce search
  useEffect(() => {
    if (!searchValue) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const handler = setTimeout(async () => {
      try {
        const results = await searchUserAPI(searchValue);
        // Mark users already in the board as disabled
        const mappedResults = (results || []).map(u => ({
          ...u,
          disabled: boardUserIds.includes(u.id)
        }));
        setSearchResults(mappedResults);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchValue, boardUserIds]);

  const handleInvite = async () => {
    if (!boardId || !selectedUser) return;
    try {
      const payload = {
        boardId: boardId,
        userId: selectedUser.id,
        message: `Invitation to join as ${inviteRole}`,
        invitedBy: user.id,
        role: inviteRole?.toUpperCase()
      };
      const response = await inviteUserToBoardAPI(payload);
      if (response.data) {
        setSearchValue('');
        setSelectedUser(null);
        setInviteRole('Member');
      }
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };

  // Hàm xử lý mở popover xác nhận xóa
  const handleRemoveClick = (event, member) => {
    setRemoveAnchorEl(event.currentTarget);
    setMemberToRemove(member);
  };

  // Đóng popover
  const handleRemoveClose = () => {
    setRemoveAnchorEl(null);
    setMemberToRemove(null);
  };

  // Hàm xử lý xóa member
  const handleRemoveMember = async () => {
    if (!boardId || !memberToRemove) return;
    try {
      await removeUserFromBoardAPI( boardId, memberToRemove.id );
      setMembers(members.filter(m => m.id !== memberToRemove.id));
      handleRemoveClose();
    } catch (error) {
      console.error('Error removing user:', error);
      handleRemoveClose();
    }
  };

  // Accept/Reject request handlers
  const handleAcceptRequest = async (request) => {
    try {
      await acceptBoardRequestAPI(boardId, request.id);
      setMembers(prev => prev.map(m => m.id === request.id ? { ...m, status: 'ACCEPTED' } : m));
    } catch (error) {
      // Có thể toast báo lỗi nếu muốn
    }
  };
  const handleRejectRequest = async (request) => {
    try {
      await rejectBoardRequestAPI(boardId, request.id);
      setMembers(prev => prev.map(m => m.id === request.id ? { ...m, status: 'REJECTED' } : m));
    } catch (error) {
      // Có thể toast báo lỗi nếu muốn
    }
  };

  // Lọc members và requests theo status
  const acceptedMembers = members.filter(m => m.status === 'ACCEPTED');
  const pendingRequests = members.filter(m => m.status === 'PENDING');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ '& .MuiDialog-paper': { mt: 8 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        Share board
        <IconButton onClick={onClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 ,mt:2}}>
          <Autocomplete
            fullWidth
            size="small"
            options={searchResults}
            getOptionLabel={option => option.displayName || option.email || ''}
            filterOptions={x => x}
            loading={searchLoading}
            value={selectedUser}
            onChange={(_, value) => setSelectedUser(value)}
            inputValue={searchValue}
            onInputChange={(_, value) => setSearchValue(value)}
            isOptionDisabled={option => option.disabled}
            renderInput={params => (
              <TextField
                {...params}
                label="Email or name"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searchLoading ? <CircularProgress color="inherit" size={18} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: option.disabled ? 0.5 : 1 }}>
                <Avatar src={option.avatar} alt={option.displayName} sx={{ width: 28, height: 28 }}>
                  {(!option.avatar && option.displayName) ? option.displayName[0].toUpperCase() : ''}
                </Avatar>
                <Box>
                  <Typography fontWeight={500}>{option.displayName}</Typography>
                  <Typography variant="body2" color="text.secondary">{option.email}</Typography>
                  {option.disabled && (
                    <Typography variant="caption" color="error.main">Already in board</Typography>
                  )}
                </Box>
              </Box>
            )}
          />
          <TextField
            select
            label="Role"
            value={inviteRole}
            onChange={e => setInviteRole(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
            variant="outlined"
          >
            {roles.map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={handleInvite} sx={{ minWidth: 100 }} disabled={!selectedUser || (selectedUser && selectedUser.disabled)}>
            Invite
          </Button>
        </Box>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label={`Board members (${acceptedMembers.length})`} />
          <Tab label={`Requests (${pendingRequests.length})`} />
        </Tabs>
        <Divider sx={{ mb: 2 }} />
        {tab === 0 && (
          <Box>
            {acceptedMembers.length === 0 ? (
              <Typography>No members in this board</Typography>
            ) : acceptedMembers.map(member => (
              <Box key={member.id} sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <Avatar src={member.avatar} alt={member.displayName} sx={{ width: 36, height: 36 }}>
                  {(!member.avatar && member.displayName) ? member.displayName[0].toUpperCase() : ''}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={500}>{member.displayName} {member.isYou && '(you)'}</Typography>
                  <Typography variant="body2" color="text.secondary">{member.email}</Typography>
                </Box>
                <TextField
                  select
                  value={member.role}
                  size="small"
                  sx={{ minWidth: 110 }}
                  disabled={currentUserBoardRole !== 'Owner' || member.isYou}
                >
                  {roles.map(role => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </TextField>
                {(currentUserBoardRole === 'Owner' || currentUserBoardRole === 'Manager') && !member.isYou && member.role !== 'Owner' && (
                  <Button color="error" variant="outlined" size="small" onClick={e => handleRemoveClick(e, member)}>
                    Remove
                  </Button>
                )}
              </Box>
            ))}
            {/* Popover xác nhận xóa */}
            <Popover
              open={Boolean(removeAnchorEl)}
              anchorEl={removeAnchorEl}
              onClose={handleRemoveClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              <Box sx={{ p: 2, maxWidth: 220 }}>
                <Typography>Are you sure you want to remove this member from the board?</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                  <Button size="small" onClick={handleRemoveClose}>Cancel</Button>
                  <Button size="small" color="error" variant="contained" onClick={handleRemoveMember}>Remove</Button>
                </Box>
              </Box>
            </Popover>
          </Box>
        )}
        {tab === 1 && (
          <Box>
            {pendingRequests.length === 0 ? (
              <Typography>No join requests</Typography>
            ) : pendingRequests.map(request => (
              <Box key={request.id} sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <Avatar src={request.avatar} alt={request.displayName} sx={{ width: 36, height: 36 }}>
                  {(!request.avatar && request.displayName) ? request.displayName[0].toUpperCase() : ''}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={500}>{request.displayName}</Typography>
                  <Typography variant="body2" color="text.secondary">{request.email}</Typography>
                </Box>
                <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }} onClick={() => handleAcceptRequest(request)}>Accept</Button>
                <Button variant="outlined" color="error" size="small" onClick={() => handleRejectRequest(request)}>Reject</Button>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvitationModal;
