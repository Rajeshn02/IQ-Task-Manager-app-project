import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const dbPromise = open({
    filename: './task-manager.db',
    driver: sqlite3.Database
});
// Function to create a new user
export const createUser = async (email, password, fullName) => {
    const db = await dbPromise;

    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
        throw new Error("User already exists.");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await db.run(
        'INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)',
        [email, hashedPassword, fullName]
    );

    return result.lastID;
};


// Function to verify user credentials
export const validateUser = async (email, password) => {
    const db = await dbPromise;
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
        throw new Error("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error("Invalid email or password.");
    }

    return user;
};


// Function to reset user password
export const resetPassword = async (email, newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword) {
        throw new Error("Password and confirm password do not match.");
    }
    const db = await dbPromise;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await db.run('UPDATE users SET password_hash = ? WHERE email = ?', [hashedPassword, email]);
};

