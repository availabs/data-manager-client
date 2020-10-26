// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    borderColor: theme => ({
      ...theme('colors'),
      default: theme('currentColor')
    }),
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))'
      }
    }
  },
  variants: {
    borderRadius: ['responsive', 'first', 'last'],
    borderColor: ['responsive', 'hover', 'focus', 'disabled'],
    margin: ['responsive', 'first', 'last'],
    marginBottom: ['responsive', 'first', 'last'],
    padding: ['responsive', 'first', 'last'],
    backgroundColor: ['responsive', 'hover', 'focus', 'first', 'last', 'odd', 'even', 'disabled'],
    cursor: ['disabled', 'responsive'],
    opacity: ['responsive', 'disabled', 'hover', 'focus'],
    textColor: ['responsive', 'hover', 'focus', 'disabled'],
    fontWeight: ['responsive', 'hover', 'focus', 'disabled']
  },
  plugins: [
    require('@tailwindcss/ui'),
  ]
}
