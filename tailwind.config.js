/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",    // App Router pages
      "./pages/**/*.{js,ts,jsx,tsx}",  // Optional: if using Pages Router
      "./components/**/*.{js,ts,jsx,tsx}", // Your components
    ],
    theme: {
      extend: {
        colors: {
          primary: "#0f172a", // custom dark color
          accent: "#2563eb",  // custom blue accent
        },
      },
    },
    plugins: [],
  };
  