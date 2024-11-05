import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {
    signupRoute, 
    loginRoute, 
    resetPasswordRoute,
    createProject,
    getAllProjects,
    deleteProject,
    updateProject,
    createTask,
    getAllTasks,
    deleteTask,
    updateTask,
    filterTasks,
    verifyToken,
} from './routes/routes.js';
import {authenticateToken} from './middlewares/middleware.js';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
const format = ':date[iso] :method :url :status :res[content-length] - :response-time ms';
app.use(morgan(format));

app.use(bodyParser.urlencoded({ extended: true }));

// Route to verify token
app.get('/api/verify', authenticateToken, verifyToken);

// Route to create a new user
app.post("/api/signup", signupRoute);

// Route to login a user
app.post("/api/login", loginRoute);

// Route to reset user password
app.post("/api/forgot-password", resetPasswordRoute);


// Route to add projects
app.post('/api/projects/:id', authenticateToken, createProject);

// Route to fetch projects
app.get('/api/projects/:id', authenticateToken, getAllProjects);


// Route to update projects
app.put('/api/projects/:projectId/:userId', authenticateToken, updateProject);


// Route to delete projects
app.delete('/api/projects/:projectId/:userId', authenticateToken, deleteProject);

// Route to add tasks
app.post('/api/tasks/:userId/:projectId', authenticateToken, createTask);


// Route to fetch tasks
app.get('/api/tasks/:userId/:projectId', authenticateToken, getAllTasks);


// Route to update tasks
app.put('/api/tasks/:userId/:projectId/:taskId', authenticateToken, updateTask);


// Route to delete tasks
app.delete('/api/tasks/:userId/:projectId/:taskId', authenticateToken, deleteTask);

// Route to filter tasks
app.get('/api/tasks/filter', authenticateToken, filterTasks);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});