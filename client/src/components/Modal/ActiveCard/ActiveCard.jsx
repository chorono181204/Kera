import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import Checkbox from '@mui/material/Checkbox'
import LinearProgress from '@mui/material/LinearProgress'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import ToggleFocusInput from '../../Form/ToggleFocusInput'
import VisuallyHiddenInput from '../../Form/VisuallyHiddenInput'
import { singleFileValidator } from '../../../utils/validators'
import { toast } from 'react-toastify'
import CardUserGroup from './CardUserGroup'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardActivitySection from './CardActivitySection'
import CardAttachments from './CardAttachments'

import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearAndHideCurrentActiveCard,
  selectCurrentActiveCard,
  selectIsShowModalActiveCard,
  updateCurrentActiveCard,
  fetchCardDetailsAPI
} from '../../../redux/activeCard/activeCardSlice'
import { selectCurrentActiveBoard, updateCardInBoard, updateCurrentActiveBoard } from '../../../redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '../../../redux/user/userSlice'
import { CARD_MEMBER_ACTIONS } from '../../../utils/constants'
import Label from '../Label/Label'
import CheckList from '../CheckList/CheckList'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useTheme } from '@mui/material/styles'
import DateTimeModal from '../DateTime/DateTimeModal'
import moment from 'moment'
import { getDateBadgeStatus } from '../../../utils/dateBadge'
import { moveCardInBoardAPI, updateCardDetailAPI, createCardCommentAPI, deleteCardAPI, deleteCardCommentAPI, updateCardCommentAPI, createCheckListAPI, updateCheckListAPI, deleteCheckListAPI ,uploadFileAPI, removeUserFromCardAPI, addUserToCardAPI} from '../../../apis'
import Cardlabel from './Cardlabel'
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

