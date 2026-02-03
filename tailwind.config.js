export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            },
            colors: {
                primary: '#0F2137', // Navy Blue (Official)
                secondary: '#54595F', // Dark Grey
                accent: '#61CE70', // Green
                dark: '#1A1A1A',
                peach: '#FFBC7D',
                'light-blue': '#F0F8FF', // Light background blue
                // Remap legacy colors to new palette to avoid breaking changes immediately
                glow: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#dbeafe', // Blue 100
                    300: '#93c5fd', // Blue 300
                    400: '#60a5fa', // Blue 400
                    500: '#61CE70', // Green
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#1A1A1A', // Dark
                },
                gold: {
                    50: '#F9F1D8',
                    100: '#F9F1D8',
                    200: '#E6F3FF', // Light Blue
                    300: '#FFBC7D', // Peach
                    400: '#0F2137', // Navy
                    500: '#0F2137', // Navy 
                    600: '#54595F',
                    700: '#54595F',
                    800: '#1A1A1A',
                    900: '#1A1A1A',
                },
                emerald: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    800: '#065F46',
                    900: '#1A1A1A',
                    950: '#1A1A1A', // Dark
                    1000: '#000000',
                }
            },
            animation: {
                blob: "blob 10s infinite",
                'fade-up': 'fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in': 'fadeIn 1s ease-out forwards',
                'scale-in': 'scaleIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'marquee': 'marquee 30s linear infinite',
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.2)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.8)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            },
            backgroundImage: {
                'noise': "url('/assets/noise.png')",
            }
        },
    },
    plugins: [],
}
