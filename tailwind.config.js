import daisyUI from 'daisyui';

export default {
  darkMode: 'class',
  plugins: [daisyUI],
  themes: ['light', 'dark'],
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
    },
  },
  darkMode: ['selector', '[data-theme="dark"]'],
};
