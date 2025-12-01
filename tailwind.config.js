/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neoblue: '#000033',
                neogray: '#878787',
            },
        },
    },
    plugins: [],
}
