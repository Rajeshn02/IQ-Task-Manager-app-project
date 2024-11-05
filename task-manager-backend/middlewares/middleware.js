import jwt from 'jsonwebtoken';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const JWT_SECRET = 'your_jwt_secret';

export const dbPromise = open({
    filename: './task-manager.db',  
    driver: sqlite3.Database
});

// Middleware to protect routes and verify JWT token
export const authenticateToken = (req, res, next) => {
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
    });
};