/**
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function ActiveCard() {
  const dispatch = useDispatch()
  const activeCard = useSelector(selectCurrentActiveCard)
  const activeBoard = useSelector(selectCurrentActiveBoard)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)
  const currentUser = useSelector(selectCurrentUser)
  const [labelAnchorEl, setLabelAnchorEl] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const modalBoxRef = useRef();
  const theme = useTheme();
  const cardBg = theme.palette.mode === 'dark' ? '#1A2027' : '#fff';
  const [openCheckList, setOpenCheckList] = useState(false);
  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const [openDateModal, setOpenDateModal] = useState(false);
  const [dateModalValues, setDateModalValues] = useState({});
  const [checkListAnchorEl, setCheckListAnchorEl] = useState(null);
  const [checklists, setChecklists] = useState(activeCard?.checkLists || []);
  const [editingChecklistId, setEditingChecklistId] = useState(null);
  const [editingChecklistTitle, setEditingChecklistTitle] = useState('');
  const [deleteConfirmAnchorEl, setDeleteConfirmAnchorEl] = useState(null);
  const [checklistToDelete, setChecklistToDelete] = useState(null);
  const board = useSelector(selectCurrentActiveBoard);
  const [moveAnchorEl, setMoveAnchorEl] = useState(null);
  const [moveColumnId, setMoveColumnId] = useState('');
  const [movePosition, setMovePosition] = useState(1);
  const [moveLoading, setMoveLoading] = useState(false);
  const [visibleComments, setVisibleComments] = useState(10);
  const [visibleChecklists, setVisibleChecklists] = useState(10);
  const [visibleAttachments, setVisibleAttachments] = useState(4);
  const [deleteCardAnchorEl, setDeleteCardAnchorEl] = useState(null);
  
  const handleCloseModal = () => {
    dispatch(clearAndHideCurrentActiveCard())
    setOpenDateModal(false);
    setDateAnchorEl(null);
  }

  const callApiUpdateCard = async (updateData) => {
    console.log(updateData)
    const updatedCard = await updateCardDetailAPI(activeCard.id, updateData)

    // update lai card dang active trong modal
  //  dispatch(updateCurrentActiveCard(updatedCard))

    // update lai cac ban ghi card trong activeBoard
    //dispatch(updateCardInBoard(updatedCard))

    return updatedCard
  }

  const callApiCreateCardComment = async (commentToAdd) => {
    const newComment = await createCardCommentAPI(commentToAdd)
    return newComment
  }
  const callApiDeleteCardComment = async (commentId) => {
    await deleteCardCommentAPI(commentId);
  }
  const callApiUpdateCardComment = async (commentId, updatedComment) => {
    const res=await updateCardCommentAPI(commentId, updatedComment);
    return res
  }
  const onUpdateCardTitle = (newTitle) => {
    callApiUpdateCard({ title: newTitle.trim() })
  }

  const onUploadCardCover = async (event) => {
    const file = event.target?.files[0];
    const error = singleFileValidator(file);
    if (error) {
      toast.error(error);
      return;
    }

    let reqData = new FormData();
    reqData.append('file', file); // Đảm bảo key đúng với backend

    try {
      // 1. Upload file trước, nhận về link ảnh
      const imageUrl = await toast.promise(
        uploadFileAPI(reqData), // uploadFileAPI trả về link ảnh
        { pending: 'Uploading...' }
      );
      console.log(imageUrl)
      // 2. Gọi API cập nhật card cover với link ảnh vừa nhận được
      await callApiUpdateCard({ cover: imageUrl });

      // Reset input
      event.target.value = '';
    } catch (err) {
      toast.error('Upload or update failed!');
    }
  };

  const onUpdateCardDescription = (newDescription) => {
    callApiUpdateCard({ description: newDescription })
  }

  const onAddCardComment = async (commentToAdd) => {
    const res = await callApiCreateCardComment(commentToAdd);
    const cardComments = activeCard?.comments || [];
    const newCardComments = [...cardComments, res];
    //dispatch(updateCurrentActiveCard({ ...activeCard, comments: newCardComments }));
    dispatch(updateCardInBoard({ ...activeCard, comments: newCardComments }));
  };

  const onUpdateCardMembers = (incomingMemberInfo) => {
    callApiUpdateCard({ incomingMemberInfo })
  }
  const onDeleteCardComment = async (commentId) => {
    await callApiDeleteCardComment(commentId);
    const cardComments = activeCard?.comments || [];
    const newCardComments = cardComments.filter(comment => comment.id !== commentId);
    //dispatch(updateCurrentActiveCard({ ...activeCard, comments: newCardComments }));
    dispatch(updateCardInBoard({ ...activeCard, comments: newCardComments }));
  };
  const onUpdateCardComment = async (commentId, updatedComment) => {
    const res = await callApiUpdateCardComment(commentId, updatedComment);
    console.log(res)
    const cardComments = activeCard?.comments || [];
    const updatedCardComments = cardComments.map(comment => 
      comment.id === commentId ? res : comment
    );
    //dispatch(updateCurrentActiveCard({ ...activeCard, comments: updatedCardComments }));
  };
  const onDeleteCard = async () => {
    await deleteCardAPI(activeCard.id);
    dispatch(clearAndHideCurrentActiveCard());
    toast.success('Card deleted successfully!');
  };
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'image/png',
    'image/jpeg',
    'image/jpg',
    //txt,csv 
    'text/plain',
    'text/csv'
  ];

  const onUploadAttachment = async (event) => {
    const file = event.target?.files[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error('File type not supported!');
      return;
    }

    let reqData = new FormData();
    reqData.append('file', file); // upload giống cover, chỉ gửi file

    try {
      // 1. Upload file, nhận về url
      const fileUrl = await toast.promise(
        uploadFileAPI(reqData),
        { pending: 'Uploading...' }
      );

      // 2. Update card: gửi url và tên file vào attachments
      const newAttachment = {
        url: fileUrl,
        name: file.name
      };
      console.log(newAttachment)
      await callApiUpdateCard({
        attachments: [...(activeCard.attachments || []), newAttachment]
      });
      

      event.target.value = '';
    } catch (err) {
      toast.error('Upload or update failed!');
    }
  };

  const onDeleteAttachment = async (attachmentToDelete) => {
    const newAttachments = (activeCard.attachments || []).filter(
      att => att.id !== attachmentToDelete.id
    );
    await callApiUpdateCard({ attachments: newAttachments });
  };

  const handleAddChecklist = async ({ title }) => {
    if (!title || !title.trim() || !activeCard?.id) {
      toast.error('Checklist title cannot be empty!');
      return;
    }
    try {
      await createCheckListAPI({ cardId: activeCard.id, title: title.trim() });
      // Fetch lại card để đồng bộ redux
      // const updatedCard = await dispatch(fetchCardDetailsAPI(activeCard.id)).unwrap();
      // dispatch(updateCardInBoard(updatedCard));
    } catch (err) {
      toast.error('Error creating checklist!');
      console.error('Error creating checklist:', err);
    }
  };
  
  useEffect(() => {
    setChecklists(activeCard?.checkLists || []);
    // Khi mở modal, đồng bộ selectedLabels với card
    if (activeCard?.labels) {
      setSelectedLabels(activeCard.labels);
    } else {
      setSelectedLabels([]);
    }
  }, [activeCard]);

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

  // Hàm cập nhật trạng thái isChecked checklist
  const handleToggleChecklist = async (cl) => {
    try {
      await updateCheckListAPI(cl.id, { isChecked: !cl.isChecked });
      // Fetch lại card để đồng bộ redux
      //dispatch(updateCardInBoard(updatedCard));
    } catch (err) {
      console.error('Error updating checklist:', err);
    }
  };

  // Hàm cập nhật tiêu đề checklist
  const handleEditChecklistTitle = async (cl) => {
    if (!editingChecklistTitle.trim()) {
      toast.error('Checklist title cannot be empty!');
      return;
    }
    if (editingChecklistTitle === cl.title) {
      setEditingChecklistId(null);
      return;
    }
    try {
      await updateCheckListAPI(cl.id, { title: editingChecklistTitle });
      setEditingChecklistId(null);
      // Fetch lại card để đồng bộ redux
      // const updatedCard = await dispatch(fetchCardDetailsAPI(activeCard.id)).unwrap();
      // dispatch(updateCardInBoard(updatedCard));
    } catch (err) {
      toast.error('Error updating checklist title!');
      setEditingChecklistId(null);
    }
  };

  // Hàm xóa checklist
  const handleDeleteChecklist = (cl, event) => {
    setChecklistToDelete(cl);
    setDeleteConfirmAnchorEl(event.currentTarget);
  };
  const handleConfirmDeleteChecklist = async () => {
    if (!checklistToDelete) return;
    try {
      await deleteCheckListAPI(checklistToDelete.id);
      setDeleteConfirmAnchorEl(null);
      setChecklistToDelete(null);
      // Fetch lại card để đồng bộ redux
      // const updatedCard = await dispatch(fetchCardDetailsAPI(activeCard.id)).unwrap();
      // dispatch(updateCardInBoard(updatedCard));
    } catch (err) {
      toast.error('Error deleting checklist!');
      setDeleteConfirmAnchorEl(null);
      setChecklistToDelete(null);
    }
  };
  const handleCancelDeleteChecklist = () => {
    setDeleteConfirmAnchorEl(null);
    setChecklistToDelete(null);
  };

  // Xác định column hiện tại của card, an toàn cho mọi trường hợp
  const currentColId = activeCard?.columnId || (board?.columns?.find(col => col.cards.some(card => card.id === activeCard?.id))?.id);

  const handleOpenMovePopover = (e) => {
    setMoveAnchorEl(e.currentTarget);
    // Mặc định chọn column đầu tiên khác column hiện tại
    const firstOtherCol = board?.columns?.find(col => col.id !== currentColId);
    setMoveColumnId(firstOtherCol?.id || '');
    setMovePosition(1);
  };
  const handleCloseMovePopover = () => {
    setMoveAnchorEl(null);
  };
  const handleMoveCard = async () => {
    if (!moveColumnId || !activeCard) return;
    setMoveLoading(true);
    try {
      // Lấy oldColumnId: nếu activeCard không có columnId thì tìm column chứa card này
      let oldColumnId = activeCard.columnId;
      if (!oldColumnId) {
        const foundCol = board.columns.find(col => col.cards.some(card => card.id === activeCard.id));
        oldColumnId = foundCol?.id;
      }
      const newColumnId = moveColumnId;
      const oldCol = board.columns.find(col => col.id === oldColumnId);
      const newCol = board.columns.find(col => col.id === newColumnId);
      // oldColumnCardIds: các card còn lại ở column cũ (không chứa card đang move)
      const oldColumnCardIds = oldCol.cards
        .filter(c => !c.FE_PlaceholderCard && c.id !== activeCard.id)
        .map(card => card.id);
      // newColumnCardIds: các card ở column mới (có card đang move ở đúng vị trí)
      const newColCards = [...(newCol.cards.filter(c => !c.FE_PlaceholderCard && c.id !== activeCard.id))];
      newColCards.splice(movePosition - 1, 0, { ...activeCard, columnId: newColumnId });
      const newColumnCardIds = newColCards.map(card => card.id);
      const updateData = {
        cardId: activeCard.id,
        oldColumnId,
        newColumnId,
        oldColumnCardIds,
        newColumnCardIds
      };
      
      await moveCardInBoardAPI(updateData).then((res) => {
        // res.result là mảng 2 column đã cập nhật
        
        const updatedColumns = board.columns.map(col => {
          const updated = res.find(c => c.id === col.id);
          return updated ? updated : col;
        });
        const newBoard = { ...board, columns: updatedColumns };
        console.log(newBoard)
        // Dispatch cập nhật lại board vào redux
        dispatch(updateCurrentActiveBoard(newBoard));
      
        handleCloseMovePopover();
      });
    } catch (err) {
      //toast.error('Move card failed!');
    } finally {
      setMoveLoading(false);
    }
  };

  const handleLoadMoreComments = () => {
    setVisibleComments(prev => prev + 10);
  }

  const handleLoadMoreChecklists = () => {
    setVisibleChecklists(prev => prev + 10);
  }

  const handleLoadMoreAttachments = () => {
    setVisibleAttachments(prev => prev + 4);
  }

  const handleShowLessComments = () => {
    setVisibleComments(10);
  }

  const handleShowLessChecklists = () => {
    setVisibleChecklists(10);
  }

  const handleShowLessAttachments = () => {
    setVisibleAttachments(4);
  }

  // Lấy role của user hiện tại trong board
  const boardUsers = board?.boardUsers || [];
  const currentUserBoardRole = useMemo(() => {
    const found = boardUsers.find(u => (u.user?.id) === currentUser?.id);
    return found?.role || '';
  }, [boardUsers, currentUser]);
  console.log('currentUserBoardRole',currentUserBoardRole);
  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard}
      onClose={handleCloseModal}
      sx={{ overflowY: 'auto' }}>
      <Box ref={modalBoxRef} sx={{
        position: 'relative',
        width: 900,
        maxWidth: 900,
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        padding: '40px 20px 20px',
        margin: '50px auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>

        {activeCard?.cover &&
          <Box sx={{ mb: 4 }}>
            <img
              style={{ width: '100%', height: '320px', borderRadius: '6px', objectFit: 'cover' }}
              src={activeCard?.cover}
              alt="card-cover"
            />
          </Box>
        }

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput
            inputFontSize='22px'
            value={activeCard?.title}
            onChangedValue={onUpdateCardTitle} />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid xs={12} sm={9}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Members</Typography>
              {/* Feature 02: Xử lý các thành viên của Card */}
              <CardUserGroup
                cardUsers={activeCard?.cardUsers || []}
                onUpdateCardMembers={onUpdateCardMembers}
              />
              {/* Hiển thị các label của card */}
              <Cardlabel labels={activeCard?.labels} getContrastTextColor={getContrastTextColor} />
              {/* Hiển thị ngày bắt đầu và ngày hết hạn nếu có */}
              {(activeCard?.startDate || activeCard?.dueDate) && (
                <>
                  <Typography sx={{ fontWeight: '600', color: 'primary.main', mt: 2, mb: 0.5 }}>Dates</Typography>
                  <Box sx={{ mt: 0, background: theme => theme.palette.mode === 'dark' ? '#23272f' : '#f4f5f7', borderRadius: 2, px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontWeight: 500, color: theme.palette.text.primary }}>
                      {activeCard?.startDate ? `Start date: ${moment(activeCard.startDate).format('D [thg] M')}` : ''}
                      {activeCard?.startDate && moment(activeCard.startDate).format('HH:mm') !== '00:00' ? ' - ' + moment(activeCard.startDate).format('HH:mm') : ''}
                      {activeCard?.startDate && activeCard?.dueDate ? <span style={{ display: 'inline-block', width: 24 }} /> : ''}
                      {activeCard?.dueDate ? `Due date: ${moment(activeCard.dueDate).format('D [thg] M')}` : ''}
                      {activeCard?.dueDate && moment(activeCard.dueDate).format('HH:mm') !== '00:00' ? ' - ' + moment(activeCard.dueDate).format('HH:mm') : ''}
                    </span>
                    {/* Badge due soon/overdue, màu dùng chung logic */}
                    {(() => {
                      const { badgeColor, dueSoon } = getDateBadgeStatus(activeCard?.startDate, activeCard?.dueDate);
                      const now = moment();
                      const due = activeCard?.dueDate ? moment(activeCard.dueDate) : null;
                      if (due && now.isAfter(due, 'day')) {
                        return <span style={{ background: badgeColor, color: '#fff', borderRadius: 4, padding: '2px 8px', fontWeight: 600, fontSize: 13, marginLeft: 8 }}>Overdue</span>;
                      } else if (dueSoon) {
                        return <span style={{ background: badgeColor, color: '#172b4d', borderRadius: 4, padding: '2px 8px', fontWeight: 600, fontSize: 13, marginLeft: 8 }}>Due soon</span>;
                      } else if (activeCard?.startDate && moment().isBefore(moment(activeCard.startDate), 'day')) {
                        return <span style={{ background: badgeColor, color: '#fff', borderRadius: 4, padding: '2px 8px', fontWeight: 600, fontSize: 13, marginLeft: 8 }}>Not started</span>;
                      }
                      return null;
                    })()}
                  </Box>
                </>
              )}
              {/* Hiển thị checklist dưới Dates */}
              {checklists.length > 0 && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.2, mt: 2 }}>
                    <TaskAltOutlinedIcon sx={{ fontSize: 26 }} />
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 22,
                        color: '#172b4d',
                        lineHeight: 1
                      }}
                    >
                      Checklists
                    </Typography>
                  </Box>
                  {/* Progress tổng cho tất cả checklist */}
                  {(() => {
                    const total = checklists.length;
                    const checked = checklists.filter(cl => cl.completed || cl.isChecked).length;
                    const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 500, minWidth: 32 }}>{percent}%</Typography>
                        <LinearProgress variant="determinate" value={percent} sx={{ flex: 1, height: 7, borderRadius: 5, background: '#e9eaf0', '& .MuiLinearProgress-bar': { background: '#42526e' } }} />
                      </Box>
                    );
                  })()}
                  <Box>
                    {/* Hiển thị danh sách checklist sắp xếp theo createdAt */}
                    {[...checklists].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).slice(0, visibleChecklists).map(cl => (
                      <Box key={cl.id} sx={{ background: '#f4f5f7', borderRadius: 1, p: 0.7, mb: 0.7, position: 'relative', '&:hover .delete-checklist-btn': { opacity: 1 } }}>
                        <Typography sx={{ fontWeight: 500, mb: 0.2, display: 'flex', alignItems: 'center', fontSize: 14 }}>
                          <Checkbox checked={cl.isChecked} onChange={() => handleToggleChecklist(cl)} sx={{ p: 0, mr: 1 }} />
                          {editingChecklistId === cl.id ? (
                            <input
                              value={editingChecklistTitle}
                              autoFocus
                              onChange={e => setEditingChecklistTitle(e.target.value)}
                              onBlur={() => handleEditChecklistTitle(cl)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleEditChecklistTitle(cl);
                              }}
                              style={{ fontSize: 14, fontWeight: 500, border: 'none', outline: 'none', padding: '2px 6px', minWidth: 80, background: 'transparent' }}
                            />
                          ) : (
                            <span
                              onDoubleClick={() => {
                                setEditingChecklistId(cl.id);
                                setEditingChecklistTitle(cl.title);
                              }}
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                              {cl.title}
                            </span>
                          )}
                          <DeleteOutlineIcon
                            className="delete-checklist-btn"
                            sx={{ ml: 'auto', fontSize: 18, color: '#b71c1c', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s' }}
                            onClick={e => handleDeleteChecklist(cl, e)}
                          />
                        </Typography>
                        {cl.items && cl.items.map(item => (
                          <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.2, ml: 3 }}>
                            <Checkbox checked={item.completed || item.isChecked} disabled sx={{ p: 0, mr: 1 }} />
                            <Typography sx={{ fontSize: 13 }}>{item.title}</Typography>
                          </Box>
                        ))}
                      </Box>
                    ))}
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      {checklists.length > visibleChecklists && (
                        <Button 
                          onClick={handleLoadMoreChecklists}
                          startIcon={<AddOutlinedIcon />}
                        >
                          Load more checklists
                        </Button>
                      )}
                      {visibleChecklists > 10 && (
                        <Button 
                          onClick={handleShowLessChecklists}
                          startIcon={<RemoveOutlinedIcon />}
                        >
                          Show less
                        </Button>
                      )}
                    </Box>
                  </Box>
                </>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <SubjectRoundedIcon sx={{ fontSize: 26 }} />
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 22,
                    color: '#172b4d',
                    lineHeight: 1
                  }}
                >
                  Description
                </Typography>
              </Box>
              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor
                cardDescriptionProp={activeCard?.description}
                handleUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>

            {/* Hiển thị danh sách các file đính kèm dưới description và trên activity */}
            <CardAttachments
              attachments={(activeCard?.attachments || []).slice(0, visibleAttachments)}
              onDeleteAttachment={onDeleteAttachment}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {(activeCard?.attachments || []).length > visibleAttachments && (
                <Button 
                  onClick={handleLoadMoreAttachments}
                  startIcon={<AddOutlinedIcon />}
                >
                  Load more attachments
                </Button>
              )}
              {visibleAttachments > 4 && (
                <Button 
                  onClick={handleShowLessAttachments}
                  startIcon={<RemoveOutlinedIcon />}
                >
                  Show less
                </Button>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <DvrOutlinedIcon sx={{ fontSize: 26 }} />
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 22,
                    color: '#172b4d',
                    lineHeight: 1
                  }}
                >
                  Activity
                </Typography>
              </Box>
              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              <CardActivitySection
                cardsComment={(activeCard?.comments || []).slice(0, visibleComments)}
                onAddCardComment={onAddCardComment}
                onDeleteCardComment={onDeleteCardComment}
                onUpdateCardComment={onUpdateCardComment}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {(activeCard?.comments || []).length > visibleComments && (
                  <Button 
                    onClick={handleLoadMoreComments}
                    startIcon={<AddOutlinedIcon />}
                  >
                    Load more comments
                  </Button>
                )}
                {visibleComments > 10 && (
                  <Button 
                    onClick={handleShowLessComments}
                    startIcon={<RemoveOutlinedIcon />}
                  >
                    Show less
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Right side */}
          <Grid xs={12} sm={3}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
            <Stack direction="column" spacing={1}>
              {/* Feature 05: Xử lý hành động bản thân user tự join hoặc rời card */}
              {activeCard?.cardUsers?.some(cu => cu.user?.id === currentUser?.id) ? (
                <SidebarItem
                  className="active"
                  onClick={async () => {
                    const cardUser = activeCard.cardUsers.find(cu => cu.user?.id === currentUser?.id);
                    if (!cardUser) return;
                    await removeUserFromCardAPI( activeCard.id ,cardUser.id );
                    onUpdateCardMembers({
                      userId: currentUser?.id,
                      action: CARD_MEMBER_ACTIONS.REMOVE
                    });
                  }}
                >
                  <PersonRemoveOutlinedIcon fontSize="small" />
                  Leave
                </SidebarItem>
              ) : (
                <SidebarItem
                  className="active"
                  onClick={async () => {
                    await addUserToCardAPI({ userId: currentUser?.id, cardId: activeCard.id, role: 'MEMBER' });
                    onUpdateCardMembers({
                      userId: currentUser?.id,
                      action: CARD_MEMBER_ACTIONS.ADD
                    });
                  }}
                >
                  <PersonOutlineOutlinedIcon fontSize="small" />
                  Join
                </SidebarItem>
              )}
              {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
              <SidebarItem className="active" component="label">
                <ImageOutlinedIcon fontSize="small" />
                Cover
                <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
              </SidebarItem>

              <SidebarItem className="active" component="label">
                <AttachFileOutlinedIcon fontSize="small" />
                Attachment
                <VisuallyHiddenInput type="file" onChange={onUploadAttachment} />
              </SidebarItem>
              <SidebarItem onClick={e => {
                setLabelAnchorEl(e.currentTarget);
                setOpenCheckList(false);
                setCheckListAnchorEl(null);
                setOpenDateModal(false);
                setDateAnchorEl(null);
              }}>
                <LocalOfferOutlinedIcon fontSize="small" />Labels
              </SidebarItem>
              <SidebarItem onClick={e => {
                setDateAnchorEl(e.currentTarget);
                setOpenDateModal(true);
                setOpenCheckList(false);
                setCheckListAnchorEl(null);
                setLabelAnchorEl(null);
              }}>
                <WatchLaterOutlinedIcon fontSize="small" />Dates
              </SidebarItem>
              <SidebarItem onClick={e => {
                setCheckListAnchorEl(e.currentTarget);
                setOpenCheckList(true);
                setLabelAnchorEl(null);
                setDateAnchorEl(null);
                setOpenDateModal(false);
              }}>
                <TaskAltOutlinedIcon fontSize="small" />Checklist
              </SidebarItem>
              <SidebarItem><AutoFixHighOutlinedIcon fontSize="small" />Custom Fields</SidebarItem>
            </Stack>

        
            

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Actions</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem onClick={handleOpenMovePopover}><ArrowForwardOutlinedIcon fontSize="small" />Move</SidebarItem>
              {(activeCard?.createdBy === currentUser?.username || currentUserBoardRole === 'OWNER' || currentUserBoardRole === 'MANAGER') && (
                <SidebarItem onClick={e => setDeleteCardAnchorEl(e.currentTarget)}>
                  <DeleteOutlineOutlinedIcon fontSize="small" />Delete
                </SidebarItem>
              )}
            </Stack>
          </Grid>
        </Grid>
        <Label
          open={Boolean(labelAnchorEl)}
          anchorEl={labelAnchorEl}
          modalBoxRef={modalBoxRef}
          cardBg={cardBg}
          onClose={() => setLabelAnchorEl(null)}
          selectedLabels={selectedLabels}
          onChange={async (newLabels) => {
            setSelectedLabels(newLabels);
            // Gửi API update card với danh sách label mới (chỉ cần id)
            await callApiUpdateCard({ labels: newLabels.map(l => l.id) });
          }}
        />
        <CheckList
          open={openCheckList}
          anchorEl={checkListAnchorEl}
          modalBoxRef={modalBoxRef}
          onClose={() => {
            setOpenCheckList(false);
            setCheckListAnchorEl(null);
          }}
          onAdd={handleAddChecklist}
        />
        {openDateModal && dateAnchorEl && modalBoxRef?.current && (
          (() => {
            const modalRect = modalBoxRef.current.getBoundingClientRect();
            const rect = dateAnchorEl.getBoundingClientRect();
            const top = rect.bottom - modalRect.top + 4;
            const left = rect.left - modalRect.left;
            // Lấy giá trị mặc định từ card
            let initialStartDate = '';
            let initialStartTime = '';
            let initialDueDate = '';
            let initialDueTime = '';
            if (activeCard?.startDate) {
              const m = moment(activeCard.startDate);
              initialStartDate = m.format('YYYY-MM-DD');
              initialStartTime = m.format('HH:mm');
            }
            if (activeCard?.dueDate) {
              const m = moment(activeCard.dueDate);
              initialDueDate = m.format('YYYY-MM-DD');
              initialDueTime = m.format('HH:mm');
            }
            return (
              <div style={{
                position: 'absolute',
                top,
                left,
                zIndex: 1400
              }}>
                <DateTimeModal
                  open={openDateModal}
                  onClose={() => setOpenDateModal(false)}
                  initialStartDate={initialStartDate}
                  initialStartTime={initialStartTime}
                  initialDueDate={initialDueDate}
                  initialDueTime={initialDueTime}
                  onSave={async values => {
                    setDateModalValues(values);
                    setOpenDateModal(false);
                    const { startDate, startTime, dueDate, dueTime } = values;
                    const startDateTime = startDate && startTime ? `${startDate}T${startTime}:00` : (startDate ? `${startDate}T00:00:00` : null);
                    const dueDateTime = dueDate && dueTime ? `${dueDate}T${dueTime}:00` : (dueDate ? `${dueDate}T00:00:00` : null);
                    // So sánh với giá trị cũ, chỉ call API nếu khác
                    const oldStart = activeCard?.startDate ? moment(activeCard.startDate).format('YYYY-MM-DDTHH:mm:00') : null;
                    const oldDue = activeCard?.dueDate ? moment(activeCard.dueDate).format('YYYY-MM-DDTHH:mm:00') : null;
                    if (startDateTime !== oldStart || dueDateTime !== oldDue) {
                      await callApiUpdateCard({
                        ...(startDateTime && { startDate: startDateTime }),
                        ...(dueDateTime && { dueDate: dueDateTime })
                      });
                    }
                  }}
                />
              </div>
            );
          })()
        )}
        {/* Popover xác nhận xóa checklist */}
        <Popover
          open={Boolean(deleteConfirmAnchorEl)}
          anchorEl={deleteConfirmAnchorEl}
          onClose={handleCancelDeleteChecklist}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{ sx: { p: 2, minWidth: 220 } }}
        >
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Delete Checklist</Typography>
          <Typography sx={{ mb: 2 }}>Are you sure you want to delete this checklist?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCancelDeleteChecklist} color="primary" size="small">Cancel</Button>
            <Button onClick={handleConfirmDeleteChecklist} color="error" variant="contained" size="small">Delete</Button>
          </Box>
        </Popover>
        <Popover
          open={Boolean(moveAnchorEl) && !!activeCard}
          anchorEl={moveAnchorEl}
          onClose={handleCloseMovePopover}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{ sx: { p: 2, minWidth: 300 } }}
        >
          {activeCard && (
            <>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Move Card</Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: 14, mb: 0.5 }}>Column</Typography>
                  <Select
                    size="small"
                    value={moveColumnId}
                    onChange={e => {
                      setMoveColumnId(e.target.value);
                      setMovePosition(1); // Reset vị trí về 1 khi chọn column mới
                    }}
                    sx={{ minWidth: 120 }}
                  >
                    {board?.columns?.filter(col => col.id !== currentColId).map(col => (
                      <MenuItem key={col.id} value={col.id}>{col.title}</MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 14, mb: 0.5 }}>Position</Typography>
                  <Select
                    size="small"
                    value={movePosition}
                    onChange={e => setMovePosition(Number(e.target.value))}
                    sx={{ minWidth: 60 }}
                  >
                    {(() => {
                      const col = board?.columns?.find(c => c.id === moveColumnId);
                      const count = col?.cards?.filter(c => !c.FE_PlaceholderCard).length || 0;
                      return Array.from({ length: count + 1 }, (_, i) => i + 1).map(pos => (
                        <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                      ));
                    })()}
                  </Select>
                </Box>
              </Box>
              <Button variant="contained" onClick={handleMoveCard} disabled={moveLoading} fullWidth>
                {moveLoading ? 'Đang di chuyển...' : 'Di chuyển'}
              </Button>
            </>
          )}
        </Popover>
        {/* Popover xác nhận xóa card */}
        <Popover
          open={Boolean(deleteCardAnchorEl)}
          anchorEl={deleteCardAnchorEl}
          onClose={() => setDeleteCardAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{ sx: { p: 2, minWidth: 220 } }}
        >
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Delete Card</Typography>
          <Typography sx={{ mb: 2 }}>Are you sure you want to delete this card?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setDeleteCardAnchorEl(null)} color="primary" size="small">Cancel</Button>
            <Button onClick={async () => { await onDeleteCard(); setDeleteCardAnchorEl(null); }} color="error" variant="contained" size="small">Delete</Button>
          </Box>
        </Popover>
      </Box>
    </Modal>
  )
}

export default ActiveCard
