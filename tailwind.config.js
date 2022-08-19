/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    safelist: [
        {
            pattern: /alert-(success|error)/,
        }
    ],
    theme: {
        extend: {},
    },
    plugins: [require("@tailwindcss/typography"), require('daisyui')],
}
