const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./src/**/*.html'],
  important: true,
  theme: {
    container: {
      center: true
    },
    fontFamily: {
      sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
      serif: [...defaultTheme.fontFamily.serif],
      mono: [...defaultTheme.fontFamily.mono]
    },
    extend: {
      inset: {
        '1/8': '12.5%',
        '1/10': '10%'
      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif']
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
