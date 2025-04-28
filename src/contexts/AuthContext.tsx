
import { createContext, useContext, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type AuthContextType = {
    isAuthOpen: boolean;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    openAuth: () => void;
    closeAuth: () => void;
    signup: (email: string, password: string) => Promise<any>;
    login: (email: string, password: string) => Promise<any>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const openAuth = () => setIsAuthOpen(true);
    const closeAuth = () => setIsAuthOpen(false);

    const logout = () => {
        setIsLoggedIn(false);
    };

    // Signup: Hash password before storing
    const signup = async (email: string, password: string) => {
        // Check if user already exists
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            throw new Error('User already exists');
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Insert new user with hashed password
        const { data, error } = await supabase
            .from('users')
            .insert([{ email, password: hashedPassword }])
            .select()
            .single();

        if (error) throw error;
        return data;
    };

    // Login: Compare password hash
    const login = async (email: string, password: string) => {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            throw new Error('User not found');
        }
        // Compare password with hash
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            throw new Error('Incorrect password');
        }
        return user;
    };

    return (
        <AuthContext.Provider value={{
            isAuthOpen,
            isLoggedIn,
            setIsLoggedIn,
            openAuth,
            closeAuth,
            signup,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
