import React from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <IconButton
      onClick={() => navigate(-1)} 
      sx={{
        position: 'absolute',
        top: 300,
        left: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.7)', 
        },
      }}
    >
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackButton;
