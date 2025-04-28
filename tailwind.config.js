/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './content/**/*.{md,json}'
    ],
    theme: {
        extend: {
            colors: {
                main: 'var(--background-color-main)',
                inverse: 'var(--background-color-inverse)',
                primary: 'var(--theme-primary)',
                secondary: 'var(--theme-secondary)',
                complementary: 'var(--theme-complementary)',
                dark: 'var(--theme-dark)',
                light: 'var(--theme-light)',
                'on-dark': 'var(--theme-on-dark)',
                'on-light': 'var(--theme-on-light)',
                'on-primary': 'var(--theme-on-primary)',
                'on-secondary': 'var(--theme-on-secondary)',
                'on-complementary': 'var(--theme-on-complementary)'
            },
            textColor: {
                main: 'var(--text-color-main)',
                inverse: 'var(--text-color-inverse)'
            },
            fontFamily: {
                body: 'var(--font-body)'
            }
        }
    },
    plugins: [require('@tailwindcss/typography')]
};
