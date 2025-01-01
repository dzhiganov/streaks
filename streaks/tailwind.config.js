import daisyUI from 'daisyui'

export default {
    plugins: [daisyUI],
    themes: ["light", "dark"],
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