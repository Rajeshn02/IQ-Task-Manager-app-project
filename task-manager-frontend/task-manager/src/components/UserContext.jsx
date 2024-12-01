import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('fullName');
        return storedUser ? { fullName: storedUser, token: localStorage.getItem('token'), id: localStorage.getItem('id') } : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('fullName', userData.fullName);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('id', userData.id);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('fullName');
        localStorage.removeItem('token');
        localStorage.removeItem('id');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
