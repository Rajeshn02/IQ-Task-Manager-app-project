import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Snackbar } from '@mui/material';
import { useUser } from './UserContext';
import LoginDialog from '../components/loginDialog';
import SignupDialog from '../components/signupDialog';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useUser();
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);
  const handleSignupOpen = () => setSignupOpen(true);
  const handleSignupClose = () => setSignupOpen(false);

  const handleLogout = () => {
    logout();
    setToastMessage('Logout successful');
    setToastOpen(true);
    navigate('/'); 
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'blue', padding: '0 20px' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => handleNavigate('/')}
          >
            TaskManager-IQ
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {user ? (
              <>
                <Typography variant="body1" sx={{ color: 'inherit', alignSelf: 'center' }}>
                  Welcome, {user.fullName}!
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleLoginOpen} color="inherit">
                  Login
                </Button>
                <Button onClick={handleSignupOpen} color="inherit">
                  Signup
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <LoginDialog open={loginOpen} onClose={handleLoginClose} />
      <SignupDialog open={signupOpen} onClose={handleSignupClose} />

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={handleToastClose}
        message={toastMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: 'green',
          },
        }}
      />
    </>
  );
};

export default Header;
