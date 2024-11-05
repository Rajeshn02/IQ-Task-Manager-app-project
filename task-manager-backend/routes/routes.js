
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import { createUser, resetPassword, validateUser } from '../database.js';


const JWT_SECRET = 'your_jwt_secret';

export const dbPromise = open({
    filename: './task-manager.db',  
    driver: sqlite3.Database
});
// Function for signup route
export async function signupRoute(req, res) {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
        return res.status(400).json({ message: "Email, password, and full name are required." });
    }

    try {
        const userId = await createUser(email, password, fullName);
        res.status(201).json({ message: "User created successfully", userId, status: "success" });

    } catch (error) {
        console.error(error);
        if (error.message === "User already exists.") {
            return res.status(400).json({ message: error.message, status: "failed" });
        }
        res.status(500).json({ message: "An error occurred while creating the user.", status: "failed" });
    }
}
// Function for verifying toekn and return whether is valid and not expired
export async function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required', status: 'failed' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            // Check if the error is specifically due to an expired token
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired', status: 'failed', expiredAt: err.expiredAt });
            }
            return res.status(403).json({ message: 'Invalid token', status: 'failed' });
        }

        req.user = { userId: decoded.userId };
        next();
    })
};
// Function for login route
export async function loginRoute(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required.", status: "failed" });
    }

    try {
        const user = await validateUser(email, password);
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2m' }); 
        res.status(200).json({ message: "Login successful", token, status: "success", username: user.full_name, userId: user.id });

    } catch (error) {
        console.error(error);
        res.status(401).json({ message: error.message, status: "failed" });
    }
}

// Function for reset password route
export async function resetPasswordRoute(req, res) {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "Email, new password and confirm password are required.", status: "failed" });
    }
    try {
        await resetPassword(email, newPassword, confirmPassword);
        res.status(200).json({ message: "Password reset successful", "status": "success" });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: error.message, status: "failed"});
    }
}

// Function for creating projects
export const createProject = async (req, res) => {
    const { name, description } = req.body;
    

    if (!name || !description) {
        return res.status(400).json({ message: "Project name and description are required." });
    }

    try {
        const db = await dbPromise;
        //const userId = req.user.userId;
        const userId = req.params.id; 
        const result = await db.run(
            'INSERT INTO projects (user_id, name, description, created_at) VALUES (?, ?, ?, ?)',
            [userId, name, description, new Date()]
        );

        const projectId = result.lastID;
        res.status(201).json({ message: "Project created successfully", projectId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the project." });
    }
};

// Function for getting all projects
export const getAllProjects = async (req, res) => {
    try {
        const db = await dbPromise;
        const userId = req.user.userId; 
        console.log(req.params.id);
        const id = req.params.id;

        const projects = await db.all('SELECT * FROM projects WHERE user_id = ?', [id]);
        res.status(200).json({ projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching projects.", status: "failed" });
    }
}

// Function for deleting a project
export const deleteProject = async (req, res) => {
    const { projectId, userId } = req.params;

    try {
        const db = await dbPromise;
        //const userId = req.user.userId; 
        await db.run('DELETE FROM tasks WHERE project_id = ?', [projectId]);
        const result = await db.run('DELETE FROM projects WHERE id = ? AND user_id = ?', [projectId, userId]);
        if (result.changes > 0) {
            res.status(200).json({ message: "Project deleted successfully", status: "success" });
        } else {
            res.status(404).json({ message: "Project not found", status: "failed" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the project.", status: "failed" });
    }

}

// Function for updating a project
export const updateProject = async (req, res) => {
    const { projectId, userId } = req.params;
    const { name, description } = req.body;

    try {
        const db = await dbPromise;
        //const userId = req.user.userId; 

        const result = await db.run('UPDATE projects SET name = ?, description = ? WHERE id = ? AND user_id = ?', [name, description, projectId, userId]);
        if (result.changes > 0) {
            res.status(200).json({ message: "Project updated successfully", status: "success" });
        } else {
            res.status(404).json({ message: "Project not found", status: "failed" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the project.", status: "failed" });
    }
}

// Function for creating tasks
export const createTask = async (req, res) => {
    const { title, description, priority, status, dueDate } = req.body;
    console.log(dueDate);
    const { projectId, userId } = req.params;
    const due_date = new Date(dueDate);

    if (!title || !description || !priority || !due_date || !userId || !projectId) {
        return res.status(400).json({ message: "Title, description, priority, and due date are required.", status: "failed" });
    }

    try {
        const db = await dbPromise;

        const existingTask = await db.get(
            `SELECT * FROM tasks WHERE user_id = ? AND project_id = ? AND title = ?`,
            [userId, projectId, title]
        );

        if (existingTask) {
            return res.status(400).json({ message: "Task already exists for this user and project.", status: "failed" });
        }

        const result = await db.run(
            `INSERT INTO tasks 
            (project_id, user_id, title, description, priority, due_date, status, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [projectId, userId, title, description, priority, due_date, status, new Date(), new Date()]
        );

        const taskId = result.lastID;
        res.status(201).json({ message: "Task created successfully", taskId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the task.", status: "failed" });
    }
};


// Function for getting all tasks
export const getAllTasks = async (req, res) => {
    try {
        const db = await dbPromise;
        const { userId, projectId } = req.params;
        const tasks = await db.all(`SELECT * FROM tasks WHERE user_id = ? AND project_id = ?`, [userId, projectId]);
        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching tasks.", status: "failed" });
    }
};


// Function for deleting a task
export const deleteTask = async (req, res) => {
    const { userId, projectId, taskId } = req.params;
    try {
        const db = await dbPromise;
        const result = await db.run('DELETE FROM tasks WHERE user_id = ? AND project_id = ? AND id = ?', [userId, projectId, taskId]);
        if (result.changes > 0) {
            res.status(200).json({ message: "Task deleted successfully", status: "success" });
        } else {
            res.status(404).json({ message: "Task not found", status: "failed" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the task.", status: "failed" });
    }
};


// Function for updating a task
export const updateTask = async (req, res) => {
    const { taskId, projectId, userId } = req.params;
    const { title, description, priority, status, dueDate } = req.body;
    const due_date = new Date(dueDate); 

    try {
        const db = await dbPromise;
        const result = await db.run('UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, due_date = ? WHERE id = ? AND user_id = ? AND project_id = ?', [title, description, priority, status, due_date, taskId, userId, projectId]);
        if (result.changes > 0) {
            res.status(200).json({ message: "Task updated successfully", status: "success" });
        } else {
            res.status(404).json({ message: "Task not found", status: "failed" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the task.", status: "failed" });
    }
};

// Function for filtering tasks
export const filterTasks = async (req, res) => {
    const { status, priority, dueDate } = req.query;
    try {
        const db = await dbPromise;
        const userId = req.user.userId; 
        if(status){
            const tasks = await db.all(`SELECT * FROM tasks WHERE user_id = ? AND status = ?`, [userId, status]);
            res.status(200).json({ tasks });
        }
        else if(priority){
            const tasks = await db.all(`SELECT * FROM tasks WHERE user_id = ? AND priority = ?`, [userId, priority]);
            console.log(tasks);
            res.status(200).json({ tasks });
        }
        else if(dueDate){
            const tasks = await db.all(`SELECT * FROM tasks WHERE user_id = ? AND due_date = ?`, [userId, dueDate]);
            res.status(200).json({ tasks });
        }
        else{
            const tasks = await db.all(`SELECT * FROM tasks WHERE user_id = ?`, [userId]);
            res.status(200).json({ tasks });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while filtering tasks.", status: "failed" });
    }
};


