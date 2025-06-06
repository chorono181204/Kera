import { Box, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'

function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f4f5f7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2
      }}
    >
      <SentimentVeryDissatisfiedIcon sx={{ fontSize: 80, color: '#0052CC', mb: 2 }} />

      <Typography variant="h2" sx={{ fontSize: { xs: 40, md: 60 }, fontWeight: 700 }}>
                404 - Page Not Found
      </Typography>

      <Typography variant="body1" sx={{ mt: 2, maxWidth: 500, color: '#5e6c84' }}>
                Sorry, we couldn’t find the page you were looking for. It may have been moved, deleted, or the URL might be incorrect.
      </Typography>

      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 4,
            backgroundColor: '#0052CC',
            '&:hover': { backgroundColor: '#0065ff' }
          }}
        >
                    Go to Home
        </Button>
      </Link>
    </Box>
  )
}

export default NotFound
