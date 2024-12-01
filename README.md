# Task Manager-IQ 📊

## Overview 🌟

Task Manager-IQ is a full-stack web application designed to help users efficiently manage their tasks and projects. Built with React for the frontend and Node.js for the backend, this application provides a user-friendly interface for creating, updating, and tracking tasks. Whether you're managing personal tasks or collaborating on projects, Task Manager-IQ has you covered! 🎉

## Features 🚀

### Backend
- **User Authentication**: Secure login and signup functionality using JWT. 🔐
- **Project Management**: Create, update, and delete projects. 📂
- **Task Management**: Create, update, delete, and filter tasks based on various criteria. ✅
- **RESTful API**: Well-defined endpoints for all functionalities. 📡

### Frontend 💻
- **Create and Manage Tasks**: Easily add, update, and delete tasks. ✏️
- **Task Dashboard**: Visual representation of task statuses. 📊
- **Responsive Design**: Works seamlessly on both mobile and desktop devices. 📱💻

## Technologies Used 🛠️

### Backend
- Node.js
- Express
- SQLite
- JWT (JSON Web Tokens)
- Bcrypt for password hashing
- dotenv for environment variable management

### Frontend
- React
- Material-UI
- Axios for API calls
- React Router for navigation
- Chart.js for data visualization 📈

## Getting Started 🏁

### Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later) 🌐
- npm or yarn

### Setup Environment Variables

#### Backend
1. Create a `.env` file in the root of your backend project.
2. Add the following lines to the `.env` file:
   ```
   PORT=3001
   JWT_SECRET=your_jwt_secret
   ```

#### Frontend
1. Create a `.env` file in the root of your frontend project.
2. Add the following line to the `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```
   Replace the URL with your actual API endpoint if different.

### Installation 🛠️

#### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the database setup script:
   ```bash
   node db.js
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

### Running the Application 🚀

#### Backend
- The backend server will run on `http://localhost:3001`. 🌐

#### Frontend
To start the development server for the frontend, run:
```bash
npm start
```
or
```bash
yarn start
```
Open your browser and go to `http://localhost:3000` to view the application. 🎉

