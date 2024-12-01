# 🗂️ Task Manager API

## Overview

The Task Manager API is a backend service built with Node.js, Express, and SQLite. It allows users to manage their tasks, projects, and user accounts. The API provides endpoints for user authentication, project management, and task management. 🚀

## Technologies Used

- Node.js
- Express
- SQLite
- JWT (JSON Web Tokens)
- Bcrypt for password hashing
- dotenv for environment variable management

## Environment Setup

### Prerequisites

- Node.js installed on your machine
- SQLite installed (or use the built-in SQLite library)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3001
   JWT_SECRET=your_jwt_secret
   ```

4. Run the database setup script to create the necessary tables:
   ```bash
   node db.js
   ```

5. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### User Authentication

#### 1. Signup 📝

- **Endpoint:** `POST /api/signup`
- **Headers:** 
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword",
    "fullName": "John Doe"
  }
  ```
- **Response:**
  - **201 Created**: User created successfully. 🎉
  - **400 Bad Request**: If email, password, or full name is missing or if the user already exists. ❌

#### 2. Login 🔑

- **Endpoint:** `POST /api/login`
- **Headers:** 
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - **200 OK**: Login successful, returns a JWT token. ✅
  - **401 Unauthorized**: Invalid email or password. 🚫

#### 3. Reset Password 🔄

- **Endpoint:** `PUT /api/forgot-password`
- **Headers:** 
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "newPassword": "newpassword",
    "confirmPassword": "newpassword"
  }
  ```
- **Response:**
  - **200 OK**: Password reset successful. 🎊
  - **400 Bad Request**: If passwords do not match or required fields are missing. ⚠️

### Project Management

#### 4. Create Project 🛠️

- **Endpoint:** `POST /api/projects/:id`
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "New Project",
    "description": "Project description"
  }
  ```
- **Response:**
  - **201 Created**: Project created successfully. 🎈
  - **400 Bad Request**: If name or description is missing. ❗

#### 5. Get All Projects 📂

- **Endpoint:** `GET /api/projects/:id`
- **Headers:** 
  - `Authorization: Bearer <token>`
- **Response:**
  - **200 OK**: Returns a list of projects for the user. 📋
  - **401 Unauthorized**: If token is missing or invalid. 🚷

#### 6. Update Project ✏️

- **Endpoint:** `PUT /api/projects/:projectId/:userId`
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "Updated Project",
    "description": "Updated description"
  }
  ```
- **Response:**
  - **200 OK**: Project updated successfully. 🔄
  - **404 Not Found**: If the project does not exist. ❓

#### 7. Delete Project 🗑️

- **Endpoint:** `DELETE /api/projects/:projectId/:userId`
- **Headers:** 
  - `Authorization: Bearer <token>`
- **Response:**
  - **200 OK**: Project deleted successfully. 🥳
  - **404 Not Found**: If the project does not exist. 🚫

### Task Management

#### 8. Create Task ✅

- **Endpoint:** `POST /api/tasks/:userId/:projectId`
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "title": "New Task",
    "description": "Task description",
    "priority": "Medium",
    "status": "Pending",
    "dueDate": "2023-12-31"
  }
  ```
- **Response:**
  - **201 Created**: Task created successfully. 🎉
  - **400 Bad Request**: If required fields are missing. ⚠️

#### 9. Get All Tasks 📋

- **Endpoint:** `GET /api/tasks/:userId/:projectId`
- **Headers:** 
  - `Authorization: Bearer <token>`
- **Response:**
  - **200 OK**: Returns a list of tasks for the user and project. 📂
  - **401 Unauthorized**: If token is missing or invalid. 🚷

#### 10. Update Task ✏️

- **Endpoint:** `PUT /api/tasks/:userId/:projectId/:taskId`
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "title": "Updated Task",
    "description": "Updated description",
    "priority": "High",
    "status": "In Progress",
    "dueDate": "2023-12-31"
  }
  ```
- **Response:**
  - **200 OK**: Task updated successfully. 🔄
  - **404 Not Found**: If the task does not exist. ❓

#### 11. Delete Task 🗑️

- **Endpoint:** `DELETE /api/tasks/:userId/:projectId/:taskId`
- **Headers:** 
  - `Authorization: Bearer <token>`
- **Response:**
  - **200 OK**: Task deleted successfully. 🥳
  - **404 Not Found**: If the task does not exist. 🚫

#### 12. Filter Tasks 🔍

- **Endpoint:** `GET /api/tasks/filter`
- **Headers:** 
  - `Authorization: Bearer <token>`
- **Query Parameters:**
  - `status`: Filter by task status.
  - `priority`: Filter by task priority.
  - `dueDate`: Filter by due date.
- **Response:**
  - **200 OK**: Returns filtered tasks based on the provided query parameters. 📊
  - **401 Unauthorized**: If token is missing or invalid. 🚷

## Conclusion

This API provides a robust solution for managing tasks and projects efficiently. Feel free to contribute or reach out for any questions! 😊
