/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#ecb613",
                "primary-hover": "#D4A017",
                "background-light": "#f8f8f6",
                "background-dark": "#221d10",
                "charcoal": "#1b180d",
                "charcoal-light": "#3b3830",
                "surface-light": "#ffffff",
                "surface-dark": "#2c2618",
                "text-main": "#1b180d",
                "text-muted": "#6b6656",
                "border-color": "#e7e1cf",
                "accent-green": "#1E3A3A",
            },
            fontFamily: {
                "display": ["Manrope", "Playfair Display", "serif"],
                "serif": ["Playfair Display", "Noto Serif", "serif"],
                "sans": ["Manrope", "Noto Sans", "sans-serif"],
                "body": ["Manrope", "sans-serif"],
            },
            borderRadius: {
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "1rem",
            },
            boxShadow: {
                'glow': '0 0 20px rgba(230, 179, 37, 0.15)',
                'soft': '0 4px 20px -2px rgba(27, 24, 13, 0.05)',
            }
        },
    },
    plugins: [],
}
