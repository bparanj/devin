// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
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

  // UI configuration
  ui: {
    icons: ['heroicons', 'simple-icons'],
    primary: 'blue',
    gray: 'cool'
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false
  },

  // Development tools
  devtools: { enabled: true },

  compatibilityDate: '2024-12-29'
})
