import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    stripeSecretKey: '',
    stripeWebhookKey: '',
    public: {
      AUTH_ORIGIN: process.env.AUTH_ORIGIN || 'http://localhost:3000',
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'calendar-date' || tag === 'calendar-month',
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@sidebase/nuxt-auth', 'nuxt-mongoose'],
  routeRules: {
    '/': { ssr: true, prerender: true },
    '/sign-in': { ssr: true, prerender: true },
    '/tos': { ssr: true, prerender: true },
    '/privacy-policy': { ssr: true, prerender: true },
    '/app/**': { ssr: false, cache: false, prerender: false },
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        {
          href: 'https://fonts.googleapis.com/css2?family=Gabarito:wght@400..900&display=swap',
          rel: 'stylesheet',
        },
        {
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap',
          rel: 'stylesheet',
        },
        {
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap',
          rel: 'stylesheet',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
  auth: {
    isEnabled: true,
    originEnvKey: process.env.AUTH_ORIGIN || 'http://localhost:3000',
    baseURL: process.env.AUTH_ORIGIN
      ? `${process.env.AUTH_ORIGIN}/api/auth`
      : 'http://localhost:3000/api/auth',
    globalAppMiddleware: true,
    sessionRefresh: {
      enablePeriodically: 1000 * 60,
      enableOnWindowFocus: true,
    },
  },
  css: ['@/assets/main.css'],
  mongoose: {
    uri: process.env.MONGODB_URI + `/production?authSource=admin`,
    options: {},
    modelsDir: 'models',
    devtools: true,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: ['~/plugins/vue-query'],
});
