/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: "var(--gray)",
        success: "var(--success)",
        "partial-success": "var(--partial-success)",
        "text-color-1": "var(--text-color-1)",
        "text-color-2": "var(--text-color-2)",
        "keyboard-bg": "var(--keyboard-bg)",
        "key-bg": "var(--key-bg)",

      },
    },
  },
  plugins: [],
}

