import { useState, useEffect } from 'react'
import AppBar from '../../components/AppBar'
import PageLoadingSpinner from '../../components/Loading/PageLoadingSpinner'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// Grid: https://mui.com/material-ui/react-grid2/#whats-changed
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { Link, useLocation } from 'react-router-dom'
import randomColor from 'randomcolor'
import SidebarCreateBoardModal from './create'
import StarIcon from '@mui/icons-material/Star'
import { toast } from 'react-toastify'
import ArchiveIcon from '@mui/icons-material/Archive'
import { styled } from '@mui/material/styles'
import { fetchBoardsAPI, toggleBoardStarredAPI, toggleBoardArchivedAPI } from '../../apis'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '../../utils/constants'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/user/userSlice'
// Styles của mấy cái Sidebar item menu, anh gom lại ra đây cho gọn.
const SidebarItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'primary'
})(({ theme, primary }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: primary ? theme.palette.primary.main : theme.palette.background.main,
  color: primary ? '#fff' : undefined,
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: primary ? theme.palette.primary.dark : (theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300])
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.background.paper
  }
}))

function Boards() {
  const [boards, setBoards] = useState(null)
  const [totalBoards, setTotalBoards] = useState(null)
  const [hoveredBoardId, setHoveredBoardId] = useState(null)
  const location = useLocation()
  const currentUser = useSelector(selectCurrentUser)

  const query = new URLSearchParams(location.search)
  const page = parseInt(query.get('page') || '1', 10)
  const size = DEFAULT_ITEMS_PER_PAGE
  const isArchived = query.get('isArchived')
  const starred = query.get('starred')
  const search = query.get('search')

  let apiQuery = `?page=${page - 1}&size=${size}`
  if (isArchived) apiQuery += `&isArchived=true`
  if (starred) apiQuery += `&starred=true`
  if (search) apiQuery += `&search=${encodeURIComponent(search)}`

  const updateStateData = (res) => {
    setBoards(res?.boards)
    setTotalBoards(res?.total)
  }

  useEffect(() => {
    fetchBoardsAPI(apiQuery).then(updateStateData)
  }, [location.search])

  const afterCreateNewBoard = () => {
    fetchBoardsAPI(apiQuery).then(updateStateData)
  }

  const handleStarBoard = async (e, board) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await toggleBoardStarredAPI(board.id, currentUser.id)
      setBoards(prevBoards => 
        prevBoards.map(b => 
          b.id === board.id ? { ...b, starred: !b.starred } : b
        )
      )
      toast.success(board.starred ? 'Board unstarred' : 'Board starred')
    } catch (error) {
      toast.error('Failed to update board starred status')
    }
  }

  const handleArchiveBoard = async (e, board) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await toggleBoardArchivedAPI(board.id, currentUser.id)
      fetchBoardsAPI(apiQuery).then(updateStateData)
      toast.success(board.archived ? 'Board unarchived' : 'Board archived')
    } catch (error) {
      toast.error('Failed to update board archived status')
    }
  }

  if (!boards) {
    return <PageLoadingSpinner caption='Loading Boards...' />
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={3}>
            <Stack direction='column' spacing={1}>
              <SidebarItem
                component={Link}
                to="/boards"
                className={!isArchived && !starred ? 'active' : ''}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                <SpaceDashboardIcon fontSize='small' />
                Boards
              </SidebarItem>
              <SidebarItem
                component={Link}
                to="/boards?isArchived=true"
                className={isArchived ? 'active' : ''}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ArchiveIcon fontSize='small' />
                Archived
              </SidebarItem>
              <SidebarItem
                component={Link}
                to="/boards?starred=true"
                className={starred ? 'active' : ''}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                <StarIcon fontSize='small' />
                Starred
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid xs={12} sm={9}>
            <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 3 }}>
              Your boards:
            </Typography>

            {/* Trường hợp gọi API nhưng không tồn tại cái board nào trong Database trả về */}
            {boards?.length === 0 && (
              <Typography variant='span' sx={{ fontWeight: 'bold', mb: 3 }}>
                No result found!
              </Typography>
            )}

            {/* Trường hợp gọi API và có boards trong Database trả về thì render danh sách boards */}
            {boards?.length > 0 && (
              <Grid container spacing={2}>
                {boards.map((b) => (
                  <Grid xs={2} sm={3} md={4} key={b.id}>
                    <Box component={Link} to={`/boards/${b?.id}`}
                      sx={{
                        display: 'block',
                        width: '250px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: 2,
                        textDecoration: 'none',
                        transition: 'box-shadow 0.2s',
                        '&:hover': { boxShadow: 6 }
                      }}
                      onMouseEnter={() => setHoveredBoardId(b.id)}
                      onMouseLeave={() => setHoveredBoardId(null)}
                    >
                      <Box sx={{ 
                        height: '90px', 
                        backgroundColor: b.color || '#b3bac5', // Use board color or gray fallback
                        position: 'relative' 
                      }}>
                        {(b.starred || hoveredBoardId === b.id) && (
                          <Box
                            onClick={(e) => handleStarBoard(e, b)}
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              zIndex: 2,
                              background: b.starred ? 'rgba(255, 214, 0, 0.2)' : 'rgba(0,0,0,0.08)',
                              borderRadius: '8px',
                              p: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}>
                            <StarIcon sx={{ color: b.starred ? '#FFD600' : '#fff', fontSize: 22 }} />
                          </Box>
                        )}
                      </Box>
                      <Box sx={(theme) => ({
                        backgroundColor: 'background.paper',
                        p: 2,
                        borderBottomLeftRadius: '8px',
                        borderBottomRightRadius: '8px',
                        border: `1px solid ${theme.palette.mode === 'dark' ? '#26324a' : '#e0e0e0'}`,
                        borderTop: 'none'
                      })}>
                        <Typography sx={{ color: 'text.primary', fontWeight: 400, fontSize: 20 }}>
                          {b?.title}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Trường hợp gọi API và có totalBoards trong Database trả về thì render khu vực phân trang  */}
            {totalBoards > 0 && (
              <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Pagination
                  size='large'
                  color='secondary'
                  showFirstButton
                  showLastButton
                  // Giá trị prop count của component Pagination là để hiển thị tổng số lượng page, công thức là lấy Tổng số lượng bản ghi chia cho số lượng bản ghi muốn hiển thị trên 1 page (ví dụ thường để 12, 24, 26, 48...vv). sau cùng là làm tròn số lên bằng hàm Math.ceil
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  // Giá trị của page hiện tại đang đứng
                  page={page}
                  // Render các page item và đồng thời cũng là những cái link để chúng ta click chuyển trang
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`}`}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Boards