/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,tsx}',
        './components/**/*.{js,ts,tsx}',
        './context/**/*.{js,ts,tsx}',
    ],

    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                primary: '#ff964f',
                background: '#121212',
            },
        },
    },
    plugins: [],
};
