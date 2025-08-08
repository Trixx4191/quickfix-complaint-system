
module.exports = {
  // ...
  theme: {
    extend: {
      keyframes: {
        'float-slow': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        'float-mid': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        'float-fast': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
        'slide-in-up': { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } }
      },
      animation: {
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-mid': 'float-mid 6s ease-in-out infinite',
        'float-fast': 'float-fast 4s ease-in-out infinite',
        'slide-in-up': 'slide-in-up 0.5s ease-out both'
      }
    }
  },
  plugins: [],
};
