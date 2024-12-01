import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer
} from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import DashboardIcon from '@mui/icons-material/Dashboard';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import TaskDashboard from '../components/dashboard';
import BackButton from '../components/backButton';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskPage = () => {
  const { id: projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '', priority: 'Low', status: 'To Do' });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);


  const navigate = useNavigate();

  const { logout } = useUser();

  useEffect(() => {
    const fetchTasks = async () => {
      const userId = localStorage.getItem('id');
      const token = localStorage.getItem('token');
  
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks/${userId}/${projectId}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        setTasks(response.data.tasks);
      } catch (error) {
        logout();
        navigate('/');
        console.error('Error fetching tasks:', error);
      }
    };
  
    fetchTasks();
  }, [projectId, refreshTrigger]);

  const handleUpdateTask = async (taskId, updatedTask) => {
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/tasks/${userId}/${projectId}/${taskId}`, updatedTask, {
        headers: { authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)));
      toast.success('Task updated successfully!', { position: "top-right" });
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task', { position: "top-right" });
    }
  };

  const handleDeleteTask = async (taskId) => {
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${userId}/${projectId}/${taskId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast.success('Task deleted successfully!', { position: "top-right" });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task', { position: "top-right" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleAddTask = async () => {
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    
    const taskToSubmit = { ...newTask };
    
    if (taskToSubmit.due_date) {
      const date = new Date(taskToSubmit.due_date);
      taskToSubmit.dueDate = date.toISOString().split('T')[0];
      delete taskToSubmit.due_date;
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/tasks/${userId}/${projectId}`, taskToSubmit, {
        headers: { authorization: `Bearer ${token}` },
      });
      
      if (response.data) {
        setNewTask({ title: '', description: '', due_date: '', priority: 'Low', status: 'To Do' });
        setOpenAdd(false);
        
        setRefreshTrigger(prev => prev + 1);
        
        toast.success('Task added successfully!', { position: "top-right" });
      }
  
    } catch (error) {
      console.error('Error adding task:', error.response ? error.response.data : error.message);
      toast.error('Failed to add task', { position: "top-right" });
    }
  };
  

  const handleOpenUpdateDialog = (task) => {
    setCurrentTask(task);
    setOpenUpdate(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleConfirmUpdate = async () => {
    await handleUpdateTask(currentTask.id, currentTask);
    setOpenUpdate(false);
  };

  const toggleDrawer = (open) => {
    setOpenDrawer(open);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 1,
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        padding: 1,
      }}
    >
      <BackButton />
      <ToastContainer />

      <Button variant="contained" size="small" onClick={() => setOpenAdd(true)} sx={{ mb: 1 }}>
        Add Task
      </Button>

      {tasks.map((task) => (
        <Card
          key={task.id}
          sx={{
            mb: 1,
            width: 180,
            position: 'relative',
            borderRadius: '8px',
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
            backgroundColor: 'black',
            color: 'white',
          }}
        >
          <CardContent sx={{ padding: 2 }}>
            <Typography variant="subtitle1" sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}>
              {task.title}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5, color: 'white' }}>
              {task.description}
            </Typography>

            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              Status: {task.status}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              Priority: {task.priority}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              Due: {new Date(task.due_date).toLocaleDateString()}
            </Typography>

            <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
              <Button
                variant="contained"
                size="small"
                sx={{ fontSize: 10, padding: '2px 6px' }}
                onClick={() => handleOpenUpdateDialog(task)}
              >
                Update
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ fontSize: 10, padding: '2px 6px' }}
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </Button>
            </Box>
          </CardContent>

          <IconButton
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              color: 'rgba(0, 0, 0, 0.54)',
              transform: 'rotate(30deg)',
              fontSize: 16,
            }}
            onClick={() => console.log(`Pin ${task.title}`)}
          >
            <PushPinIcon fontSize="small" />
          </IconButton>
        </Card>
      ))}

      <IconButton
        onClick={() => toggleDrawer(true)}
        sx={{
          position: 'fixed',
          top: '50%',
          right: 0,
          backgroundColor: '#1976d2',
          color: '#fff',
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        }}
      >
        <DashboardIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => toggleDrawer(false)}
        sx={{
          width: '50%',
          '& .MuiDrawer-paper': { width: '30%', height: '78vh', marginTop: '5%', backgroundColor: 'black', color: 'white' },
        }}
      >
        <TaskDashboard tasks={tasks} />
      </Drawer>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={newTask.description}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            margin="dense"
            label="Due Date"
            name="due_date"
            type="date"
            value={newTask.due_date}
            onChange={handleChange}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Priority</InputLabel>
            <Select name="priority" value={newTask.priority} onChange={handleChange} size="small">
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={newTask.status} onChange={handleChange} size="small">
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button onClick={handleAddTask}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <DialogTitle>Update Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            name="title"
            value={currentTask?.title || ''}
            onChange={handleUpdateChange}
            fullWidth
            size="small"
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={currentTask?.description || ''}
            onChange={handleUpdateChange}
            fullWidth
            size="small"
          />
          <TextField
            margin="dense"
            label="Due Date"
            name="due_date"
            type="date"
            value={currentTask?.due_date || ''}
            onChange={handleUpdateChange}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Priority</InputLabel>
            <Select name="priority" value={currentTask?.priority || 'Low'} onChange={handleUpdateChange} size="small">
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={currentTask?.status || 'To Do'} onChange={handleUpdateChange} size="small">
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Cancel</Button>
          <Button onClick={handleConfirmUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskPage;
