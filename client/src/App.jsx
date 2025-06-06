import Board from './pages/Boards/id.jsx'
import { Route, Routes } from 'react-router-dom'
import NotFound from './pages/404/NotFound.jsx'
import Auth from './pages/Auth/Auth.jsx'
import AccountVerification from './pages/Auth/AccountVerification.jsx'
import Settings from './pages/Settings/Settings.jsx';
import Boards from './pages/Boards/index.jsx';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStompClient } from './socket';
import { addNotification } from './redux/notifications/notificationsSlice';
import { selectAccessToken, selectCurrentUser } from './redux/user/userSlice';
import { 
  deleteCardFromWebSocket ,
  updateCurrentActiveCard
} from './redux/activeCard/activeCardSlice';
import { updateCardInBoard, updateCurrentActiveBoard } from './redux/activeBoard/activeBoardSlice';
import { Navigate, Outlet } from 'react-router-dom';
import Landing from './pages/Landing';
import VerifyAccount from './pages/Landing/VerifyAccount';
import UsersAdmin from './pages/admin/UsersAdmin';
import { ConfirmProvider } from 'material-ui-confirm';
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}
const GuestRoute = ({ user }) => {
  if (user) return <Navigate to='/boards' replace={true} />
  return <Outlet />
}
const AdminRoute = ({ user }) => {
  if (!user || !user.roles?.some(r => r.name === 'ADMIN')) return <Navigate to='/boards' replace={true} />
  return <Outlet />
}
function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const token = useSelector(selectAccessToken)
  console.log("token",token)
  useEffect(() => {
    if (!token) return;
    const stompClient = createStompClient(token);

    stompClient.onConnect = () => {
      // Lắng nghe notification cá nhân
      stompClient.subscribe('/user/queue/notifications', (message) => {
        const notification = JSON.parse(message.body);
        //console.log("new notification",notification)
        dispatch(addNotification(notification));
      });

      // Lắng nghe các thay đổi của card
      stompClient.subscribe('/topic/cards', (message) => {
        const cardUpdate = JSON.parse(message.body);
       // console.log("card update", cardUpdate);
        dispatch(updateCurrentActiveCard(cardUpdate));
        dispatch(updateCardInBoard(cardUpdate));
      });

      // Lắng nghe khi có card mới được tạo
      stompClient.subscribe('/topic/cards/new', (message) => {
        const newCard = JSON.parse(message.body);
        //console.log("new card", newCard);
        dispatch({ type: 'cards/addCard', payload: newCard });
      });

      // Lắng nghe khi card bị xóa
      stompClient.subscribe('/topic/cards/delete', (message) => {
        const deletedCardId = JSON.parse(message.body);
        //console.log("deleted card", deletedCardId);
        dispatch(deleteCardFromWebSocket(deletedCardId));
      });

      // board update
      stompClient.subscribe('/topic/boards', (message) => {
        const boardUpdate = JSON.parse(message.body);
        console.log("board update", boardUpdate);
        dispatch(updateCurrentActiveBoard(boardUpdate));
      });
    };


    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, [dispatch, token]);

  return (
    <>
     <ConfirmProvider>
        <Routes>
          
          <Route element={<ProtectedRoute user={currentUser} />}>
          
          <Route path="/boards/:boardId" element={<Board/>} />
          <Route path="/boards" element={<Boards />} />
          <Route path='/settings/account' element={<Settings />} />
          <Route path='/settings/security' element={<Settings />} />
          
        </Route>
        <Route element={<AdminRoute user={currentUser} />}>
          <Route path='/admin/users' element={<UsersAdmin />} />
        </Route>
        {/* Authentication */}
        <Route element={<GuestRoute user={currentUser} />}>
          <Route path='/login' element={<Auth />} />
          <Route path='/register' element={<Auth />} />
          <Route path='/verify' element={<VerifyAccount />} />
          <Route path="/" element={<Landing />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      </ConfirmProvider>
    </>
  )
}

export default App
