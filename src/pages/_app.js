
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import '../css/main.css';
import { generateGlobalCssVariables } from '../utils/theme-style-utils';

// Optimize loading of AuthModal
const AuthModal = dynamic(() => import('../components/AuthModal'), {
    ssr: false,
    loading: () => null
});

import { AuthProvider } from '../contexts/AuthContext';

const ErrorBoundary = dynamic(() => import('../components/ErrorBoundary'), {
    ssr: false
});

export default function MyApp({ Component, pageProps }) {
    const { global, ...page } = pageProps;
    const { theme } = global || {};
    const [isMounted, setIsMounted] = useState(false);

    const cssVars = generateGlobalCssVariables(theme);

    useEffect(() => {
        setIsMounted(true);
        document.body.setAttribute('data-theme', page.colors || 'colors-a');
    }, [page.colors]);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="AICERA - Advanced IT Solutions" />
                <meta name="theme-color" content="#000000" />
                <link rel="icon" href="/images/favicon.svg" />
            </Head>
            <style jsx global>{`
                :root {
                    ${cssVars}
                }
            `}</style>
            <ErrorBoundary>
                <AuthProvider>
                    <AuthModal />
                    {isMounted ? <Component {...pageProps} /> : null}
                </AuthProvider>
            </ErrorBoundary>
        </>
    );
}
