import daisyUI from 'daisyui';

export default {
  plugins: [daisyUI],
  daisyui: {
    themes: [
      {
        winter: {
          ...require('daisyui/src/theming/themes')['winter'],
          '.main-card': {
            'background-color': '#e6e6e6',
          },
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          '.main-card': {
            'background-color': 'rgb(31, 41, 55)',
          },
        },
      },
    ],
  },
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './utils/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {},
    fontFamily: {
      body: ['Gabarito', 'sans-serif'],
      header: ['Space Grotesk', 'sans-serif'],
      sans: ['Inter', 'sans-serif'],
    },
  },
  darkMode: ['class', '[data-theme="dark"]'],
};
