import daisyUI from 'daisyui'

export default {
    plugins: [daisyUI],
    themes: ["light", "dark"],
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
        extend: {
          // width: {
          //   '128': '32rem',
          // }
        },
        fontFamily: {
            body: ['Gabarito', 'sans-serif'],
            header:  ['Space Grotesk', 'sans-serif']
        }
    }
}