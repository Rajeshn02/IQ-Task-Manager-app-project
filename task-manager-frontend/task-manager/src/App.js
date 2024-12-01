import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/header';
import ProjectPage from './components/projectPage';
import TaskPage from './components/taskPage';
import MainContent from './components/main';
import ProtectedRoute from './components/protectedRoute';
import LoginDialog from './components/loginDialog';
import './styles/style.css';

const App = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [expiredSession, setExpiredSession] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openLoginDialog) {
      setLoginOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          error.response.status === 401 &&
          (error.response.data.message === 'Token expired' || 
           error.response.data.message === 'jwt expired')
        ) {
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          
          navigate('/', { replace: true });

          setExpiredSession(true);
          setLoginOpen(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  const handleCloseLoginDialog = () => {
    setLoginOpen(false);
    setExpiredSession(false);
  };

  return (
    <div
      style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header setLoginOpen={setLoginOpen} />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route 
          path="/projects/:id" 
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/projects/tasks/:userId/:id" 
          element={
            <ProtectedRoute>
              <TaskPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <LoginDialog
        open={loginOpen}
        onClose={handleCloseLoginDialog}
        expiredSession={expiredSession}
        sessionTimeoutMessage={expiredSession ? "Session timeout. Please login again." : ""}
      />
    </div>
  );
};

export default App;