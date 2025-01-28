import daisyUI from 'daisyui';

export default {
  plugins: [daisyUI],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          '.main-card': {
            border: '1px solid #ccc',
          },
          '.border-neutral-content': {
            borderColor: '#e4e1e1',
          },
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          '.main-card': {
            border: '1px solid #2e2e2e',
          },
          '.border-neutral-content': {
            borderColor: '#343434',
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
      sans: ['DM Sans', 'sans-serif'],
    },
  },
  darkMode: ['class', '[data-theme="dark"]'],
};
