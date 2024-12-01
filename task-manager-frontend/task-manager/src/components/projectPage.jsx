import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Card,
  CardContent,
  Snackbar,
  Slide,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../components/UserContext';
import BackButton from '../components/backButton';

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [updateProjectId, setUpdateProjectId] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('');
  const navigate = useNavigate();
  const { logout } = useUser();

  useEffect(() => {
    const fetchProjects = async () => {
      const userId = localStorage.getItem('id');
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:3001/api/projects/${userId}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        setProjects(response.data.projects);
      } catch (error) {
        logout();
        navigate('/');
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, [logout, navigate]);

  const handleNewProjectOpen = () => setNewProjectOpen(true);
  const handleNewProjectClose = () => {
    setNewProjectOpen(false);
    setNewProjectName('');
    setNewProjectDescription('');
    setUpdateProjectId(null);
  };

  const handleAddOrUpdateProject = async () => {
    if (newProjectName.trim() && newProjectDescription.trim()) {
      const userId = localStorage.getItem('id');
      const token = localStorage.getItem('token');
      const projectData = { name: newProjectName, description: newProjectDescription };

      try {
        if (updateProjectId) {
          await axios.put(`http://localhost:3001/api/projects/${updateProjectId}/${userId}`, projectData, {
            headers: { authorization: `Bearer ${token}` },
          });
          setProjects((prevProjects) =>
            prevProjects.map((proj) =>
              proj.id === updateProjectId ? { ...proj, ...projectData } : proj
            )
          );
          setToastSeverity('success');
          setToastMessage('Project updated successfully!');
        } else {
          const response = await axios.post(`http://localhost:3001/api/projects/${userId}`, projectData, {
            headers: { authorization: `Bearer ${token}` },
          });
          setProjects([...projects, response.data]);
          setToastSeverity('success');
          setToastMessage('Project added successfully!');
        }
        setToastOpen(true);
        handleNewProjectClose();
      } catch (error) {
        console.error('Error adding or updating project:', error);
        setToastSeverity('error');
        setToastMessage('Error adding/updating project.');
        setToastOpen(true);
      }
    }
  };

  const handleUpdateProject = (project) => {
    setUpdateProjectId(project.id);
    setNewProjectName(project.name);
    setNewProjectDescription(project.description);
    setNewProjectOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/api/projects/${projectId}/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setProjects((prevProjects) => prevProjects.filter((proj) => proj.id !== projectId));
      setToastSeverity('success');
      setToastMessage('Project deleted successfully!');
      setToastOpen(true);
    } catch (error) {
      console.error('Error deleting project:', error);
      setToastSeverity('error');
      setToastMessage('Error deleting project.');
      setToastOpen(true);
    }
  };

  const handleViewTasks = (userId, projectId) => {
    navigate(`/projects/tasks/${userId}/${projectId}`);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: 2,
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        overflowY: 'auto',
      }}
    >
      <BackButton />

      <Typography
        variant="h4"
        sx={{
          mb: 3,
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#9400D3',
          textShadow: '0 0 2px #9400D3',
        }}
      >
        YOUR PROJECTS
      </Typography>

      <Button variant="contained" color="primary" onClick={handleNewProjectOpen}>
        Add New Project
      </Button>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          marginTop: 2,
          justifyContent: 'center',
        }}
      >
        {projects.map((project) => (
          <Card
            key={project.id}
            sx={{
              minWidth: 250,
              backgroundColor: '#000',
              color: '#fff',
              borderRadius: 5,
              boxShadow: 2,
              mb: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {project.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                {project.description}
              </Typography>
              <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>
                Created at: {formatDate(project.created_at)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleViewTasks(localStorage.getItem('id'), project.id)}
                >
                  View Tasks
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  onClick={() => handleUpdateProject(project)}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={newProjectOpen} onClose={handleNewProjectClose}>
        <DialogTitle>{updateProjectId ? 'Update Project' : 'Create a New Project'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Project Name"
            type="text"
            fullWidth
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Project Description"
            type="text"
            fullWidth
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewProjectClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdateProject} color="primary">
            {updateProjectId ? 'Update Project' : 'Add Project'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toastOpen}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={SlideTransition}
        message={toastMessage}
        autoHideDuration={6000}
        sx={{
          '& .MuiSnackbarContent-root': {
            borderRadius: '8px',
            padding: '10px 20px',
            backgroundColor: toastSeverity === 'success' ? '#4caf50' : '#f44336',
            color: '#fff',
          },
        }}
      />
    </Box>
  );
};

const SlideTransition = (props) => {
  return <Slide {...props} direction="down" />;
};

export default ProjectPage;
