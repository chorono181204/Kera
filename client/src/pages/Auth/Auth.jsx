
import { Navigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
// import { selectCurrentUser } from '~/redux/user/userSlice'
// import { useSelector } from 'react-redux'

function Auth() {
  const location = useLocation()
  // console.log(location)
  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'

  // const currentUser = useSelector(selectCurrentUser)
  // if (currentUser) return <Navigate to='/' replace={true} />

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'url("https://img.freepik.com/free-vector/hand-drawn-people-with-hot-drinks_52683-71948.jpg?t=st=1745171507~exp=1745175107~hmac=725ef9e7da8f7c29c8eefc3e466d3c069d7a30a5b3c6bf531ed4cc4d8edf2055&w=996")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.2)'
      }}
    >
      {isLogin && <LoginForm />}
      {isRegister && <RegisterForm />}
    </Box>
  )
}

export default Auth
