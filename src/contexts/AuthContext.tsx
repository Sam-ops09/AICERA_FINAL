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
    resetPassword: (email: string) => Promise<void>;
    verifyOTP: (email: string, otp: string, newPassword: string) => Promise<void>;
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

    const resetPassword = async (email: string): Promise<void> => {
        try {
            // Check if user exists
            const { data: user } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();

            if (!user) {
                throw new Error('User not found');
            }

            // Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 30); // OTP valid for 30 minutes

            // Delete any existing OTPs for this user
            await supabase
                .from('password_resets')
                .delete()
                .eq('user_id', user.id);

            // Store new OTP
            const { error: otpError } = await supabase
                .from('password_resets')
                .insert([{
                    user_id: user.id,
                    otp: otp,
                    expires_at: expiresAt.toISOString(),
                    used: false
                }]);

            if (otpError) throw otpError;

            try {
                const response = await fetch('/api/send-reset-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, otp })
                });

                if (!response.ok) {
                    throw new Error('Failed to send reset email');
                }

                // For development, still log the OTP
                if (process.env.NODE_ENV === 'development') {
                    console.log('Reset OTP:', otp);
                }

                console.log('Password reset email sent');
            } catch (error) {
                console.error('Failed to send email:', error);
                throw new Error('Failed to send reset email');
            }
        } catch (error: any) {
            throw new Error(error.message || 'Failed to initiate password reset');
        }
    };

    const verifyOTP = async (email: string, otp: string, newPassword: string) => {
        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (!user) {
            throw new Error('User not found');
        }

        // Verify OTP with additional checks
        const { data: reset } = await supabase
            .from('password_resets')
            .select('*')
            .eq('user_id', user.id)
            .eq('otp', otp)
            .eq('used', false)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (!reset) {
            throw new Error('Invalid or expired OTP');
        }

        try {
            // Start transaction
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(newPassword, salt);

            // Update password
            const { error: updateError } = await supabase
                .from('users')
                .update({ password: hashedPassword })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Mark OTP as used
            const { error: otpError } = await supabase
                .from('password_resets')
                .update({ used: true })
                .eq('id', reset.id);

            if (otpError) throw otpError;

        } catch (error: any) {
            throw new Error('Failed to update password. Please try again.');
        }
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
            resetPassword,
            verifyOTP,
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
