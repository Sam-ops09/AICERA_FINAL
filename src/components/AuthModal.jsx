
import { useRef, useEffect, useState } from 'react';
import styles from './AuthModal.module.css';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthModal() {
    const { isAuthOpen, closeAuth, login, signup, resetPassword, verifyOTP, setIsLoggedIn } = useAuth();
    const [mode, setMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('mode') === 'reset' ? 'reset' : 'login';
        }
        return 'login';
    });
    const [form, setForm] = useState({ email: '', password: '', otp: '' });
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const modalRef = useRef(null);
    const lastFocusedElement = useRef(null);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => password.length >= 6;

    const resetForm = () => {
        setForm({ email: '', password: '', otp: '' });
        setError('');
        setPending(false);
        setOtpSent(false);
    };

    useEffect(() => {
        if (isAuthOpen) {
            lastFocusedElement.current = document.activeElement;
            const focusable = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length) focusable[0].focus();

            const handleTab = (e) => {
                const focusableEls = modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const first = focusableEls[0];
                const last = focusableEls[focusableEls.length - 1];
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === first) {
                            e.preventDefault();
                            last.focus();
                        }
                    } else {
                        if (document.activeElement === last) {
                            e.preventDefault();
                            first.focus();
                        }
                    }
                }
            };

            // Save a reference to the current modalRef value
            const currentModalRef = modalRef.current;

            currentModalRef.addEventListener('keydown', handleTab);

            return () => {
                // Use the saved reference in the cleanup function
                if (currentModalRef) {
                    currentModalRef.removeEventListener('keydown', handleTab);
                }
            };
        } else if (lastFocusedElement.current) {
            lastFocusedElement.current.focus();
        }
    }, [isAuthOpen]);

    if (!isAuthOpen) return null;

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateEmail(form.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setPending(true);
        try {
            if (mode === 'login') {
                if (!validatePassword(form.password)) {
                    setError('Password must be at least 6 characters.');
                    return;
                }
                await login(form.email, form.password);
                closeAuth();
                setIsLoggedIn(true);
            } else if (mode === 'signup') {
                if (!validatePassword(form.password)) {
                    setError('Password must be at least 6 characters.');
                    return;
                }
                await signup(form.email, form.password);
                closeAuth();
                setIsLoggedIn(true);
            } else if (mode === 'reset') {
                if (!otpSent) {
                    await resetPassword(form.email);
                    setOtpSent(true);
                } else {
                    if (!form.otp) {
                        setError('Please enter the OTP sent to your email.');
                        return;
                    }
                    if (!validatePassword(form.password)) {
                        setError('New password must be at least 6 characters.');
                        return;
                    }
                    await verifyOTP(form.email, form.otp, form.password);
                    setMode('login');
                    setOtpSent(false);
                }
            }
        } catch (err) {
            setError(err.message);
        }
        setPending(false);
    };

    return (
        <div role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" className={styles.overlay}>
            <div ref={modalRef} className={styles.modal}>
                <h2 id="auth-modal-title" className={styles.title}>
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            autoComplete="email"
                            required
                            className={styles.input}
                            value={form.email}
                            onChange={handleChange}
                            disabled={pending}
                        />
                    </div>
                    {(mode === 'login' || mode === 'signup' || (mode === 'reset' && otpSent)) && (
                        <div className={styles.inputGroup}>
                            <input
                                name="password"
                                type="password"
                                placeholder={mode === 'reset' ? 'New Password' : 'Password'}
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                required
                                minLength={6}
                                className={styles.input}
                                value={form.password}
                                onChange={handleChange}
                                disabled={pending}
                            />
                        </div>
                    )}
                    {mode === 'reset' && otpSent && (
                        <div className={styles.inputGroup}>
                            <input
                                name="otp"
                                type="text"
                                placeholder="Enter OTP"
                                required
                                className={styles.input}
                                value={form.otp}
                                onChange={handleChange}
                                disabled={pending}
                            />
                        </div>
                    )}
                    {error && <div className={styles.error}>{error}</div>}
                    <button type="submit" disabled={pending} className={styles.submitButton}>
                        {pending ? 'Please wait…' :
                            mode === 'login' ? 'Sign In' :
                                mode === 'signup' ? 'Sign Up' :
                                    !otpSent ? 'Send Reset Code' : 'Reset Password'}
                    </button>
                </form>
                {mode === 'login' && (
                    <button
                        className={styles.forgotPassword}
                        onClick={() => {
                            setMode('reset');
                            resetForm();
                        }}
                        type="button"
                    >
                        Forgot Password?
                    </button>
                )}
                {mode === 'reset' && !otpSent && (
                    <div className={styles.resetInstructions}>
                        Enter your email to receive a password reset code
                    </div>
                )}
                {mode === 'reset' && otpSent && (
                    <div className={styles.resetInstructions}>
                        Enter the verification code sent to your email and your new password
                    </div>
                )}
                <div className={styles.switchMode}>
                    {mode === 'login' ? (
                        <>
                            <span>Don&#39;t have an account?</span>
                            <button
                                className={styles.switchButton}
                                onClick={() => {
                                    setMode('signup');
                                    resetForm();
                                }}
                                type="button"
                            >
                                Create one
                            </button>
                        </>
                    ) : (
                        <>
                            <span>Already have an account?</span>
                            <button
                                className={styles.switchButton}
                                onClick={() => {
                                    setMode('login');
                                    resetForm();
                                }}
                                type="button"
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </div>
                <button
                    className={styles.closeButton}
                    onClick={() => {
                        closeAuth();
                        resetForm();
                    }}
                    type="button"
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
