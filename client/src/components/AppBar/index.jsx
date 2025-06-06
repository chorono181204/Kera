import ModeToggle from '../ModeSelect/index.jsx'
import { Badge, Box, Button, InputAdornment, TextField, Tooltip, Typography, Popper, Paper, List, ListItem, ListItemText, CircularProgress } from '@mui/material'
import WorkSpaces from './Menus/WorkSpaces.jsx'
import Recent from './Menus/Recent.jsx'
import { HelpOutline, HelpOutlined, LibraryAdd, NotificationsNone, Star } from '@mui/icons-material'
import Templates from './Menus/Templates.jsx'
import Stared from './Menus/Stared.jsx'
import Profiles from './Menus/Profiles.jsx'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SearchIcon from '@mui/icons-material/Search'
import { useState, useRef, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import CreateBoardModal from '../../pages/Boards/create.jsx'
import NotificationPopover from '../Modal/Notification/Notification.jsx'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/user/userSlice'

import { fetchBoardsAPI } from '../../apis'
const AppBar = () => {
  const [searchValue, setSearchValue] = useState('')
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openNotification, setOpenNotification] = useState(false)
  const [onlyUnread, setOnlyUnread] = useState(true)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const notificationIconRef = useRef(null)
  const modalBoxRef = useRef(null)
  const searchInputRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [allBoards, setAllBoards] = useState([])
  const [isBoardsLoading, setIsBoardsLoading] = useState(true)

  useEffect(() => {
    setIsBoardsLoading(true)
    fetchBoardsAPI("?page=0&size=1000")
      .then(res => setAllBoards(res?.boards || []))
      .finally(() => setIsBoardsLoading(false))
  }, [])

  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    const handler = setTimeout(() => {
      const filtered = allBoards.filter(b => b.title?.toLowerCase().includes(searchValue.trim().toLowerCase()))
      setSearchResults(filtered)
      setIsSearching(false)
    }, 250)
    return () => clearTimeout(handler)
  }, [searchValue, allBoards])

  const handleSearchResultClick = (boardId) => {
    setSearchValue('')
    setSearchResults([])
    navigate(`/boards/${boardId}`)
  }

  return (
    <Box ref={modalBoxRef} sx={{ backgroundColor: 'background.default',
      height: (theme) => theme.customProperties.appBarHeight,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      paddingX:'20px',
      justifyContent: 'space-between'
    }}>
      <Box sx={{ display:'flex', alignItems:'center', gap:'10px' }}>
        {/* Logo and navigate to home page  no underline */}
        <Link to="/" style={{ textDecoration: 'none' }}>
        <Button sx={{ display:'flex', alignItems:'center', gap:'5px', justifyContent:'center', padding:'0px !important', color:'text.primary' }}>
          <DashboardIcon/>
          <Typography variant="span" sx={{ fontSize:'18px', fontWeight:'bold', paddingTop:'2px' }}>Kera</Typography>
          
        </Button>
        </Link>
        {/* WorkSpaces */}
        <WorkSpaces/>
        {/* Recent */}
        <Recent/>
        {/* Stared */}
        <Stared/>
        {/* Templates */}
        <Templates/>
        <Button variant="contained" startIcon={<LibraryAdd/>} onClick={() => setOpenCreateModal(true)}>Create</Button>
      </Box>
      <Box sx={{ display:'flex', alignItems:'center', gap:'10px', position: 'relative' }}>
        <Box ref={searchInputRef}>
          <TextField id="outlined-search"
            label="Search....."
            type="text" size={'small'}
            variant="outlined"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchValue.trim()) {
                navigate(`/boards?search=${encodeURIComponent(searchValue.trim())}`)
              }
            }}
            InputProps={{ startAdornment:(
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.primary' }}  />
              </InputAdornment>
            ),
            endAdornment:(
                <InputAdornment position="end">
              {isSearching ? (
                <CircularProgress size={20} />
              ) : (
                <CloseIcon sx={{ color: 'text.primary', fontSize:'18px', cursor:'pointer' }}
                  onClick={() => {
                    setSearchValue('');
                    setSearchResults([]);
                    if (location.pathname === '/boards' && new URLSearchParams(location.search).get('search')) {
                      const params = new URLSearchParams(location.search);
                      params.delete('search');
                      navigate(`/boards${params.toString() ? '?' + params.toString() : ''}`);
                    }
                  }} />
              )}
                </InputAdornment>
            )
            }}
            sx={{ width:'200px'
              , '& label': { color:'text.primary' }
              , '& input': { color:'text.primary' }
              , '& label.Mui-focused': { color:'text.primary' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'text.primary'
                },
                '&:hover fieldset': {
                  borderColor: 'text.primary'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'text.primary'
                }
              }
            }}/>
        </Box>

        <AnimatePresence>
          {searchResults.length > 0 && (
            <Popper
              open={true}
              anchorEl={searchInputRef.current}
              placement="bottom-start"
              sx={{ zIndex: 1300 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Paper 
                  elevation={3}
                  sx={{ 
                    width: 260,
                    maxHeight: '320px',
                    overflow: 'auto',
                    mt: 1,
                    backgroundColor: 'background.paper',
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  {searchResults.map((board) => (
                    <Box
                      key={board.id}
                      onClick={() => handleSearchResultClick(board.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: 44,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        px: 1.5,
                        py: 0.5,
                        mb: 0.5,
                        transition: 'background 0.2s, box-shadow 0.2s, border 0.2s',
                        border: '1.5px solid',
                        borderColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          borderColor: 'primary.main',
                          boxShadow: 2
                        }
                      }}
                    >
                      <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        backgroundColor: board.color || '#b3bac5',
                        flexShrink: 0,
                        mr: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }} />
                      <Typography sx={{
                        color: 'text.primary',
                        fontWeight: 500,
                        fontSize: 16,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1
                      }}>{board.title}</Typography>
                    </Box>
                  ))}
                </Paper>
              </motion.div>
            </Popper>
          )}
        </AnimatePresence>

        <ModeToggle/>
        <Tooltip title="Notifications">
          <Badge color="secondary" variant="dot">
            <span ref={notificationIconRef} style={{ display: 'inline-flex' }} onClick={() => setOpenNotification(true)}>
              <NotificationsNone style={{ cursor: 'pointer' }} />
            </span>
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutline/>
        </Tooltip>
        <Profiles/>
      </Box>
      <CreateBoardModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} />
      <NotificationPopover
        open={openNotification}
        anchorEl={notificationIconRef.current}
        modalBoxRef={modalBoxRef}
        onClose={() => setOpenNotification(false)}
        onlyUnread={onlyUnread}
        onToggleUnread={setOnlyUnread}
      />
    </Box>
  )
}
export default AppBar
