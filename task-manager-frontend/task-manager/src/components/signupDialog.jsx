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
import { toast } from 'react-toastify';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';

const SignupDialog = ({ open, onClose, onLoginClick, isPasswordReset = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const dialogTitle = isPasswordReset ? "Reset Password" : "Create Account";
  const buttonText = isPasswordReset ? "Reset Password" : "Sign Up";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    if (isPasswordReset) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    } else {
      if (!formData.fullName || !formData.email || !formData.password) {
        toast.error('Please fill in all required fields');
        return;
      }
    }

    try {
      const endpoint = isPasswordReset ? 'forgot-password' : 'signup';
      const method = isPasswordReset ? 'put' : 'post';
      
      const requestData = isPasswordReset ? {
        email: formData.email,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword
      } : {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios[method](`${process.env.REACT_APP_API_URL}/${endpoint}`, requestData);
      
      if (response.data.status === 'success') {
        toast.success(isPasswordReset ? 'Password reset successful!' : 'Signup successful!');
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        onClose();
        if (!isPasswordReset) {
          onLoginClick();
        }
      } else {
        toast.error(response.data.message || `${isPasswordReset ? 'Password reset' : 'Signup'} failed`);
      }
    } catch (error) {
      console.error(`${isPasswordReset ? 'Password reset' : 'Signup'} error:`, error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleDialogClose = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    onClose();
  };

  const textFieldStyles = {
    marginBottom: '20px',
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
      '&.Mui-focused fieldset': { borderColor: '#fff' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
  };

  return (
    <Dialog 
      open={open} 
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
        background: 'linear-gradient(45deg, #4ECDC4, #556270)',
        padding: '40px 30px',
      }}>
        <Typography variant="h4" sx={{ 
          color: '#fff',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {dialogTitle}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {!isPasswordReset && (
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#fff' }}/>
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyles}
            />
          )}

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#fff' }}/>
                </InputAdornment>
              ),
            }}
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label={isPasswordReset ? "New Password" : "Password"}
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
            sx={textFieldStyles}
          />

          {isPasswordReset && (
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                ...textFieldStyles,
                marginBottom: '30px',
              }}
            />
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
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
            {buttonText}
          </Button>

          <Button
            fullWidth
            onClick={onLoginClick}
            sx={{
              color: '#fff',
              textTransform: 'none',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Back to Sign In
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SignupDialog;