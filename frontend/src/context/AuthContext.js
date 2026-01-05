import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, login as apiLogin, register as apiRegister, getMe, logout as apiLogout } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                // Verify token and get user info
                try {
                    const res = await getMe();
                    setUser(res.user);
                } catch (e) {
                    // Token invalid or expired
                    await AsyncStorage.removeItem('token');
                    setUser(null);
                }
            }
        } catch (e) {
            console.error('Failed to load user', e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await apiLogin(email, password);
        await AsyncStorage.setItem('token', res.token);
        setUser(res.user);
    };

    const register = async (name, email, password) => {
        const res = await apiRegister(name, email, password);
        await AsyncStorage.setItem('token', res.token);
        setUser(res.user);
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
