import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, db } from '../utils/db';

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    login: (email?: string, password?: string) => Promise<User | null>; // Return User for role checking
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('aerovision_user_session');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('aerovision_user_session');
            }
        }
    }, []);

    const login = async (email?: string, password?: string): Promise<User | null> => {
        // If credentials provided, verify against DB
        if (email && password) {
            const result = await db.login(email, password);
            if (result.success && result.user) {
                setUser(result.user);
                localStorage.setItem('aerovision_user_session', JSON.stringify(result.user));
                return result.user;
            }
            return null;
        }

        return null;
    };

    // Helper to manually set user session (e.g. after registration)
    const setSession = (u: User) => {
        setUser(u);
        localStorage.setItem('aerovision_user_session', JSON.stringify(u));
    };

    const logout = async () => {
        await db.logout();
        setUser(null);
        localStorage.removeItem('aerovision_user_session');
    };

    return (
        <AuthContext.Provider value={{
            isLoggedIn: !!user,
            user,
            login,
            logout,
            isAdmin: user?.role === 'admin'
        }}>
            {/* Expose setSession via a hack or refactor? Ideally, login should be the only way. 
          For Register.tsx, it calls db.register. It creates the user. 
          We can export a method here or update Register to just navigate to login.
          Let's stick to the interface but maybe allow `login` to take a User object directly if needed?
          Actually, we will update Login/Register to properly use credentials.
      */}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
