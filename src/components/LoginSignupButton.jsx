

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
    const { openAuth } = useAuth();

    // Variant-based styling
    const styles =
        variant === 'mobile'
            ? 'text-xl bottom-shadow-1 hover:bottom-shadow-5 w-full text-center py-3 px-8'
            : 'p-4 link-fill inline-flex items-center uppercase tracking-widest hover:bg-main-100 transition';

    // Optional: Add left (or right) border if styled like other nav links
    // You might want to tweak which side has border depending on where button is placed
    const border =
        variant === 'mobile'
            ? ''
            : 'border-l border-current';

    return (
        <button
            type="button"
            onClick={openAuth}
            className={classNames(styles, border, className)}
            {...rest}
        >
            {children || 'Login / Sign Up'}
        </button>
    );
}
