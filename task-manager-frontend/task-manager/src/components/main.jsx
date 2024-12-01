import React from 'react';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MainContent = () => {
  const ideasInfo = [
    {
      title: 'Weekly Goals',
      description: 'Break larger projects into smaller tasks to focus weekly efforts.'
      
    },
    {
      title: 'Progress Tracker',
      description: 'Visual display of task completion status.'
    },
    {
      title: 'To-Do List',
      description: 'A simple list to organize and prioritize tasks.'
    },
  ];

  const navigate = useNavigate();


  function handleNavigate(href){
    navigate(`/${href}`);

  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '100vh',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <Box>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Welcome to TaskManager-IQ!
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleNavigate(`projects/${localStorage.getItem('id')}`)}
          sx={{
            backgroundColor: '#fff',
            color: '#2575fc',
            fontSize: '1.2rem',
            padding: '10px 20px',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          CLICK HERE to Start! 😊
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          flexWrap: 'wrap',
          width: '100%',
          height: '50%',
          alignItems: 'center',
          mt: 4,
        }}
      >
        {ideasInfo.map((idea, index) => (
          <Card
            key={index}
            sx={{
              minWidth: 200,
              maxWidth: 300,
              backgroundColor: '#000', 
              color: '#fff',
              boxShadow: 3,
              borderRadius: 2,
              p: 2,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  color: index === 0 ? '#39FF14' : index === 1 ? '#FF69B4' : '#00FFFF', 
                  fontWeight: 'bold',
                  textShadow: '0 0 5px #fff, 0 0 10px currentColor',
                }}
              >
                {idea.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                {idea.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default MainContent;
