/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./*.html'],
    theme: {
        extend: {
            colors: {
                'primary-color': '#b4f461',
                'heading-color': '#111111',
                'text-color': 'rgba(17, 17, 17, 0.7)',
                'accent-color': '#b4f461',
                'border-color': '#rgba(17, 17, 17, 0.3)',
                'bg-color': '#f9f7f3',
            },
            fontFamily: {
                manrope: ['Manrope', 'sans-serif'],
            },
        },
        screens: {
            sm: { max: '576px' },
        },
    },
    plugins: [require('daisyui')],
};
