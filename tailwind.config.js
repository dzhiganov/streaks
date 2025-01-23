import daisyUI from 'daisyui';

export default {
  plugins: [daisyUI],
  daisyui: {
    themes: [
      {
        lofi: {
          ...require('daisyui/src/theming/themes')['lofi'],
          '.main-card': {
            border: '1px solid #ccc',
          },
        },
      },
      {
        business: {
          ...require('daisyui/src/theming/themes')['business'],
          '.main-card': {
            border: '1px solid #2e2e2e',
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
  darkMode: ['class', '[data-theme="business"]'],
};
