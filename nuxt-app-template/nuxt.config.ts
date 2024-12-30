import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    stripeSecretKey: '',
    stripeWebhookKey: '',
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@sidebase/nuxt-auth"
  ],
  routeRules: {
    '/': { ssr: true, prerender: true },
    '/sign-in': { ssr: true, prerender: true },
    '/tos': { ssr: true, prerender: true },
    '/privacy-policy': { ssr: true, prerender: true },
    '/consent-preferences': { ssr: true, prerender: true },
    '/app': { ssr: false }
  },
  app: {
    head: {
        link: [
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            { rel: "preconnect", href: "https://fonts.gstatic.com" },
            { href: "https://fonts.googleapis.com/css2?family=Gabarito:wght@400..900&display=swap", rel: "stylesheet" },
            { href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap", rel: "stylesheet" }
        ],
    }
  },
  auth: {
    baseURL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/auth` : undefined
  }
})
