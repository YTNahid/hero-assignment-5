/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./*.html'],
    theme: {
        extend: {
            colors: {
                'primary-color': '#212121',
                'text-color-dark': '#494949',
                'text-color-light': '#737373',
                'accent-color': '#ABEF5F',
                'border-color': '#e9e9e9',
                'bg-color': '#f4f4f4',
            },
            fontFamily: {
                manrope: ['Manrope', 'sans-serif'],
            },
        },
    },
    plugins: [require('daisyui')],
};
