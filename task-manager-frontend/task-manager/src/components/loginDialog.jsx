import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import SignupDialog from './signupDialog';

const LoginDialog = ({ open, onClose, expiredSession, sessionTimeoutMessage }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');  // State for error message
  const navigate = useNavigate();
  const { login } = useUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    if (event) {
      event.preventDefault();
    }

    // Reset error message before new login attempt
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email: formData.username,
        password: formData.password,
      });

      if (response.data.status === 'success') {
        const userData = {
          id: response.data.userId,
          fullName: response.data.username,
          token: response.data.token,
        };

        login(userData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('id', response.data.userId);

        setFormData({
          username: '',
          password: '',
        });

        handleDialogClose();
        navigate('/');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.response?.data?.message || 'Authentication failed');
    }
  };

  const handleDialogClose = () => {
    setFormData({
      username: '',
      password: '',
    });
    setError('');  // Clear error on close
    setShowSignup(false);
    setShowForgotPassword(false);
    onClose();
  };

  const handleSignupClick = () => {
    setShowSignup(true);
  };

  const handleLoginClick = () => {
    setShowSignup(false);
    setShowForgotPassword(false);
  };

  return (
    <>
      <Dialog 
        open={open && !showSignup && !showForgotPassword} 
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            width: '400px',
            borderRadius: '20px',
            background: '#1a1a1a',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }
        }}
      >
        <IconButton
          onClick={handleDialogClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ 
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          padding: '40px 30px',
        }}>
          <Typography variant="h4" sx={{ 
            color: '#fff',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Welcome Back!
          </Typography>

          {sessionTimeoutMessage && (
            <Typography sx={{ 
              color: '#fff',
              textAlign: 'center',
              marginBottom: '20px',
              padding: '10px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '10px'
            }}>
              {sessionTimeoutMessage}
            </Typography>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              name="username"
              type="email"
              value={formData.username}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#fff' }}/>
                  </InputAdornment>
                ),
              }}
              sx={{
                marginBottom: '20px',
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#fff' }}/>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                marginBottom: '20px',
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />

            {/* Display error message if exists */}
            {error && (
              <Typography 
                sx={{ color: '#FF6B6B', marginBottom: '20px', textAlign: 'center' }}
              >
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              sx={{
                padding: '12px',
                background: '#fff',
                color: '#1a1a1a',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
                marginBottom: '20px',
              }}
            >
              Log In
            </Button>

            <Button
              fullWidth
              onClick={handleSignupClick}
              sx={{
                color: '#fff',
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Don't have an account? Sign Up
            </Button>

            <Typography
              align="center"
              sx={{
                marginTop: '20px',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                '&:hover': {
                  color: '#fff',
                },
              }}
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <SignupDialog
        open={open && showSignup}
        onClose={handleDialogClose}
        onLoginClick={handleLoginClick}
      />

      <SignupDialog
        open={open && showForgotPassword}
        onClose={handleDialogClose}
        onLoginClick={handleLoginClick}
        isPasswordReset={true}
      />
    </>
  );
};

export default LoginDialog;
