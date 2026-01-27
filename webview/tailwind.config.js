/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    green: "#064E3B", // Deep Emerald
                    gold: "#D4AF37",  // Metallic Gold
                    cream: "#FAFAF9", // Warm White
                    dark: "#0F172A",
                }
            },
            fontFamily: {
                serif: ["'Playfair Display'", "serif"],
                sans: ["'Montserrat'", "sans-serif"],
            }
        },
    },
    plugins: [],
}
