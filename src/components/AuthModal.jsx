import { useRef, useEffect, useState } from 'react';
import styles from './AuthModal.module.css';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthModal() {
    const { isAuthOpen, closeAuth, login, signup } = useAuth();
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);

    const modalRef = useRef(null);
    const lastFocusedElement = useRef(null);

    // Email and password validation
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => password.length >= 6;

    // Reset form, error, and pending states
    const resetForm = () => {
        setForm({ email: '', password: '' });
        setError('');
        setPending(false);
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
            modalRef.current.addEventListener('keydown', handleTab);
            return () => {
                if (modalRef.current) {
                    modalRef.current.removeEventListener('keydown', handleTab);
                }
            };
        } else if (lastFocusedElement.current) {
            lastFocusedElement.current.focus();
        }
    }, [isAuthOpen]);

    if (!isAuthOpen) return null;

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateEmail(form.email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (!validatePassword(form.password)) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setPending(true);
        try {
            if (mode === 'login') {
                await login(form.email, form.password);
            } else {
                await signup(form.email, form.password);
            }
        } catch (err) {
            setError(err.message);
        }
        setPending(false);
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            className={styles.overlay}
        >
            <div ref={modalRef} className={styles.modal}>
                <h2 id="auth-modal-title">{mode === 'login' ? 'Login' : 'Sign up'}</h2>
                <form onSubmit={handleSubmit}>
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
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        required
                        minLength={6}
                        className={styles.input}
                        value={form.password}
                        onChange={handleChange}
                        disabled={pending}
                    />
                    {error && <div className={styles.error}>{error}</div>}
                    <button
                        type="submit"
                        disabled={pending}
                        className={styles.submitButton}
                    >
                        {pending ? 'Please wait…' : mode === 'login' ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <div className={styles.switchMode}>
                    {mode === 'login' ? (
                        <>
                            <span>Don&#39;t have an account? </span>
                            <button
                                className={styles.switchButton}
                                onClick={() => { setMode('signup'); resetForm(); }}
                                type="button"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            <span>Already have an account? </span>
                            <button
                                className={styles.switchButton}
                                onClick={() => { setMode('login'); resetForm(); }}
                                type="button"
                            >
                                Login
                            </button>
                        </>
                    )}
                </div>
                <button
                    className={styles.closeButton}
                    onClick={() => { closeAuth(); resetForm(); }}
                    type="button"
                >
                    Close
                </button>
            </div>
        </div>
    );
}