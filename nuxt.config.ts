// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // UI Pro license configuration
  ui: {
    icons: ['heroicons', 'simple-icons'],
    primary: 'blue',
    gray: 'cool',
    license: process.env.NUXT_UI_PRO_LICENSE
  },
  extends: [
    '@nuxt/ui-pro'
  ],

  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/fonts'
  ],

  // Content configuration
  content: {
    documentDriven: true,
    navigation: {
      fields: ['title', 'description', 'navigation', 'icon']
    },
    highlight: {
      theme: 'github-dark'
    }
  } as any,

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false
  },

  // Development tools
  devtools: { enabled: true },

  compatibilityDate: '2024-12-29'
})
