/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                bg: "#07141D",
                teal: "#7ED6D1",
                light: "#DDE6F0",
                muted: "#888888",
                card: "#1C2B35",
                "separator": "#2A3A45",
                "btn-text": "#001F2B",
            },
        },
    },
    plugins: [],
};
