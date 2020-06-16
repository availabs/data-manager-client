// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      }
    }
  },
  variants: {
    borderRadius: ['responsive', 'first', 'last'],
    margin: ['responsive', 'first', 'last'],
    padding: ['responsive', 'first', 'last'],
    backgroundColor: ['responsive', 'hover', 'focus', 'first', 'last', 'odd', 'even']
  },
  plugins: [
    require('@tailwindcss/ui'),
  ]
}
