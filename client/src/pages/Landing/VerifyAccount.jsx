import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Stack, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyAccountAPI } from '../../apis';

const Wrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: '#f5f6fa',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5, 4),
  borderRadius: 18,
  boxShadow: '0 6px 32px 0 rgba(38,132,255,0.08)',
  minWidth: 340,
  maxWidth: 380,
  background: '#fff',
  textAlign: 'center',
}));

const softBlue = '#4f8cff';
const softBlueHover = '#357ae8';

const VerifyAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (token) {
      verifyAccountAPI(token)
        .then(() => setStatus('success'))
        .catch((err) => {
          setStatus('error');
          setErrorMsg(err?.response?.data?.message || 'Verification failed.');
        });
    } else {
      setStatus('error');
      setErrorMsg('Token is missing.');
    }
  }, [token]);

  if (status === 'loading') return (
    <Wrapper>
      <Card>
        <Typography variant="h5" fontWeight={700} mb={2}>Đang xác thực tài khoản...</Typography>
      </Card>
    </Wrapper>
  );

  if (status === 'error') return (
    <Wrapper>
      <Card>
        <ErrorIcon sx={{ fontSize: 64, color: '#d32f2f', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} mb={2}>Xác thực thất bại</Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>{errorMsg}</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/login')}>Quay lại đăng nhập</Button>
      </Card>
    </Wrapper>
  );

  return (
    <Wrapper>
      <Card>
        <CheckCircleIcon sx={{ fontSize: 64, color: softBlue, mb: 2 }} />
        <Typography variant="h4" fontWeight={800} mb={1}>
          Account Verified!
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Your account has been successfully verified.<br />You can now log in and start using the platform.
        </Typography>
        <Stack direction="row" justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              py: 1.2,
              px: 4,
              fontSize: '1.08rem',
              fontWeight: 700,
              background: softBlue,
              color: '#fff',
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: 140,
              boxShadow: '0 2px 8px 0 rgba(79,140,255,0.10)',
              '&:hover': {
                background: softBlueHover,
                color: '#fff',
              }
            }}
          >
            Go to Login
          </Button>
        </Stack>
      </Card>
    </Wrapper>
  );
};

export default VerifyAccount; 