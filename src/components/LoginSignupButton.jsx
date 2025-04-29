
import classNames from 'classnames';
import { useAuth } from '@/contexts/AuthContext';

/**
 * A login/signup button styled to match the header navigation links.
 * @param {object} props
 * @param {'header'|'mobile'} [props.variant] - Visual style matching header bar or mobile menu.
 * @param {string} [props.className] - Additional classNames.
 * @param {React.ReactNode} [props.children]
 */
export default function LoginSignupButton({ variant = 'header', className, children, ...rest }) {
    const { openAuth, logout, isLoggedIn } = useAuth();

    // Variant-based styling
    const styles =
        variant === 'mobile'
            ? 'font-bold text-xl bottom-shadow-1 hover:bottom-shadow-5 text-center py-3 px-8'
            : 'font-bold p-4 link-fill inline-flex items-center uppercase tracking-widest items-stretch';

    // Optional: Add left (or right) border if styled like other nav links
    const border =
        variant === 'mobile'
            ? ''
            : 'border-l border-current';

    const handleClick = () => {
        if (isLoggedIn) {
            logout();
        } else {
            openAuth();
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={classNames(styles, border, className)}
            {...rest}
        >
            {isLoggedIn ? 'Logout' : (children || 'Login / Sign Up')}
        </button>
    );
}
