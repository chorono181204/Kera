import React, { useState } from 'react';
import { Box, Button, Container, Typography, Grid, useTheme, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import { styled } from '@mui/material/styles';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  background: '#f5f6fa', // light gray
  color: theme.palette.text.primary,
  position: 'relative',
  overflow: 'hidden',
}));

const FeatureCard = styled(motion.div)(({ theme }) => ({
  background: '#fff',
  borderRadius: '18px',
  padding: theme.spacing(4),
  boxShadow: '0 6px 32px 0 rgba(38,132,255,0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  border: '1.5px solid #e3e8ee',
  transition: 'box-shadow 0.3s',
}));

const AnimatedText = styled(motion.div)({
  display: 'inline-block',
});

const Shape = styled('div')({
  position: 'absolute',
  borderRadius: '50%',
  opacity: 0.09,
  zIndex: 0,
});

const softBlue = '#4f8cff';
const softBlueHover = '#357ae8';

const featureImages = [
  '/images/Preview1.png',
  '/images/Preview2.png',
  '/images/Preview3.png',
];
const featureLabels = ['Inbox', 'Boards', 'Planner'];

const Landing = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(0);

  const features = [
    {
      icon: <DashboardIcon sx={{ fontSize: 44, color: softBlue }} />,
      title: 'Intuitive Dashboard',
      description: 'Manage your projects and tasks easily with a modern, clean dashboard.'
    },
    {
      icon: <GroupIcon sx={{ fontSize: 44, color: softBlue }} />,
      title: 'Team Collaboration',
      description: 'Work together in real-time, assign roles, and keep everyone in sync.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 44, color: softBlue }} />,
      title: 'Optimized Workflow',
      description: 'Automate, drag & drop, and get smart reminders to save your time.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 44, color: softBlue }} />,
      title: 'Secure & Reliable',
      description: 'Your data is safe with enterprise-grade security and stable performance.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <Box>
      <HeroSection>
        {/* Decorative shapes */}
        <Shape style={{ width: 320, height: 320, background: softBlue, top: -80, left: -80 }} />
        <Shape style={{ width: 180, height: 180, background: softBlue, bottom: 40, right: 80 }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9 }}
              >
                <Typography variant="h1" sx={{ 
                  fontSize: { xs: '2.3rem', md: '3.2rem' },
                  fontWeight: 800,
                  mb: 2,
                  letterSpacing: '-1px',
                  lineHeight: 1.15,
                  color: theme.palette.text.primary
                }}>
                  Project Management
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.93, fontWeight: 400, color: '#6b7685' }}>
                  Organize, track, and manage your team projects efficiently, visually, and securely.
                </Typography>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        py: 1.3,
                        px: 4,
                        fontSize: '1.08rem',
                        fontWeight: 700,
                        background: softBlue,
                        color: '#fff',
                        borderRadius: '8px',
                        textTransform: 'none',
                        boxShadow: '0 2px 8px 0 rgba(79,140,255,0.10)',
                        minWidth: 140,
                        '&:hover': {
                          background: softBlueHover,
                          color: '#fff',
                        }
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{
                        py: 1.3,
                        px: 4,
                        fontSize: '1.08rem',
                        fontWeight: 700,
                        background: softBlue,
                        color: '#fff',
                        borderRadius: '8px',
                        textTransform: 'none',
                        boxShadow: '0 2px 8px 0 rgba(79,140,255,0.10)',
                        minWidth: 140,
                        '&:hover': {
                          background: softBlueHover,
                          color: '#fff',
                        }
                      }}
                    >
                      Register
                    </Button>
                  </Stack>
                </motion.div>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Box sx={{ py: 10, background: '#f5f6fa' }}>
        <Container maxWidth="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              align="center"
              sx={{ mb: 7, fontWeight: 800, color: softBlue, letterSpacing: '-1px' }}
              component={motion.h2}
              variants={itemVariants}
            >
              Why Choose Us?
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <FeatureCard
                    variants={itemVariants}
                    whileHover={{ y: -12, boxShadow: '0 12px 32px 0 rgba(79,140,255,0.16)' }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.icon}
                    <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 700, color: softBlue }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 16 }}>
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Trello-style Feature Section */}
      <Box sx={{ py: 10, background: '#f5f6fa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left: Feature Descriptions */}
            <Grid item xs={12} md={5}>
              <Box>
                {[
                  {
                    label: 'Inbox',
                    desc: "When it's on your mind, it goes in your Inbox. Capture your to-dos from anywhere, anytime.",
                    img: '/images/Preview1.png',
                  },
                  {
                    label: 'Boards',
                    desc: 'Your to-do list may be long, but it can be manageable! Keep tabs on everything from "to-dos to tackle" to "mission accomplished!"',
                    img: '/images/Preview2.png',
                  },
                  {
                    label: 'Planner',
                    desc: 'Drag, drop, get it done. Snap your top tasks into your calendar and make time for what truly matters.',
                    img: '/images/Preview3.png',
                  },
                ].map((item, idx) => (
                  <Box
                    key={item.label}
                    sx={{
                      background: '#fff',
                      borderRadius: 2,
                      p: 3,
                      mb: idx < 2 ? 4 : 0,
                      boxShadow: 1,
                      borderLeft: idx === selectedFeature ? '6px solid #00BFFF' : '6px solid transparent',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                    onClick={() => setSelectedFeature(idx)}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {item.label}
                    </Typography>
                    <Typography color="text.secondary">
                      {item.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            {/* Right: Feature Image */}
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 340 }}>
                <motion.img
                  key={selectedFeature}
                  src={featureImages[selectedFeature]}
                  alt={featureLabels[selectedFeature]}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 380,
                    borderRadius: 18,
                    boxShadow: '0 6px 32px 0 rgba(38,132,255,0.10)',
                    background: '#fff',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 10, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
              <Typography variant="h2" sx={{ mb: 3, fontWeight: 800, color: softBlue }}>
                Ready to get started?
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                Join thousands of teams already using our platform to manage their work more efficiently every day.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    py: 1.3,
                    px: 4,
                    fontSize: '1.08rem',
                    fontWeight: 700,
                    background: softBlue,
                    color: '#fff',
                    borderRadius: '8px',
                    textTransform: 'none',
                    boxShadow: '0 2px 8px 0 rgba(79,140,255,0.10)',
                    minWidth: 140,
                    '&:hover': {
                      background: softBlueHover,
                      color: '#fff',
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    py: 1.3,
                    px: 4,
                    fontSize: '1.08rem',
                    fontWeight: 700,
                    background: softBlue,
                    color: '#fff',
                    borderRadius: '8px',
                    textTransform: 'none',
                    boxShadow: '0 2px 8px 0 rgba(79,140,255,0.10)',
                    minWidth: 140,
                    '&:hover': {
                      background: softBlueHover,
                      color: '#fff',
                    }
                  }}
                >
                  Register
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing; 