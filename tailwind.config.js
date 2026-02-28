/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#10B981', // Emerald 500
                secondary: '#0EA5E9', // Sky 500
                dark: '#0F172A', // Slate 900
            }
        },
    },
    plugins: [],
}
