module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0b1021',
        ink: '#e2e8f0',
        accent: '#22d3ee',
        'accent-warm': '#fbbf24'
      },
      boxShadow: {
        glow: '0 10px 60px -20px rgba(34,211,238,0.35)'
      },
      fontFamily: {
        display: ['Space Grotesk', 'Fira Sans', 'Segoe UI', 'sans-serif']
      }
    }
  },
  plugins: []
};
